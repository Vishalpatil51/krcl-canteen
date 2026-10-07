import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MenuService } from '../../../core/services/menu.service';
import { OrderService } from '../../../core/services/order.service';
import { CartService } from '../../../core/services/cart.service';
import { MealType, PaymentMode } from '../../../core/models';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class EmployeeDashboard {
  private auth = inject(AuthService);
  private menuService = inject(MenuService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  cart = inject(CartService);

  user = this.auth.currentUser;
  breakfast = this.menuService.breakfastMenu;
  lunch = this.menuService.lunchMenu;

  activeMeal = signal<MealType>('BREAKFAST');
  showCart = signal(false);
  showCheckout = signal(false);
  paymentMode = signal<PaymentMode>('ONLINE');
  placingOrder = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  get currentMenu() {
    return this.activeMeal() === 'BREAKFAST'
      ? this.breakfast()
      : this.lunch();
  }

  setMeal(meal: MealType): void {
    this.activeMeal.set(meal);
    this.cart.setMeal(meal);
  }

  addToCart(item: any): void {
    this.cart.addItem(item);
  }

  removeFromCart(itemId: string): void {
    this.cart.removeItem(itemId);
  }

  openCart(): void {
    this.showCart.set(true);
  }

  closeCart(): void {
    this.showCart.set(false);
  }

  openCheckout(): void {
    this.showCart.set(false);
    this.showCheckout.set(true);
  }

  closeCheckout(): void {
    this.showCheckout.set(false);
    this.errorMessage.set('');
  }

  goToOrders(): void {
    this.router.navigate(['/employee/orders']);
  }

  placeOrder(): void {
    const u = this.user();
    if (!u) return;
    if (this.cart.totalItems() === 0) {
      this.errorMessage.set('Cart is empty');
      return;
    }

    this.placingOrder.set(true);
    this.errorMessage.set('');

    const request = {
      mealType: this.activeMeal(),
      paymentMode: this.paymentMode(),
      items: this.cart.cart().map((c) => ({
        dailyMenuItemId: c.item.id,
        itemName: c.item.name,
        quantity: c.quantity,
        price: c.item.price,
      })),
    };

    this.orderService
      .placeOrder(request, {
        id: u.id,
        name: u.name,
        floorId: u.floorId,
        floorNumber: u.floorNumber,
      })
      .then((order) => {
        this.placingOrder.set(false);
        this.cart.clear();
        this.showCheckout.set(false);
        this.successMessage.set(
          `Order placed! Order #${order.orderNumber}. Total ₹${order.totalAmount}`
        );
        setTimeout(() => this.successMessage.set(''), 5000);
      })
      .catch((err) => {
        this.placingOrder.set(false);
        this.errorMessage.set('Failed to place order: ' + err.message);
      });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}