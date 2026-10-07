import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models';

@Component({
  selector: 'app-canteen-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class CanteenDashboard {
  private auth = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  user = this.auth.currentUser;
  activeTab = signal<OrderStatus | 'ALL'>('ALL');

  tabs: { key: OrderStatus | 'ALL'; label: string; icon: string }[] = [
    { key: 'ALL', label: 'All', icon: '📋' },
    { key: 'PLACED', label: 'New', icon: '🆕' },
    { key: 'PREPARING', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'READY', label: 'Ready', icon: '✅' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out', icon: '🚶' },
    { key: 'DELIVERED', label: 'Delivered', icon: '🎉' },
  ];

  get orders() {
    const tab = this.activeTab();
    return tab === 'ALL'
      ? this.orderService.getAllOrders()
      : this.orderService.getOrdersByStatus(tab as OrderStatus);
  }

  countByStatus(status: OrderStatus): number {
    return this.orderService.getOrdersByStatus(status).length;
  }

  setTab(key: OrderStatus | 'ALL'): void {
    this.activeTab.set(key);
  }

  nextStatus(current: OrderStatus): OrderStatus | null {
    const flow: OrderStatus[] = [
      'PLACED',
      'ACCEPTED',
      'PREPARING',
      'READY',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
    ];
    const idx = flow.indexOf(current);
    return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  }

  advance(order: Order): void {
    const next = this.nextStatus(order.status);
    if (next) this.orderService.updateStatus(order.id, next);
  }

  cancel(order: Order): void {
    if (confirm('Cancel this order?')) {
      this.orderService.updateStatus(order.id, 'CANCELLED');
    }
  }

  markPaid(order: Order): void {
    this.orderService.updatePaymentStatus(order.id, 'PAID');
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  goToMenuManagement(): void {
    this.router.navigate(['/canteen/menu']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}