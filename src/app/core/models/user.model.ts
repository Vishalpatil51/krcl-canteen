export type UserRole =
  | 'SUPER_ADMIN'
  | 'CANTEEN_ADMIN'
  | 'COUNTER_STAFF'
  | 'KITCHEN_STAFF'
  | 'DELIVERY_STAFF'
  | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  employeeId?: string;
  mobile: string;
  role: UserRole;
  floorId?: string;
  floorNumber?: number;
  isActive: boolean;
  fcmToken?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface OtpRequest {
  mobile: string;
}

export interface OtpVerify {
  mobile: string;
  otp: string;
}