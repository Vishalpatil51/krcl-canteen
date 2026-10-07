import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MenuService } from '../../../core/services/menu.service';
import { DailyMenuItem, MealType, MenuCategory } from '../../../core/models';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-management.html',
  styleUrl: './menu-management.scss',
})
export class MenuManagement {
  private auth = inject(AuthService);
  private menuService = inject(MenuService);
  private router = inject(Router);

  user = this.auth.currentUser;
  breakfast = this.menuService.breakfastMenu;
  lunch = this.menuService.lunchMenu;

  activeMeal = signal<MealType>('BREAKFAST');
  editItem = signal<DailyMenuItem | null>(null);
  showAddForm = signal(false);
  successMessage = signal('');

  // New item form fields
  newItemName = signal('');
  newItemCategory = signal<MenuCategory>('OTHER');
  newItemUnit = signal('plate');
  newItemPrice = signal(30);
  newItemQty = signal(100);

  categoryOptions: MenuCategory[] = [
    'POHA', 'UPMA', 'IDLI', 'DOSA', 'TEA', 'COFFEE',
    'ROTI', 'RICE', 'DAL', 'SABJI', 'COMBO', 'CURD', 'OTHER',
  ];

  unitOptions = ['plate', 'bowl', 'cup', 'pc', 'glass'];

  get currentMenu() {
    return this.activeMeal() === 'BREAKFAST'
      ? this.breakfast()
      : this.lunch();
  }

  setMeal(meal: MealType): void {
    this.activeMeal.set(meal);
    this.editItem.set(null);
    this.showAddForm.set(false);
  }

  startEdit(item: DailyMenuItem): void {
    this.editItem.set({ ...item });
  }

  cancelEdit(): void {
    this.editItem.set(null);
  }

  saveEdit(): void {
    const item = this.editItem();
    if (!item) return;

    this.menuService.updateItemPrice(this.activeMeal(), item.id, item.price);
    this.menuService.updateItemQty(
      this.activeMeal(),
      item.id,
      item.availableQty
    );

    this.editItem.set(null);
    this.flash('Item updated');
  }

  toggleStock(item: DailyMenuItem): void {
    this.menuService.toggleOutOfStock(this.activeMeal(), item.id);
    this.flash(item.isOutOfStock ? 'Item back in stock' : 'Item marked out of stock');
  }

  removeItem(item: DailyMenuItem): void {
    if (!confirm(`Remove "${item.name}" from menu?`)) return;
    this.menuService.removeItem(this.activeMeal(), item.id);
    this.flash('Item removed');
  }

  openAddForm(): void {
    this.newItemName.set('');
    this.newItemCategory.set('OTHER');
    this.newItemUnit.set('plate');
    this.newItemPrice.set(30);
    this.newItemQty.set(100);
    this.showAddForm.set(true);
  }

  closeAddForm(): void {
    this.showAddForm.set(false);
  }

  addNewItem(): void {
    if (!this.newItemName().trim()) {
      alert('Please enter item name');
      return;
    }

    this.menuService.addItem(this.activeMeal(), {
      menuItemId: 'new-' + Date.now(),
      name: this.newItemName().trim(),
      category: this.newItemCategory(),
      unit: this.newItemUnit(),
      price: this.newItemPrice(),
      availableQty: this.newItemQty(),
      isOutOfStock: false,
    });

    this.showAddForm.set(false);
    this.flash('Item added');
  }

  goToDashboard(): void {
    this.router.navigate(['/canteen']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private flash(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(''), 2500);
  }
}