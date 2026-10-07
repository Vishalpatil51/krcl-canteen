import { Injectable, signal, computed } from '@angular/core';
import { DailyMenuItem, MealType } from '../models';

export interface CartItem {
  item: DailyMenuItem;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSignal = signal<CartItem[]>([]);
  private mealSignal = signal<MealType>('BREAKFAST');

  readonly cart = this.cartSignal.asReadonly();
  readonly meal = this.mealSignal.asReadonly();

  readonly totalItems = computed(() =>
    this.cartSignal().reduce((sum, c) => sum + c.quantity, 0)
  );

  readonly totalAmount = computed(() =>
    this.cartSignal().reduce((sum, c) => sum + c.quantity * c.item.price, 0)
  );

  setMeal(meal: MealType): void {
    if (this.mealSignal() !== meal) {
      this.cartSignal.set([]); // meal change pe cart clear
      this.mealSignal.set(meal);
    }
  }

  addItem(item: DailyMenuItem): void {
    this.cartSignal.update((list) => {
      const existing = list.find((c) => c.item.id === item.id);
      if (existing) {
        return list.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...list, { item, quantity: 1 }];
    });
  }

  removeItem(itemId: string): void {
    this.cartSignal.update((list) =>
      list
        .map((c) =>
          c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        )
        .filter((c) => c.quantity > 0)
    );
  }

  clear(): void {
    this.cartSignal.set([]);
  }

  getQuantity(itemId: string): number {
    const found = this.cartSignal().find((c) => c.item.id === itemId);
    return found ? found.quantity : 0;
  }
}