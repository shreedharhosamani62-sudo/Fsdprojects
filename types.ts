export interface Bus {
  id: string;
  operatorName: string;
  type: 'AC Sleeper' | 'Non-AC Sleeper' | 'AC Seater' | 'Volvo Multi-Axle';
  departureTime: string; // "21:00"
  arrivalTime: string;   // "06:00"
  duration: string;      // "9h 00m"
  source: string;
  destination: string;
  price: number;
  rating: number;
  totalSeats: number;
  availableSeats: number;
  amenities: string[];
}

export interface Seat {
  id: string;
  row: number;
  col: number;
  isSleeper: boolean;
  deck: 'lower' | 'upper';
  status: 'available' | 'booked' | 'selected' | 'ladies';
  price: number;
  number: string;
}

export interface Passenger {
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  seatNumber: string;
}

export interface SearchParams {
  source: string;
  destination: string;
  date: string;
}

export enum BookingStep {
  SEARCH = 0,
  RESULTS = 1,
  SEATS = 2,
  PASSENGER = 3,
  CONFIRMATION = 4
}