export interface Reservation {
  id: string;
  code: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  is_seen: boolean;
  created_at: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Business Dinner',
  'Date Night',
  'Family Gathering',
  'Celebration',
  'Other'
] as const;

export const TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00',
  '17:00', '17:30', '18:00', '18:30', '19:00',
  '19:30', '20:00', '20:30', '21:00', '21:30'
] as const;