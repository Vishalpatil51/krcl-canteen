import { Injectable, signal } from '@angular/core';
import { DailyMenu, DailyMenuItem, MealType } from '../models';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private breakfastMenuSignal = signal<DailyMenu | null>(null);
  private lunchMenuSignal = signal<DailyMenu | null>(null);

  readonly breakfastMenu = this.breakfastMenuSignal.asReadonly();
  readonly lunchMenu = this.lunchMenuSignal.asReadonly();

  constructor() {
    // Mock data load karo
    this.loadMockMenus();
  }

  getMenuByMeal(meal: MealType): DailyMenu | null {
    return meal === 'BREAKFAST'
      ? this.breakfastMenuSignal()
      : this.lunchMenuSignal();
  }

  // Mock data - baad me API se replace hoga
  private loadMockMenus(): void {
    const today = new Date().toISOString().split('T')[0];

    const breakfastItems: DailyMenuItem[] = [
      {
        id: 'b1', menuItemId: 'm-poha', name: 'Poha', category: 'POHA',
        unit: 'plate', price: 30, availableQty: 200, soldQty: 0, isOutOfStock: false,
      },
      {
        id: 'b2', menuItemId: 'm-upma', name: 'Upma', category: 'UPMA',
        unit: 'plate', price: 30, availableQty: 150, soldQty: 0, isOutOfStock: false,
      },
      {
        id: 'b3', menuItemId: 'm-idli', name: 'Idli (2 pcs)', category: 'IDLI',
        unit: 'plate', price: 40, availableQty: 100, soldQty: 0, isOutOfStock: false,
      },
      {
        id: 'b4', menuItemId: 'm-tea', name: 'Tea', category: 'TEA',
        unit: 'cup', price: 10, availableQty: 500, soldQty: 0, isOutOfStock: false,
      },
      {
        id: 'b5', menuItemId: 'm-coffee', name: 'Coffee', category: 'COFFEE',
        unit: 'cup', price: 15, availableQty: 300, soldQty: 0, isOutOfStock: false,
      },
    ];

    const lunchItems: DailyMenuItem[] = [
      {
        id: 'l1', menuItemId: 'm-roti', name: 'Roti', category: 'ROTI',
        unit: 'pc', price: 5, availableQty: 1000, soldQty: 0, isOutOfStock: false,
      },
      {
        id: 'l2', menuItemId: 'm-rice', name: 'Rice', category: 'RICE',
        unit: 'plate', price: 30, availableQty: 500, soldQty: 0, isOutOfStock: false,
      },
      {
        id: 'l3', menuItemId: 'm-dal', name: 'Dal', category: 'DAL',
        unit: 'bowl', price: 40, availableQty: 400, soldQty: 0, isOutOfStock: false,
      },
      {
        id: 'l4', menuItemId: 'm-sabji1', name: 'Aloo Gobi', category: 'SABJI',
        unit: 'bowl', price: 50, availableQty: 200, soldQty: 0, isOutOfStock: false,
      },
      {
        id: 'l5', menuItemId: 'm-sabji2', name: 'Bhindi Masala', category: 'SABJI',
        unit: 'bowl', price: 50, availableQty: 150, soldQty: 0, isOutOfStock: false,
      },
      {
        id: 'l6', menuItemId: 'm-combo', name: 'Combo (Roti+Rice+Dal+Sabji)', category: 'COMBO',
        unit: 'plate', price: 90, availableQty: 300, soldQty: 0, isOutOfStock: false,
      },
      {
        id: 'l7', menuItemId: 'm-curd', name: 'Curd', category: 'CURD',
        unit: 'bowl', price: 20, availableQty: 200, soldQty: 0, isOutOfStock: false,
      },
    ];

    this.breakfastMenuSignal.set({
      id: 'menu-b-' + today,
      date: today,
      mealType: 'BREAKFAST',
      startTime: '08:00',
      endTime: '10:00',
      cutoffTime: '09:45',
      items: breakfastItems,
      isActive: true,
    });

    this.lunchMenuSignal.set({
      id: 'menu-l-' + today,
      date: today,
      mealType: 'LUNCH',
      startTime: '12:30',
      endTime: '14:30',
      cutoffTime: '14:15',
      items: lunchItems,
      isActive: true,
    });
  }
}