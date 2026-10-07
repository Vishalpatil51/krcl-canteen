import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'employee',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/employee/dashboard/dashboard').then(
        (m) => m.EmployeeDashboard
      ),
  },
  {
    path: 'employee/orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/employee/order-history/order-history').then(
        (m) => m.OrderHistory
      ),
  },
  {
    path: 'canteen',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/canteen/dashboard/dashboard').then(
        (m) => m.CanteenDashboard
      ),
  },
  {
    path: 'kitchen',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/kitchen/dashboard/dashboard').then(
        (m) => m.KitchenDashboard
      ),
  },
  {
    path: 'delivery',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/delivery/dashboard/dashboard').then(
        (m) => m.DeliveryDashboard
      ),
  },
  { path: '**', redirectTo: 'login' },
];