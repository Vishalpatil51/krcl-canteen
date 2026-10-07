import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class AdminReports {
  private auth = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  user = this.auth.currentUser;
  activePeriod = signal<'TODAY' | 'WEEK' | 'MONTH' | 'ALL'>('TODAY');

  periods = [
    { key: 'TODAY' as const, label: 'Today' },
    { key: 'WEEK' as const, label: 'Last 7 Days' },
    { key: 'MONTH' as const, label: 'This Month' },
    { key: 'ALL' as const, label: 'All Time' },
  ];

  get allOrders(): Order[] {
    return this.orderService.getAllOrders();
  }

  get filteredOrders(): Order[] {
    const all = this.allOrders;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const period = this.activePeriod();
    if (period === 'ALL') return all;

    const cutoff =
      period === 'TODAY' ? startOfToday :
      period === 'WEEK' ? startOfWeek :
      startOfMonth;

    return all.filter((o) => new Date(o.createdAt) >= cutoff);
  }

  get summary() {
    const orders = this.filteredOrders;
    const paid = orders.filter((o) => o.paymentStatus === 'PAID');
    const delivered = orders.filter((o) => o.status === 'DELIVERED');
    const cancelled = orders.filter((o) => o.status === 'CANCELLED');

    return {
      totalOrders: orders.length,
      totalRevenue: paid.reduce((s, o) => s + o.totalAmount, 0),
      deliveredCount: delivered.length,
      cancelledCount: cancelled.length,
      avgOrderValue:
        orders.length > 0
          ? Math.round(paid.reduce((s, o) => s + o.totalAmount, 0) / Math.max(paid.length, 1))
          : 0,
    };
  }

  get topItems(): { name: string; qty: number; revenue: number }[] {
    const map = new Map<string, { qty: number; revenue: number }>();
    for (const o of this.filteredOrders) {
      if (o.status === 'CANCELLED') continue;
      for (const it of o.items) {
        const curr = map.get(it.itemName) ?? { qty: 0, revenue: 0 };
        curr.qty += it.quantity;
        curr.revenue += it.total;
        map.set(it.itemName, curr);
      }
    }
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, qty: v.qty, revenue: v.revenue }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8);
  }

  get ordersByFloor(): { floor: number; count: number; revenue: number }[] {
    const map = new Map<number, { count: number; revenue: number }>();
    for (const o of this.filteredOrders) {
      if (o.status === 'CANCELLED') continue;
      const curr = map.get(o.floorNumber) ?? { count: 0, revenue: 0 };
      curr.count += 1;
      curr.revenue += o.totalAmount;
      map.set(o.floorNumber, curr);
    }
    return Array.from(map.entries())
      .map(([floor, v]) => ({ floor, count: v.count, revenue: v.revenue }))
      .sort((a, b) => a.floor - b.floor);
  }

  get statusBreakdown(): { status: string; count: number; color: string }[] {
    const all = this.filteredOrders;
    return [
      { status: 'PLACED', count: all.filter((o) => o.status === 'PLACED').length, color: '#ff9800' },
      { status: 'ACCEPTED', count: all.filter((o) => o.status === 'ACCEPTED').length, color: '#2196f3' },
      { status: 'PREPARING', count: all.filter((o) => o.status === 'PREPARING').length, color: '#ff5722' },
      { status: 'READY', count: all.filter((o) => o.status === 'READY').length, color: '#4caf50' },
      { status: 'OUT_FOR_DELIVERY', count: all.filter((o) => o.status === 'OUT_FOR_DELIVERY').length, color: '#9c27b0' },
      { status: 'DELIVERED', count: all.filter((o) => o.status === 'DELIVERED').length, color: '#1b6e3a' },
      { status: 'CANCELLED', count: all.filter((o) => o.status === 'CANCELLED').length, color: '#b71c1c' },
    ].filter((s) => s.count > 0);
  }

  get mealSplit(): { breakfast: number; lunch: number } {
    const orders = this.filteredOrders.filter((o) => o.status !== 'CANCELLED');
    return {
      breakfast: orders.filter((o) => o.mealType === 'BREAKFAST').length,
      lunch: orders.filter((o) => o.mealType === 'LUNCH').length,
    };
  }

  get paymentSplit(): { online: number; cash: number; pending: number } {
    const orders = this.filteredOrders;
    return {
      online: orders.filter((o) => o.paymentMode === 'ONLINE' && o.paymentStatus === 'PAID').length,
      cash: orders.filter((o) => o.paymentMode === 'CASH' && o.paymentStatus === 'PAID').length,
      pending: orders.filter((o) => o.paymentStatus !== 'PAID').length,
    };
  }

  setPeriod(p: 'TODAY' | 'WEEK' | 'MONTH' | 'ALL'): void {
    this.activePeriod.set(p);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}