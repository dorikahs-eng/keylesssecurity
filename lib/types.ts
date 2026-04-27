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
  {
    id: 'sliding-door',
    label: 'Sliding / Patio',
    description: 'Sliding or French patio door',
    image: DOOR_IMAGE,
  },
];

export const PRICE_PER_DOOR = 175;       // doors 1-2
export const PRICE_TIER2 = 100;          // doors 3+
export const MINIMUM_DOORS = 2;

// Coupon codes — Path 1 (existing homeowners) only
export const COUPON_CODES: Record<string, { minDoors: number; pricePerDoor: number; label: string }> = {
  REALTOR: { minDoors: 1, pricePerDoor: 150, label: 'Realtor discount applied' },
  AGENT50: { minDoors: 1, pricePerDoor: 125, label: 'Agent discount applied' },
};

// Path 1 pricing: first 2 doors at $175, every door after at $100
export function calculateTotal(totalDoors: number, coupon?: string): number {
  if (coupon && COUPON_CODES[coupon.toUpperCase()]) {
    return totalDoors * COUPON_CODES[coupon.toUpperCase()].pricePerDoor;
  }
  if (totalDoors <= 2) return totalDoors * PRICE_PER_DOOR;
  return 2 * PRICE_PER_DOOR + (totalDoors - 2) * PRICE_TIER2;
}

export function getMinDoors(coupon?: string): number {
  if (coupon && COUPON_CODES[coupon.toUpperCase()]) {
    return COUPON_CODES[coupon.toUpperCase()].minDoors;
  }
  return MINIMUM_DOORS;
}

// Path 2 pricing: flat $175/door, no minimum override
export function calculateNewHomeTotal(totalDoors: number): number {
  return totalDoors * PRICE_PER_DOOR;
}
