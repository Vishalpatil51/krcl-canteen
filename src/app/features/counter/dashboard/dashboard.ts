import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models';

@Component({
  selector: 'app-counter-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class CounterDashboard {
  private auth = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  user = this.auth.currentUser;
  activeTab = signal<'CASH_PENDING' | 'PAID_TODAY' | 'REPORT'>('CASH_PENDING');

  tabs = [
    { key: 'CASH_PENDING' as const, label: 'Cash Pending', icon: '⏳' },
    { key: 'PAID_TODAY' as const, label: 'Paid Today', icon: '✅' },
    { key: 'REPORT' as const, label: 'Daily Report', icon: '📊' },
  ];

  get allOrders(): Order[] {
    return this.orderService.getAllOrders();
  }

  get cashPendingOrders(): Order[] {
    return this.allOrders.filter(
      (o) => o.paymentMode === 'CASH' && o.paymentStatus !== 'PAID'
    );
  }

  get paidTodayOrders(): Order[] {
    return this.allOrders.filter((o) => o.paymentStatus === 'PAID');
  }

  get currentList(): Order[] {
    const tab = this.activeTab();
    if (tab === 'CASH_PENDING') return this.cashPendingOrders;
    if (tab === 'PAID_TODAY') return this.paidTodayOrders;
    return [];
  }

  // Report calculations
  get report() {
    const all = this.allOrders;
    const paid = all.filter((o) => o.paymentStatus === 'PAID');
    const pending = all.filter((o) => o.paymentStatus !== 'PAID');

    const onlinePaid = paid.filter((o) => o.paymentMode === 'ONLINE');
    const cashPaid = paid.filter((o) => o.paymentMode === 'CASH');

    return {
      totalOrders: all.length,
      totalCollected: paid.reduce((s, o) => s + o.totalAmount, 0),
      onlineCollected: onlinePaid.reduce((s, o) => s + o.totalAmount, 0),
      cashCollected: cashPaid.reduce((s, o) => s + o.totalAmount, 0),
      onlineCount: onlinePaid.length,
      cashCount: cashPaid.length,
      pendingAmount: pending.reduce((s, o) => s + o.totalAmount, 0),
      pendingCount: pending.length,
    };
  }

  countByTab(tab: 'CASH_PENDING' | 'PAID_TODAY'): number {
    if (tab === 'CASH_PENDING') return this.cashPendingOrders.length;
    return this.paidTodayOrders.length;
  }

  setTab(tab: 'CASH_PENDING' | 'PAID_TODAY' | 'REPORT'): void {
    this.activeTab.set(tab);
  }

  markPaid(order: Order): void {
    if (!confirm(`Confirm cash collected: ₹${order.totalAmount} from ${order.userName}?`)) {
      return;
    }
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