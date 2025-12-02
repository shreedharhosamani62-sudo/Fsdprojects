import React, { useMemo } from 'react';
import { Seat } from '../types';

interface SeatLayoutProps {
  layout: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seatId: string) => void;
  basePrice: number;
}

export const SeatLayout: React.FC<SeatLayoutProps> = ({ layout, selectedSeatIds, onToggleSeat, basePrice }) => {
  const lowerDeck = useMemo(() => layout.filter(s => s.deck === 'lower'), [layout]);
  const upperDeck = useMemo(() => layout.filter(s => s.deck === 'upper'), [layout]);

  const renderSeat = (seat: Seat) => {
    const isSelected = selectedSeatIds.includes(seat.id);
    const isBooked = seat.status === 'booked';
    const isLadies = seat.status === 'ladies';
    
    let seatColorClass = "bg-white border-gray-300 text-gray-500 hover:border-brand-500";
    
    if (isBooked) {
      seatColorClass = "bg-gray-200 border-transparent text-gray-300 cursor-not-allowed";
    } else if (isLadies) {
      seatColorClass = "bg-pink-100 border-pink-200 text-pink-400 cursor-not-allowed";
    } else if (isSelected) {
      seatColorClass = "bg-brand-500 border-brand-600 text-white shadow-md transform scale-105";
    }

    const seatStyle = seat.isSleeper ? "h-24 w-12" : "h-10 w-10 rounded";

    return (
      <button
        key={seat.id}
        disabled={isBooked || isLadies}
        onClick={() => onToggleSeat(seat.id)}
        className={`
          ${seatStyle} 
          border-2 flex items-center justify-center text-xs font-medium transition-all duration-200 
          relative group
          ${seatColorClass}
          ${seat.isSleeper ? 'rounded-md' : 'rounded-sm'}
        `}
      >
        <span className={seat.isSleeper ? "rotate-90" : ""}>{seat.number}</span>
        
        {/* Tooltip for price */}
        {!isBooked && !isSelected && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
             ₹{basePrice + seat.price}
          </div>
        )}
      </button>
    );
  };

  const DeckGrid = ({ seats, title }: { seats: Seat[], title: string }) => {
    if (seats.length === 0) return null;
    
    // Group by row to render consistently
    const rows = Array.from(new Set(seats.map(s => s.row))).sort();

    return (
      <div className="flex flex-col bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">{title}</h4>
        <div className="flex flex-col gap-3">
          {rows.map(rowNum => (
            <div key={rowNum} className="flex gap-4 justify-center">
              {seats.filter(s => s.row === rowNum).sort((a,b) => a.col - b.col).map(seat => (
                 <div key={seat.id} className={seat.col === 2 && !seat.isSleeper ? "mr-4 md:mr-8" : ""}> 
                 {/* Crude aisle logic: if col 2, add margin? Better is using grid gaps */}
                  {renderSeat(seat)}
                 </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <div className="w-full h-10 bg-gray-200 rounded-b-lg flex items-center justify-center text-gray-400 text-xs uppercase">
             {title === 'Lower Deck' ? 'Driver Cabin' : 'Front'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
      <DeckGrid seats={lowerDeck} title="Lower Deck" />
      <DeckGrid seats={upperDeck} title="Upper Deck" />
    </div>
  );
};