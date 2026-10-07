import { Injectable, signal } from '@angular/core';
import { User, UserRole, Floor, StaffFloorAssignment } from '../models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private usersSignal = signal<User[]>([]);
  private floorsSignal = signal<Floor[]>([]);
  private assignmentsSignal = signal<StaffFloorAssignment[]>([]);

  readonly users = this.usersSignal.asReadonly();
  readonly floors = this.floorsSignal.asReadonly();
  readonly assignments = this.assignmentsSignal.asReadonly();

  constructor() {
    this.loadMockData();
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): void {
    const newUser: User = {
      ...user,
      id: 'u-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.usersSignal.update((list) => [newUser, ...list]);
  }

  updateUser(id: string, updates: Partial<User>): void {
    this.usersSignal.update((list) =>
      list.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
  }

  toggleUserActive(id: string): void {
    this.usersSignal.update((list) =>
      list.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  }

  deleteUser(id: string): void {
    this.usersSignal.update((list) => list.filter((u) => u.id !== id));
  }

  addFloor(floorNumber: number, name: string): void {
    const newFloor: Floor = {
      id: 'f-' + floorNumber,
      floorNumber,
      name,
      isActive: true,
    };
    this.floorsSignal.update((list) =>
      [...list, newFloor].sort((a, b) => a.floorNumber - b.floorNumber)
    );
  }

  toggleFloorActive(id: string): void {
    this.floorsSignal.update((list) =>
      list.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f))
    );
  }

  assignStaffToFloor(staffId: string, floorId: string): void {
    const existing = this.assignmentsSignal().find(
      (a) => a.staffId === staffId && a.floorId === floorId
    );
    if (existing) return;

    const staff = this.usersSignal().find((u) => u.id === staffId);
    const floor = this.floorsSignal().find((f) => f.id === floorId);
    if (!staff || !floor) return;

    const newAssignment: StaffFloorAssignment = {
      id: 'a-' + Date.now(),
      staffId,
      staffName: staff.name,
      floorId,
      floorNumber: floor.floorNumber,
    };
    this.assignmentsSignal.update((list) => [...list, newAssignment]);
  }

  removeAssignment(assignmentId: string): void {
    this.assignmentsSignal.update((list) =>
      list.filter((a) => a.id !== assignmentId)
    );
  }

  getDeliveryStaff(): User[] {
    return this.usersSignal().filter((u) => u.role === 'DELIVERY_STAFF');
  }

  private loadMockData(): void {
    // Floors: 3rd to 8th
    const floors: Floor[] = [3, 4, 5, 6, 7, 8].map((n) => ({
      id: 'f-' + n,
      floorNumber: n,
      name: 'Floor ' + n,
      isActive: true,
    }));
    this.floorsSignal.set(floors);

    // Users
    const users: User[] = [
      {
        id: 'u-9999999999', name: 'Super Admin', mobile: '9999999999',
        role: 'SUPER_ADMIN', isActive: true, createdAt: new Date().toISOString(),
      },
      {
        id: 'u-8888888888', name: 'Canteen Manager', mobile: '8888888888',
        role: 'CANTEEN_ADMIN', isActive: true, createdAt: new Date().toISOString(),
      },
      {
        id: 'u-7777777777', name: 'Counter Staff', mobile: '7777777777',
        role: 'COUNTER_STAFF', isActive: true, createdAt: new Date().toISOString(),
      },
      {
        id: 'u-6666666666', name: 'Chef Ram', mobile: '6666666666',
        role: 'KITCHEN_STAFF', isActive: true, createdAt: new Date().toISOString(),
      },
      {
        id: 'u-5555555555', name: 'Delivery Staff A', mobile: '5555555555',
        role: 'DELIVERY_STAFF', isActive: true, createdAt: new Date().toISOString(),
      },
      {
        id: 'u-9999999999-e1', name: 'Ramesh Kumar', mobile: '9000000001',
        role: 'EMPLOYEE', floorId: 'f-6', floorNumber: 6,
        employeeId: 'KRCL001', isActive: true, createdAt: new Date().toISOString(),
      },
      {
        id: 'u-9999999999-e2', name: 'Suresh Patil', mobile: '9000000002',
        role: 'EMPLOYEE', floorId: 'f-5', floorNumber: 5,
        employeeId: 'KRCL002', isActive: true, createdAt: new Date().toISOString(),
      },
    ];
    this.usersSignal.set(users);

    // Existing assignments
    this.assignmentsSignal.set([
      {
        id: 'a-1',
        staffId: 'u-5555555555',
        staffName: 'Delivery Staff A',
        floorId: 'f-5',
        floorNumber: 5,
      },
      {
        id: 'a-2',
        staffId: 'u-5555555555',
        staffName: 'Delivery Staff A',
        floorId: 'f-6',
        floorNumber: 6,
      },
    ]);
  }
}