import { Injectable, signal, computed } from '@angular/core';
import { User, UserRole } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'krcl_token';
  private readonly USER_KEY = 'krcl_user';

  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  readonly userRole = computed<UserRole | null>(
    () => this.currentUserSignal()?.role ?? null
  );

  // Mock login - baad me API se replace hoga
  sendOtp(mobile: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[MOCK] OTP sent to ${mobile}. Use 123456 to login.`);
        resolve({ success: true, message: 'OTP sent successfully' });
      }, 800);
    });
  }

  verifyOtp(mobile: string, otp: string): Promise<{ success: boolean; user?: User; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp !== '123456') {
          resolve({ success: false, message: 'Invalid OTP' });
          return;
        }

        // Mock user - role demo ke liye mobile number se decide kar rahe hain
        const user = this.getMockUser(mobile);
        const token = 'mock-jwt-token-' + Date.now();

        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSignal.set(user);

        resolve({ success: true, user, message: 'Login successful' });
      }, 800);
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadUserFromStorage(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  // Demo ke liye alag-alag mobile number se alag role milta hai
  private getMockUser(mobile: string): User {
    const base: User = {
      id: 'u-' + mobile,
      name: 'Demo User',
      mobile,
      role: 'EMPLOYEE',
      floorNumber: 6,
      floorId: 'f-6',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    if (mobile === '9999999999') {
      return { ...base, name: 'Super Admin', role: 'SUPER_ADMIN' };
    }
    if (mobile === '8888888888') {
      return { ...base, name: 'Canteen Manager', role: 'CANTEEN_ADMIN' };
    }
    if (mobile === '7777777777') {
      return { ...base, name: 'Counter Staff', role: 'COUNTER_STAFF' };
    }
    if (mobile === '6666666666') {
      return { ...base, name: 'Chef Ram', role: 'KITCHEN_STAFF' };
    }
    if (mobile === '5555555555') {
      return {
        ...base,
        name: 'Delivery Staff A',
        role: 'DELIVERY_STAFF',
        floorNumber: undefined,
        floorId: undefined,
      };
    }
    return base;
  }
}