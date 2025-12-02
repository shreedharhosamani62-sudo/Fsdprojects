import { Bus, Seat } from './types';

export const CITIES = [
  "Bangalore", "Mumbai", "Pune", "Hyderabad", "Chennai", "Goa", "Delhi", "Coimbatore", "Hubli", "Belgaum"
];

export const AMENITIES = ["WiFi", "Water Bottle", "Blanket", "Charging Point", "Reading Light", "Emergency Exit"];

export const generateMockBuses = (source: string, destination: string): Bus[] => {
  const operators = ["VoloBus Prime", "Orange Tours", "SRS Travels", "VRL Logistics", "National Travels", "InterCity SmartBus"];
  const types = ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Volvo Multi-Axle'] as const;

  return Array.from({ length: 8 }).map((_, i) => {
    const isSleeper = i % 2 === 0;
    const basePrice = isSleeper ? 1200 : 800;
    
    return {
      id: `bus-${i + 1}`,
      operatorName: operators[i % operators.length],
      type: types[i % types.length],
      departureTime: `${18 + i}:00`,
      arrivalTime: `0${6 + (i % 3)}:30`,
      duration: `${8 + (i%3)}h 30m`,
      source,
      destination,
      price: basePrice + (Math.floor(Math.random() * 500)),
      rating: 3.5 + (Math.random() * 1.5),
      totalSeats: 30,
      availableSeats: 10 + Math.floor(Math.random() * 15),
      amenities: AMENITIES.slice(0, 3 + Math.floor(Math.random() * 3))
    };
  });
};

export const generateMockLayout = (busType: string): Seat[] => {
  const seats: Seat[] = [];
  const isSleeper = busType.includes('Sleeper');
  
  // Lower Deck
  for(let row=1; row<=5; row++) {
    for(let col=1; col<=3; col++) {
      // Introduce gap for aisle
      if (col === 2 && !isSleeper) continue; 

      seats.push({
        id: `L-${row}-${col}`,
        row,
        col,
        isSleeper,
        deck: 'lower',
        status: Math.random() > 0.7 ? 'booked' : Math.random() > 0.9 ? 'ladies' : 'available',
        price: 0, // Set dynamically relative to bus price
        number: `L${row}${String.fromCharCode(64+col)}`
      });
    }
  }

  // Upper Deck (only for sleepers)
  if (isSleeper) {
    for(let row=1; row<=5; row++) {
      for(let col=1; col<=3; col++) {
         seats.push({
          id: `U-${row}-${col}`,
          row,
          col,
          isSleeper,
          deck: 'upper',
          status: Math.random() > 0.7 ? 'booked' : 'available',
          price: 100, // Premium for upper?
          number: `U${row}${String.fromCharCode(64+col)}`
        });
      }
    }
  }

  return seats;
}