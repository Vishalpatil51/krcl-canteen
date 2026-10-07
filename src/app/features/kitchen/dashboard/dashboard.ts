import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models';

@Component({
  selector: 'app-kitchen-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class KitchenDashboard {
  private auth = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  user = this.auth.currentUser;
  activeTab = signal<'ACCEPTED' | 'PREPARING' | 'READY'>('ACCEPTED');

  tabs = [
    { key: 'ACCEPTED' as const, label: 'New Orders', icon: '🆕' },
    { key: 'PREPARING' as const, label: 'Cooking', icon: '👨‍🍳' },
    { key: 'READY' as const, label: 'Ready', icon: '✅' },
  ];

  get orders(): Order[] {
    return this.orderService.getOrdersByStatus(this.activeTab());
  }

  countByStatus(status: 'ACCEPTED' | 'PREPARING' | 'READY'): number {
    return this.orderService.getOrdersByStatus(status).length;
  }

  setTab(tab: 'ACCEPTED' | 'PREPARING' | 'READY'): void {
    this.activeTab.set(tab);
  }

  startCooking(order: Order): void {
    this.orderService.updateStatus(order.id, 'PREPARING');
    this.activeTab.set('PREPARING');
  }

  markReady(order: Order): void {
    this.orderService.updateStatus(order.id, 'READY');
    this.activeTab.set('READY');
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