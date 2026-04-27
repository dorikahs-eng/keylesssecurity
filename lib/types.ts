export interface DoorType {
  id: string;
  label: string;
  description: string;
  image: string;
}

export interface CartItem {
  door: DoorType;
  quantity: number;
}

export interface OrderData {
  id: string;
  type: 'existing' | 'new-homeowner';
  items: CartItem[];
  subtotal: number;
  total: number;
  status: 'pending' | 'paid' | 'scheduled';
  createdAt: string;
  customer?: CustomerInfo;
  property?: PropertyInfo;
  titleCompany?: TitleCompanyInfo;
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PropertyInfo {
  address: string;
  city: string;
  state: string;
  zip: string;
  closingDate?: string;
}

export interface TitleCompanyInfo {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

// Single door image used for all cards — replace DOOR_IMAGE with your own URL if desired
const DOOR_IMAGE = 'https://images.pexels.com/photos/6283971/pexels-photo-6283971.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop';

export const DOOR_TYPES: DoorType[] = [
  {
    id: 'front-entry',
    label: 'Front Entry',
    description: 'Main front-facing door',
    image: DOOR_IMAGE,
  },
  {
    id: 'side-door',
    label: 'Side Door',
    description: 'Secondary side access door',
    image: DOOR_IMAGE,
  },
  {
    id: 'back-door',
    label: 'Back Door',
    description: 'Rear exterior door',
    image: DOOR_IMAGE,
  },
  {
    id: 'garage-entry',
    label: 'Garage Entry',
    description: 'Door from garage to home',
    image: DOOR_IMAGE,
  },
  {
    id: 'basement-exit',
    label: 'Basement Exit',
    description: 'Basement exterior access door',
    image: DOOR_IMAGE,
  },
 
];

export const PRICE_PER_DOOR = 175;
export const MINIMUM_DOORS = 1;

// Coupon codes — Path 1 (existing homeowners) only
export const COUPON_CODES: Record<string, { minDoors: number; pricePerDoor: number; label: string }> = {
  REALTOR: { minDoors: 1, pricePerDoor: 150, label: 'Realtor discount applied' },
  AGENT50: { minDoors: 1, pricePerDoor: 125, label: 'Agent discount applied' },
};
export const COUPON_CODES: Record<string, { minDoors: number; pricePerDoor: number; label: string }> = {
  REALTOR: { minDoors: 1, pricePerDoor: 150, label: 'Realtor discount applied' },
  AGENT50: { minDoors: 1, pricePerDoor: 125, label: 'Agent discount applied' },
  TEST100: { minDoors: 1, pricePerDoor: 0, label: 'Test code — no charge' },
};
// Flat $175/door with optional coupon override
export function calculateTotal(totalDoors: number, coupon?: string): number {
  if (coupon && COUPON_CODES[coupon.toUpperCase()]) {
    return totalDoors * COUPON_CODES[coupon.toUpperCase()].pricePerDoor;
  }
  return totalDoors * PRICE_PER_DOOR;
}

export function getMinDoors(coupon?: string): number {
  if (coupon && COUPON_CODES[coupon.toUpperCase()]) {
    return COUPON_CODES[coupon.toUpperCase()].minDoors;
  }
  return MINIMUM_DOORS;
}

// Path 2 pricing: flat $175/door
export function calculateNewHomeTotal(totalDoors: number): number {
  return totalDoors * PRICE_PER_DOOR;
}
