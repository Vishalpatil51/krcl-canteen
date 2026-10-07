export type MealType = 'BREAKFAST' | 'LUNCH';
export type MenuCategory =
  | 'POHA'
  | 'UPMA'
  | 'IDLI'
  | 'DOSA'
  | 'TEA'
  | 'COFFEE'
  | 'ROTI'
  | 'RICE'
  | 'DAL'
  | 'SABJI'
  | 'COMBO'
  | 'CURD'
  | 'OTHER';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  unit: string;
  defaultPrice: number;
  isActive: boolean;
}

export interface DailyMenuItem {
  id: string;
  menuItemId: string;
  name: string;
  category: MenuCategory;
  unit: string;
  price: number;
  availableQty: number;
  soldQty: number;
  isOutOfStock: boolean;
}

export interface DailyMenu {
  id: string;
  date: string;
  mealType: MealType;
  startTime: string;
  endTime: string;
  cutoffTime: string;
  items: DailyMenuItem[];
  isActive: boolean;
}