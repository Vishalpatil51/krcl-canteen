import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AdminService } from '../../../core/services/admin.service';
import { UserRole } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboard {
  private auth = inject(AuthService);
  private admin = inject(AdminService);
  private router = inject(Router);

  user = this.auth.currentUser;
  activeTab = signal<'USERS' | 'FLOORS' | 'ASSIGNMENTS'>('USERS');

  users = this.admin.users;
  floors = this.admin.floors;
  assignments = this.admin.assignments;

  // Add user form
  showUserForm = signal(false);
  newName = signal('');
  newMobile = signal('');
  newRole = signal<UserRole>('EMPLOYEE');
  newEmployeeId = signal('');
  newFloorNumber = signal<number | null>(null);

  // Add floor form
  showFloorForm = signal(false);
  newFloorNum = signal<number>(9);
  newFloorName = signal('');

  // Assignment form
  selectedStaffId = signal('');
  selectedFloorId = signal('');

  roleOptions: UserRole[] = [
    'EMPLOYEE',
    'CANTEEN_ADMIN',
    'COUNTER_STAFF',
    'KITCHEN_STAFF',
    'DELIVERY_STAFF',
    'SUPER_ADMIN',
  ];

  successMessage = signal('');

  setTab(t: 'USERS' | 'FLOORS' | 'ASSIGNMENTS'): void {
    this.activeTab.set(t);
  }

  // Users
  openUserForm(): void {
    this.newName.set('');
    this.newMobile.set('');
    this.newRole.set('EMPLOYEE');
    this.newEmployeeId.set('');
    this.newFloorNumber.set(null);
    this.showUserForm.set(true);
  }

  closeUserForm(): void {
    this.showUserForm.set(false);
  }

  addUser(): void {
    if (!this.newName().trim() || !/^[5-9]\d{9}$/.test(this.newMobile())) {
      alert('Enter name and valid 10-digit mobile (5-9 se start)');
      return;
    }

    const role = this.newRole();
    const needsFloor = role === 'EMPLOYEE';

    this.admin.addUser({
      name: this.newName().trim(),
      mobile: this.newMobile().trim(),
      role,
      employeeId: needsFloor ? this.newEmployeeId() : undefined,
      floorId: needsFloor && this.newFloorNumber() ? 'f-' + this.newFloorNumber() : undefined,
      floorNumber: needsFloor && this.newFloorNumber() ? this.newFloorNumber()! : undefined,
      isActive: true,
    });

    this.showUserForm.set(false);
    this.flash('User added successfully');
  }

  toggleActive(userId: string): void {
    this.admin.toggleUserActive(userId);
  }

  deleteUser(userId: string): void {
    if (!confirm('Delete this user?')) return;
    this.admin.deleteUser(userId);
    this.flash('User deleted');
  }

  // Floors
  openFloorForm(): void {
    this.newFloorNum.set(9);
    this.newFloorName.set('');
    this.showFloorForm.set(true);
  }

  closeFloorForm(): void {
    this.showFloorForm.set(false);
  }

  addFloor(): void {
    if (!this.newFloorNum() || this.newFloorNum() < 1) {
      alert('Enter valid floor number');
      return;
    }
    const name = this.newFloorName().trim() || 'Floor ' + this.newFloorNum();
    this.admin.addFloor(this.newFloorNum(), name);
    this.showFloorForm.set(false);
    this.flash('Floor added');
  }

  toggleFloor(floorId: string): void {
    this.admin.toggleFloorActive(floorId);
  }

  // Assignments
  addAssignment(): void {
    if (!this.selectedStaffId() || !this.selectedFloorId()) {
      alert('Select both staff and floor');
      return;
    }
    this.admin.assignStaffToFloor(this.selectedStaffId(), this.selectedFloorId());
    this.selectedStaffId.set('');
    this.selectedFloorId.set('');
    this.flash('Floor assigned to staff');
  }

  removeAssignment(id: string): void {
    this.admin.removeAssignment(id);
    this.flash('Assignment removed');
  }

  getDeliveryStaff() {
    return this.admin.getDeliveryStaff();
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  goToCanteen(): void {
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