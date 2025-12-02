import React, { useState } from 'react';
import { Bus, SearchParams, BookingStep, Seat, Passenger } from './types';
import { generateMockBuses, generateMockLayout } from './constants';
import { SearchWidget } from './components/SearchWidget';
import { SeatLayout } from './components/SeatLayout';
import { 
  Bus as BusIcon, Star, Wifi, Coffee, Zap, 
  ArrowLeft, CheckCircle, User, CreditCard, Ticket,
  Phone, Mail, MapPin, Percent, ShieldCheck,
  Facebook, Twitter, Instagram, Linkedin, Home, X
} from 'lucide-react';

// --- Sub-components ---

const BusCard: React.FC<{ bus: Bus; onSelect: () => void }> = ({ bus, onSelect }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-5 mb-4 flex flex-col md:flex-row justify-between gap-4 group hover:-translate-y-1 duration-300">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-bold text-lg text-gray-800 group-hover:text-brand-600 transition-colors">{bus.operatorName}</h3>
        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">{bus.type}</span>
      </div>
      
      <div className="flex items-center gap-8 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Departure</p>
          <p className="text-lg font-bold text-gray-800">{bus.departureTime}</p>
          <p className="text-xs text-gray-400">{bus.source}</p>
        </div>
        <div className="flex flex-col items-center">
           <p className="text-xs text-gray-400 mb-1">{bus.duration}</p>
           <div className="w-24 h-[1px] bg-gray-300 relative flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-gray-300 rounded-full absolute left-0"></div>
             <div className="w-1.5 h-1.5 bg-gray-300 rounded-full absolute right-0"></div>
           </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Arrival</p>
          <p className="text-lg font-bold text-gray-800">{bus.arrivalTime}</p>
          <p className="text-xs text-gray-400">{bus.destination}</p>
        </div>
      </div>

      <div className="flex gap-4">
         {bus.amenities.includes("WiFi") && <div className="flex items-center gap-1 text-xs text-gray-500"><Wifi className="w-3 h-3" /> WiFi</div>}
         {bus.amenities.includes("Water Bottle") && <div className="flex items-center gap-1 text-xs text-gray-500"><Coffee className="w-3 h-3" /> Water</div>}
         {bus.amenities.includes("Charging Point") && <div className="flex items-center gap-1 text-xs text-gray-500"><Zap className="w-3 h-3" /> Power</div>}
      </div>
    </div>

    <div className="flex flex-row md:flex-col justify-between items-end min-w-[140px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
      <div className="flex flex-col items-end">
        <div className="text-gray-500 text-sm">Starting from</div>
        <div className="text-2xl font-bold text-gray-800">₹{bus.price}</div>
      </div>
      
      <div className="flex flex-col gap-2 items-end w-full">
         <div className="bg-green-100 text-green-700 border border-green-200 text-xs px-2 py-1 rounded flex items-center gap-1 font-medium">
           <Star className="w-3 h-3 fill-current" /> {bus.rating.toFixed(1)}
         </div>
         <p className="text-xs text-gray-500">{bus.availableSeats} Seats Left</p>
         <button 
           onClick={onSelect}
           className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-2 shadow-sm"
         >
           Select Seats
         </button>
      </div>
    </div>
  </div>
);

type ViewState = 'home' | 'ticket' | 'contact';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [step, setStep] = useState<BookingStep>(BookingStep.SEARCH);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [availableBuses, setAvailableBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  
  // Seat selection
  const [seatLayout, setSeatLayout] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  
  // Passengers
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  // Ticket Status State
  const [pnrInput, setPnrInput] = useState('');
  const [ticketStatus, setTicketStatus] = useState<'none' | 'found' | 'not_found'>('none');

  // Contact Form State
  const [contactFormStatus, setContactFormStatus] = useState<'idle' | 'sent'>('idle');

  // --- Actions ---

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    const buses = generateMockBuses(params.source, params.destination);
    setAvailableBuses(buses);
    setStep(BookingStep.RESULTS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBusSelect = (bus: Bus) => {
    setSelectedBus(bus);
    setSeatLayout(generateMockLayout(bus.type));
    setSelectedSeatIds([]);
    setStep(BookingStep.SEATS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSeat = (seatId: string) => {
    if (selectedSeatIds.includes(seatId)) {
      setSelectedSeatIds(prev => prev.filter(id => id !== seatId));
    } else {
      if (selectedSeatIds.length >= 6) {
        alert("You can only select up to 6 seats.");
        return;
      }
      setSelectedSeatIds(prev => [...prev, seatId]);
    }
  };

  const handleProceedToPassengers = () => {
    if (selectedSeatIds.length === 0) return;
    const selectedSeats = seatLayout.filter(s => selectedSeatIds.includes(s.id));
    const initialPassengers: Passenger[] = selectedSeats.map(seat => ({
      name: '',
      age: '',
      gender: 'male',
      seatNumber: seat.number
    }));
    setPassengers(initialPassengers);
    setStep(BookingStep.PASSENGER);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleBooking = () => {
    if (passengers.some(p => !p.name || !p.age)) {
      alert("Please fill all passenger details.");
      return;
    }
    setStep(BookingStep.CONFIRMATION);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetApp = () => {
    setStep(BookingStep.SEARCH);
    setSearchParams(null);
    setSelectedBus(null);
    setSelectedSeatIds([]);
    setPassengers([]);
    setPnrInput('');
    setTicketStatus('none');
    setContactFormStatus('idle');
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateTotal = () => {
    if (!selectedBus) return 0;
    let total = 0;
    selectedSeatIds.forEach(id => {
      const seat = seatLayout.find(s => s.id === id);
      if (seat) total += (selectedBus.price + seat.price);
    });
    return total;
  };

  const checkTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnrInput.length > 3) {
      setTicketStatus('found'); // Mock success
    } else {
      setTicketStatus('not_found');
    }
  };

  const handleNav = (view: ViewState) => {
    setCurrentView(view);
    // If navigating away from home flow, reset to search
    if (view !== 'home') {
       // Optional: keep state or reset. Let's keep state for better UX
    } else {
       // If clicking home, maybe show search
       if (step === BookingStep.CONFIRMATION) {
          resetApp();
       }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Render Views ---

  const renderHeader = () => (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          onClick={() => resetApp()} 
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="bg-brand-600 text-white p-1.5 rounded-lg">
            <BusIcon className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Volo<span className="text-brand-600">Bus</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => handleNav('home')} 
            className={`font-medium transition-colors hover:text-brand-600 ${currentView === 'home' ? 'text-brand-600' : 'text-gray-500'}`}
          >
            Book Tickets
          </button>
          <button 
             onClick={() => handleNav('ticket')}
             className={`font-medium transition-colors hover:text-brand-600 ${currentView === 'ticket' ? 'text-brand-600' : 'text-gray-500'}`}
          >
            Check Status
          </button>
          <button 
             onClick={() => handleNav('contact')}
             className={`font-medium transition-colors hover:text-brand-600 ${currentView === 'contact' ? 'text-brand-600' : 'text-gray-500'}`}
          >
            Contact Us
          </button>
        </div>

        <div className="flex items-center gap-3">
           <button className="hidden md:block text-gray-500 hover:text-brand-600 font-medium text-sm">Sign In</button>
           <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
             My Account
           </button>
        </div>
      </div>
    </nav>
  );

  const renderFooter = () => (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4 text-white">
            <BusIcon className="w-6 h-6" />
            <span className="text-xl font-bold">VoloBus</span>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            India's most reliable bus booking platform. Premium amenities, safety guaranteed, and 24/7 customer support.
          </p>
          <div className="flex gap-4">
             <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
             <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
             <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
             <Linkedin className="w-5 h-5 hover:text-white cursor-pointer" />
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Offers</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Track Ticket</li>
            <li className="hover:text-white cursor-pointer">Cancel Ticket</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Download App</h4>
          <p className="text-sm mb-4">Get exclusive offers on our mobile app.</p>
          <div className="flex gap-2">
            <div className="bg-gray-800 px-3 py-2 rounded border border-gray-700 hover:border-gray-500 cursor-pointer flex-1 text-center">
              <span className="text-xs font-bold text-white">Google Play</span>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded border border-gray-700 hover:border-gray-500 cursor-pointer flex-1 text-center">
              <span className="text-xs font-bold text-white">App Store</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm">
        © 2024 VoloBus Inc. All rights reserved.
      </div>
    </footer>
  );

  const renderOffers = () => (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Percent className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Exclusive Offers</h2>
        </div>
        <button className="text-brand-600 font-bold text-sm hover:underline">View All</button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { code: 'VOLOFIRST', desc: 'Save up to ₹250 on your first booking', color: 'from-blue-500 to-blue-600', icon: '🎉' },
          { code: 'SUPERBUS', desc: 'Flat 15% OFF on Premium Buses', color: 'from-purple-500 to-purple-600', icon: '🚌' },
          { code: 'WEEKEND', desc: 'Get cashback up to ₹100 on weekends', color: 'from-pink-500 to-pink-600', icon: '🏖️' },
        ].map((offer, i) => (
          <div key={i} className={`bg-gradient-to-br ${offer.color} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer transform hover:-translate-y-1 transition-all`}>
            <div className="absolute -right-8 -top-8 bg-white/10 w-32 h-32 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 bg-white/10 w-24 h-24 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">Promo Code</span>
                <span className="text-2xl">{offer.icon}</span>
              </div>
              <h3 className="text-2xl font-bold font-mono mb-2 tracking-wide">{offer.code}</h3>
              <p className="text-sm opacity-90 mb-6 font-medium">{offer.desc}</p>
              
              <div className="flex justify-between items-center border-t border-white/20 pt-4">
                <span className="text-xs opacity-75">Valid till 30 Oct</span>
                <button className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded shadow-sm hover:bg-gray-100 transition-colors uppercase">
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDestinations = () => (
    <div className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
           <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Destinations</h2>
           <p className="text-gray-500">Explore top routes loved by our travellers</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { name: "Goa", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop" },
            { name: "Mumbai", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=600&auto=format&fit=crop" },
            { name: "Bangalore", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=600&auto=format&fit=crop" },
            { name: "Hyderabad", img: "https://images.unsplash.com/photo-1626245136979-3d120cd0fb22?q=80&w=600&auto=format&fit=crop" }
          ].map((city, i) => (
            <div 
              key={i} 
              onClick={() => { 
                handleSearch({source: 'Bangalore', destination: city.name, date: new Date().toISOString().split('T')[0] }) 
              }} 
              className="relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer shadow-md hover:shadow-xl transition-all"
            >
               <img 
                 src={city.img} 
                 alt={city.name} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
               <div className="absolute bottom-0 left-0 p-5 text-white w-full">
                 <p className="text-xs font-medium uppercase tracking-wider mb-1 opacity-80">Travel to</p>
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{city.name}</h3>
                    <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHomeView = () => (
    <div className="min-h-[80vh] flex flex-col animate-in fade-in duration-500">
      <div className="relative pt-20 pb-32 px-4 bg-gray-900 overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 scale-105"
            alt="Bus Travel" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-transparent to-gray-900"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-tight">
            Journey with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Comfort</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 font-light">
            Book bus tickets for over 5,000 routes across India. Safe, reliable, and premium travel experience.
          </p>
        </div>
      </div>
      
      <div className="px-4">
        <SearchWidget onSearch={handleSearch} />
      </div>

      {renderOffers()}
      
      {renderDestinations()}
      
      {/* Features */}
      <div className="max-w-6xl mx-auto py-20 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <ShieldCheck className="w-12 h-12 text-brand-600 mb-4" />, title: "Safety First", desc: "Sanitized buses and trained professional drivers." },
          { icon: <Star className="w-12 h-12 text-brand-600 mb-4" />, title: "Premium Operators", desc: "We partner only with the top-rated bus operators." },
          { icon: <Ticket className="w-12 h-12 text-brand-600 mb-4" />, title: "Lowest Price", desc: "Best prices guaranteed with no hidden booking fees." },
        ].map((f, i) => (
          <div key={i} className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex justify-center">{f.icon}</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">{f.title}</h3>
            <p className="text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTicketStatus = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-gray-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-100">
             <Ticket className="w-8 h-8 text-brand-600" />
           </div>
           <h2 className="text-2xl font-bold text-gray-800">Check Ticket Status</h2>
           <p className="text-gray-500 text-sm mt-2">Enter your PNR or Booking ID to view details</p>
        </div>

        <form onSubmit={checkTicket} className="space-y-4">
           <div>
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID / PNR</label>
             <input 
               type="text" 
               value={pnrInput}
               onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
               className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-mono uppercase"
               placeholder="e.g. VBUS1234"
             />
           </div>
           <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md flex justify-center items-center gap-2">
             <Ticket className="w-4 h-4" /> Get Ticket
           </button>
        </form>

        {ticketStatus === 'not_found' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-center text-sm flex items-center justify-center gap-2">
             <span className="font-bold">Error:</span> No booking found with that ID.
          </div>
        )}

        {ticketStatus === 'found' && (
          <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden animate-in fade-in">
             <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">PNR: {pnrInput}</span>
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold border border-green-200 uppercase tracking-wide">Confirmed</span>
             </div>
             <div className="p-5 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg text-gray-800">Bangalore <span className="text-gray-400 mx-1">→</span> Goa</span>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between border-b border-dashed border-gray-100 pb-2"><span>Date</span> <span className="font-medium text-gray-900">24 Oct, 2024</span></div>
                  <div className="flex justify-between border-b border-dashed border-gray-100 pb-2"><span>Time</span> <span className="font-medium text-gray-900">21:00</span></div>
                  <div className="flex justify-between border-b border-dashed border-gray-100 pb-2"><span>Bus</span> <span className="font-medium text-gray-900">VoloBus Prime A/C</span></div>
                  <div className="flex justify-between"><span>Passenger</span> <span className="font-medium text-gray-900">Rahul Sharma</span></div>
                </div>
                <button className="w-full mt-6 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">Download PDF</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderContactUs = () => (
    <div className="animate-in slide-in-from-right-4 duration-500">
       <div className="bg-gray-900 py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get in touch</h2>
             <p className="text-gray-400 max-w-xl mx-auto">We are here to help and answer any question you might have. We look forward to hearing from you.</p>
          </div>
       </div>

       <div className="max-w-6xl mx-auto px-4 -mt-10 pb-20">
         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            {/* Contact Info */}
            <div className="bg-brand-600 p-8 md:p-12 text-white md:w-1/3">
               <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
               <div className="space-y-8">
                 <div className="flex items-start gap-4">
                   <Phone className="w-6 h-6 opacity-80 mt-1" />
                   <div>
                     <p className="font-medium text-lg">+91 800-123-4567</p>
                     <p className="text-brand-100 text-sm">Mon-Sun 9am-6pm</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <Mail className="w-6 h-6 opacity-80 mt-1" />
                   <div>
                     <p className="font-medium text-lg">support@volobus.com</p>
                     <p className="text-brand-100 text-sm">Online Support 24/7</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <MapPin className="w-6 h-6 opacity-80 mt-1" />
                   <div>
                     <p className="font-medium text-lg">VoloBus HQ</p>
                     <p className="text-brand-100 text-sm">123, Tech Park, Indiranagar<br/>Bangalore, KA - 560038</p>
                   </div>
                 </div>
               </div>
               
               <div className="mt-12">
                 <div className="flex gap-4">
                    <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Facebook className="w-5 h-5" /></div>
                    <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Twitter className="w-5 h-5" /></div>
                    <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Linkedin className="w-5 h-5" /></div>
                 </div>
               </div>
            </div>

            {/* Form */}
            <div className="p-8 md:p-12 md:w-2/3">
              {contactFormStatus === 'sent' ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                   <p className="text-gray-500 mb-8 max-w-sm">Thank you for contacting us. Our team will get back to you within 24 hours.</p>
                   <button onClick={() => setContactFormStatus('idle')} className="text-brand-600 font-bold hover:underline">Send another message</button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setContactFormStatus('sent'); }}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                      <input type="text" required className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                      <input type="tel" className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="+91" />
                    </div>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                      <input type="email" required className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="john@example.com" />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                      <textarea rows={4} required className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="How can we help you?"></textarea>
                  </div>
                  <button className="bg-gray-900 hover:bg-black text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full md:w-auto">
                     Send Message
                  </button>
                </form>
              )}
            </div>
         </div>
       </div>
    </div>
  );

  const renderBookingSteps = () => {
    switch(step) {
      case BookingStep.RESULTS:
        return (
          <div className="max-w-6xl mx-auto p-4 animate-in slide-in-from-right-8 duration-500">
             <button onClick={() => setStep(BookingStep.SEARCH)} className="flex items-center text-gray-500 hover:text-brand-600 mb-6 transition-colors font-medium">
               <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
             </button>
             
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-gray-800">
                 {searchParams?.source} to {searchParams?.destination}
               </h2>
               <span className="text-gray-500 font-medium">{availableBuses.length} Buses found</span>
             </div>

             <div className="space-y-4">
               {availableBuses.map(bus => (
                 <BusCard key={bus.id} bus={bus} onSelect={() => handleBusSelect(bus)} />
               ))}
             </div>
          </div>
        );

      case BookingStep.SEATS:
        return (
          <div className="max-w-6xl mx-auto p-4 animate-in slide-in-from-right-8 duration-500">
             <button onClick={() => setStep(BookingStep.RESULTS)} className="flex items-center text-gray-500 hover:text-brand-600 mb-6 transition-colors font-medium">
               <ArrowLeft className="w-4 h-4 mr-2" /> Back to Buses
             </button>

             <div className="flex flex-col lg:flex-row gap-8">
               <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <h2 className="text-xl font-bold mb-6 text-gray-800">Select Seats</h2>
                 
                 <div className="flex gap-6 mb-8 justify-center text-sm border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 border border-gray-300 rounded"></div> Available</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 rounded"></div> Booked</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-brand-500 rounded"></div> Selected</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-pink-100 border border-pink-200 rounded"></div> Ladies</div>
                 </div>

                 <SeatLayout 
                   layout={seatLayout}
                   selectedSeatIds={selectedSeatIds}
                   onToggleSeat={handleToggleSeat}
                   basePrice={selectedBus?.price || 0}
                 />
               </div>

               <div className="lg:w-96">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                     <h3 className="text-lg font-bold mb-4 pb-4 border-b border-gray-100">Booking Summary</h3>
                     <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-sm">
                           <span className="text-gray-500">Bus Operator</span>
                           <span className="font-medium text-gray-900 text-right">{selectedBus?.operatorName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-gray-500">Seat(s)</span>
                           <span className="font-medium text-gray-900">{selectedSeatIds.map(id => seatLayout.find(s => s.id === id)?.number).join(', ') || '-'}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-100">
                           <span>Total Amount</span>
                           <span>₹{calculateTotal()}</span>
                        </div>
                     </div>
                     <button 
                       onClick={handleProceedToPassengers}
                       disabled={selectedSeatIds.length === 0}
                       className="w-full bg-brand-600 disabled:bg-gray-300 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
                     >
                       Proceed to Book
                     </button>
                  </div>
               </div>
             </div>
          </div>
        );

      case BookingStep.PASSENGER:
        return (
          <div className="max-w-4xl mx-auto p-4 animate-in slide-in-from-right-8 duration-500">
             <button onClick={() => setStep(BookingStep.SEATS)} className="flex items-center text-gray-500 hover:text-brand-600 mb-6 transition-colors font-medium">
               <ArrowLeft className="w-4 h-4 mr-2" /> Back to Seats
             </button>

             <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-2">
                   <User className="w-5 h-5 text-gray-500" />
                   <h2 className="font-bold text-gray-800">Passenger Details</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {passengers.map((passenger, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-brand-200 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-sm font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">Seat {passenger.seatNumber}</span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase">Name</label>
                          <input 
                            type="text" 
                            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                            value={passenger.name}
                            onChange={(e) => updatePassenger(idx, 'name', e.target.value)}
                            placeholder="Full Name"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase">Age</label>
                          <input 
                            type="number" 
                            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                            value={passenger.age}
                            onChange={(e) => updatePassenger(idx, 'age', e.target.value)}
                            placeholder="Age"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase">Gender</label>
                          <select 
                            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                            value={passenger.gender}
                            onChange={(e) => updatePassenger(idx, 'gender', e.target.value as any)}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                   <div>
                     <p className="text-sm text-gray-500">Total Amount</p>
                     <p className="text-2xl font-bold text-gray-800">₹{calculateTotal()}</p>
                   </div>
                   <button 
                     onClick={handleBooking}
                     className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2"
                   >
                     <CreditCard className="w-5 h-5" /> Pay & Confirm
                   </button>
                </div>
             </div>
          </div>
        );

      case BookingStep.CONFIRMATION:
        return (
          <div className="min-h-[70vh] flex items-center justify-center p-4 animate-in zoom-in-95 duration-500">
             <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl border-t-8 border-brand-500 p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-brand-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className="absolute bottom-0 left-0 p-24 bg-brand-50 rounded-full -ml-12 -mb-12 opacity-50"></div>
                
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-in fade-in zoom-in duration-700">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">Your ticket has been successfully booked. We have sent the details to your email and SMS.</p>
                  
                  <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-200 shadow-sm max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                       <span className="text-xs font-bold text-gray-500 uppercase">Booking ID</span>
                       <span className="font-mono font-bold text-lg text-brand-600">VOLO{Math.floor(1000 + Math.random() * 9000)}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                       <div className="flex justify-between">
                         <span className="text-gray-500">Route</span>
                         <span className="font-medium text-gray-900">{selectedBus?.source} → {selectedBus?.destination}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-500">Date</span>
                         <span className="font-medium text-gray-900">{searchParams?.date}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-500">Bus</span>
                         <span className="font-medium text-gray-900">{selectedBus?.operatorName}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-500">Seats</span>
                         <span className="font-medium text-gray-900">{passengers.map(p => p.seatNumber).join(', ')}</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
                      Download Ticket
                    </button>
                    <button 
                      onClick={resetApp} 
                      className="px-8 py-3 bg-brand-600 text-white font-bold rounded-lg shadow-lg hover:bg-brand-700 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                      <Ticket className="w-5 h-5" /> Book Another Ticket
                    </button>
                  </div>
                </div>
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {renderHeader()}
      
      <main className="flex-grow">
        {currentView === 'home' && (
          step === BookingStep.SEARCH 
            ? renderHomeView() 
            : renderBookingSteps()
        )}
        
        {currentView === 'ticket' && renderTicketStatus()}
        
        {currentView === 'contact' && renderContactUs()}
      </main>

      {renderFooter()}
    </div>
  );
}
