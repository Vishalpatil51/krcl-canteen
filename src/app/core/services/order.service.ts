import { Injectable, signal } from '@angular/core';
import { Order, OrderStatus, PlaceOrderRequest, PaymentStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private ordersSignal = signal<Order[]>([]);
  readonly orders = this.ordersSignal.asReadonly();

  constructor() {
    this.loadMockOrders();
  }

  placeOrder(
    request: PlaceOrderRequest,
    user: { id: string; name: string; floorId?: string; floorNumber?: number }
  ): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalAmount = this.calculateTotal(request);
        const order: Order = {
          id: 'ord-' + Date.now(),
          orderNumber: 'KRCL-' + String(Date.now()).slice(-6),
          userId: user.id,
          userName: user.name,
          floorId: user.floorId ?? 'f-6',
          floorNumber: user.floorNumber ?? 6,
          mealType: request.mealType,
          orderDate: new Date().toISOString().split('T')[0],
          status: 'PLACED',
          paymentMode: request.paymentMode,
          paymentStatus: request.paymentMode === 'ONLINE' ? 'PAID' : 'PENDING',
          totalAmount,
          items: request.items.map((i) => ({
            id: 'oi-' + Math.random().toString(36).slice(2, 9),
            dailyMenuItemId: i.dailyMenuItemId,
            itemName: 'Item',
            quantity: i.quantity,
            price: 0,
            total: 0,
          })),
          createdAt: new Date().toISOString(),
          notes: request.notes,
        };

        this.ordersSignal.update((list) => [order, ...list]);
        resolve(order);
      }, 600);
    });
  }

  getOrdersByUser(userId: string): Order[] {
    return this.ordersSignal().filter((o) => o.userId === userId);
  }

  getOrdersByFloor(floorNumber: number): Order[] {
    return this.ordersSignal().filter((o) => o.floorNumber === floorNumber);
  }

  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.ordersSignal().filter((o) => o.status === status);
  }

  getAllOrders(): Order[] {
    return this.ordersSignal();
  }

  updateStatus(orderId: string, status: OrderStatus): void {
    this.ordersSignal.update((list) =>
      list.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  }

  updatePaymentStatus(orderId: string, status: PaymentStatus): void {
    this.ordersSignal.update((list) =>
      list.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o))
    );
  }

  private calculateTotal(request: PlaceOrderRequest): number {
    // Mock: real me menu se price aayega
    return request.items.reduce((sum, i) => sum + i.quantity * 30, 0);
  }

  private loadMockOrders(): void {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const t1 = new Date(now.getTime() - 15 * 60000).toISOString();
    const t2 = new Date(now.getTime() - 10 * 60000).toISOString();
    const t3 = new Date(now.getTime() - 5 * 60000).toISOString();

    const mock: Order[] = [
      // Floor 6 — delivery staff ke assigned floors me
      {
        id: 'ord-demo-1',
        orderNumber: 'KRCL-100001',
        userId: 'u-9999999999',
        userName: 'Ramesh Kumar',
        floorId: 'f-6',
        floorNumber: 6,
        assignedStaffId: 'u-5555555555',
        assignedStaffName: 'Delivery Staff A',
        mealType: 'BREAKFAST',
        orderDate: today,
        status: 'READY',
        paymentMode: 'ONLINE',
        paymentStatus: 'PAID',
        totalAmount: 60,
        items: [
          {
            id: 'oi-1',
            dailyMenuItemId: 'b1',
            itemName: 'Poha',
            quantity: 2,
            price: 30,
            total: 60,
          },
        ],
        createdAt: t1,
      },
      {
        id: 'ord-demo-2',
        orderNumber: 'KRCL-100002',
        userId: 'u-8888888888',
        userName: 'Suresh Patil',
        floorId: 'f-5',
        floorNumber: 5,
        assignedStaffId: 'u-5555555555',
        assignedStaffName: 'Delivery Staff A',
        mealType: 'BREAKFAST',
        orderDate: today,
        status: 'OUT_FOR_DELIVERY',
        paymentMode: 'CASH',
        paymentStatus: 'COD_PENDING',
        totalAmount: 40,
        items: [
          {
            id: 'oi-3',
            dailyMenuItemId: 'b3',
            itemName: 'Idli',
            quantity: 1,
            price: 40,
            total: 40,
          },
        ],
        createdAt: t2,
      },
      {
        id: 'ord-demo-3',
        orderNumber: 'KRCL-100003',
        userId: 'u-1111111111',
        userName: 'Anil Jadhav',
        floorId: 'f-6',
        floorNumber: 6,
        assignedStaffId: 'u-5555555555',
        assignedStaffName: 'Delivery Staff A',
        mealType: 'BREAKFAST',
        orderDate: today,
        status: 'DELIVERED',
        paymentMode: 'ONLINE',
        paymentStatus: 'PAID',
        totalAmount: 45,
        items: [
          {
            id: 'oi-4',
            dailyMenuItemId: 'b5',
            itemName: 'Coffee',
            quantity: 3,
            price: 15,
            total: 45,
          },
        ],
        createdAt: t3,
        deliveredAt: now.toISOString(),
      },
    ];
    this.ordersSignal.set(mock);
  }
}