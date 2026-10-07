import { MealType } from './menu-item.model';

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMode = 'ONLINE' | 'CASH' | 'PAY_LATER';
export type PaymentStatus = 'PENDING' | 'PAID' | 'COD_PENDING' | 'FAILED';

export interface OrderItem {
  id: string;
  dailyMenuItemId: string;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  floorId: string;
  floorNumber: number;
  assignedStaffId?: string;
  assignedStaffName?: string;
  mealType: MealType;
  orderDate: string;
  status: OrderStatus;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  deliveredAt?: string;
  notes?: string;
}

export interface PlaceOrderRequest {
  mealType: MealType;
  paymentMode: PaymentMode;
  items: {
    dailyMenuItemId: string;
    quantity: number;
  }[];
  notes?: string;
}