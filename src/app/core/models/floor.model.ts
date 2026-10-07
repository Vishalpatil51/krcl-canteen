export interface Floor {
  id: string;
  floorNumber: number;
  name: string;
  isActive: boolean;
}

export interface StaffFloorAssignment {
  id: string;
  staffId: string;
  staffName: string;
  floorId: string;
  floorNumber: number;
}