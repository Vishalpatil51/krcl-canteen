import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss',
})
export class OrderHistory {
  private auth = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  user = this.auth.currentUser;
  activeFilter = signal<'ALL' | 'ACTIVE' | 'PAST'>('ALL');

  activeStatuses: OrderStatus[] = [
    'PLACED',
    'ACCEPTED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
  ];

  get allMyOrders(): Order[] {
    const u = this.user();
    if (!u) return [];
    return this.orderService
      .getOrdersByUser(u.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  get activeOrders(): Order[] {
    return this.allMyOrders.filter((o) =>
      this.activeStatuses.includes(o.status)
    );
  }

  get pastOrders(): Order[] {
    return this.allMyOrders.filter(
      (o) => !this.activeStatuses.includes(o.status)
    );
  }

  get filteredOrders(): Order[] {
    const f = this.activeFilter();
    if (f === 'ACTIVE') return this.activeOrders;
    if (f === 'PAST') return this.pastOrders;
    return this.allMyOrders;
  }

  setFilter(f: 'ALL' | 'ACTIVE' | 'PAST'): void {
    this.activeFilter.set(f);
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  statusLabel(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      PLACED: 'Order Placed',
      ACCEPTED: 'Accepted by Canteen',
      PREPARING: 'Being Prepared',
      READY: 'Ready for Pickup',
      OUT_FOR_DELIVERY: 'Out for Delivery',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled',
    };
    return map[status];
  }

  statusIcon(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      PLACED: '📝',
      ACCEPTED: '✅',
      PREPARING: '👨‍🍳',
      READY: '🍽️',
      OUT_FOR_DELIVERY: '🚶',
      DELIVERED: '🎉',
      CANCELLED: '❌',
    };
    return map[status];
  }

  goToMenu(): void {
    this.router.navigate(['/employee']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}