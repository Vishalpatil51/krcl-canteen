import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  mobile = signal('');
  otp = signal('');
  step = signal<'mobile' | 'otp'>('mobile');
  loading = signal(false);
  error = signal('');
  message = signal('');

  sendOtp(): void {
    this.error.set('');
    const m = this.mobile().trim();

    // Demo: 5-9 se start hone wale 10-digit numbers allow
    if (!/^[5-9]\d{9}$/.test(m)) {
      this.error.set('Enter valid 10-digit mobile number');
      return;
    }

    this.loading.set(true);
    this.auth.sendOtp(m).then((res) => {
      this.loading.set(false);
      if (res.success) {
        this.step.set('otp');
        this.message.set('OTP sent! Demo OTP: 123456');
      } else {
        this.error.set(res.message);
      }
    });
  }

  verifyOtp(): void {
    this.error.set('');
    const code = this.otp().trim();

    if (code.length !== 6) {
      this.error.set('Enter 6-digit OTP');
      return;
    }

    this.loading.set(true);
    this.auth.verifyOtp(this.mobile(), code).then((res) => {
      this.loading.set(false);
      if (res.success && res.user) {
        this.redirectByRole(res.user.role);
      } else {
        this.error.set(res.message);
      }
    });
  }

  backToMobile(): void {
    this.step.set('mobile');
    this.otp.set('');
    this.error.set('');
    this.message.set('');
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'CANTEEN_ADMIN':
      case 'SUPER_ADMIN':
        this.router.navigate(['/canteen']);
        break;
      case 'KITCHEN_STAFF':
        this.router.navigate(['/kitchen']);
        break;
      case 'DELIVERY_STAFF':
        this.router.navigate(['/delivery']);
        break;
      default:
        this.router.navigate(['/employee']);
    }
  }
}