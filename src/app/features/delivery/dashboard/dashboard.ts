import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models';

@Component({
  selector: 'app-delivery-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DeliveryDashboard {
  private auth = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  user = this.auth.currentUser;
  activeTab = signal<'PENDING' | 'ACTIVE' | 'DELIVERED'>('ACTIVE');

  // Demo: Delivery Staff A = floors 5, 6 (baad me backend se aayega)
  assignedFloors = [5, 6];

  tabs = [
    { key: 'PENDING' as const, label: 'Pending Pickup', icon: '⏳' },
    { key: 'ACTIVE' as const, label: 'Out for Delivery', icon: '🚶' },
    { key: 'DELIVERED' as const, label: 'Delivered', icon: '✅' },
  ];

  get orders(): Order[] {
    const all = this.orderService.getAllOrders();
    const floorFiltered = all.filter((o) =>
      this.assignedFloors.includes(o.floorNumber)
    );

    const tab = this.activeTab();
    if (tab === 'PENDING') {
      return floorFiltered.filter((o) => o.status === 'READY');
    }
    if (tab === 'ACTIVE') {
      return floorFiltered.filter((o) => o.status === 'OUT_FOR_DELIVERY');
    }
    return floorFiltered.filter((o) => o.status === 'DELIVERED');
  }

  countByTab(tab: 'PENDING' | 'ACTIVE' | 'DELIVERED'): number {
    const all = this.orderService.getAllOrders();
    const floorFiltered = all.filter((o) =>
      this.assignedFloors.includes(o.floorNumber)
    );
    if (tab === 'PENDING') return floorFiltered.filter((o) => o.status === 'READY').length;
    if (tab === 'ACTIVE') return floorFiltered.filter((o) => o.status === 'OUT_FOR_DELIVERY').length;
    return floorFiltered.filter((o) => o.status === 'DELIVERED').length;
  }

  setTab(tab: 'PENDING' | 'ACTIVE' | 'DELIVERED'): void {
    this.activeTab.set(tab);
  }

  pickUp(order: Order): void {
    this.orderService.updateStatus(order.id, 'OUT_FOR_DELIVERY');
    this.activeTab.set('ACTIVE');
  }

  markDelivered(order: Order): void {
    this.orderService.updateStatus(order.id, 'DELIVERED');
  }

  collectCash(order: Order): void {
    this.orderService.updatePaymentStatus(order.id, 'PAID');
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}