import React, { useState } from 'react';

export const StorageDiscovery = () => {
  const warehouses = [
    { id: 'WH-01', name: 'Niphad Cold Storage & Warehousing', capacity: '1,200 MT Available', maxCap: 1200, rate: '₹8.50 / Bag / Month', type: 'Cold Storage (Controlled Temp 4°C)', dist: '4.2 km from farm' },
    { id: 'WH-02', name: 'Pimpalgaon APMC Dry Grain Godown', capacity: '450 MT Available', maxCap: 450, rate: '₹5.00 / Bag / Month', type: 'Ventilated Dry Warehouse', dist: '8.1 km from farm' },
    { id: 'WH-03', name: 'Nashik Agritech Agri-Vault', capacity: '2,800 MT Available', maxCap: 2800, rate: '₹10.00 / Bag / Month', type: 'WDRA Registered Warehouse', dist: '14.5 km from farm' }
  ];

  const [selectedWh, setSelectedWh] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    crop: 'Red Onion (Garwa)',
    quantity: '10',
    months: '2',
    startDate: new Date().toISOString().split('T')[0]
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const [myBookings, setMyBookings] = useState(() => {
    const saved = localStorage.getItem('agrisync_warehouse_bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      {
        id: 'STG-88412',
        warehouse: 'Niphad Cold Storage & Warehousing',
        crop: 'Red Onion (Garwa)',
        quantity: '20.0 MT',
        duration: '2 Months',
        startDate: new Date().toISOString().split('T')[0],
        rate: '₹8.50 / Bag / Month',
        status: 'Active Reserved',
        bookedAt: 'Today'
      }
    ];
  });

  const handleOpenModal = (wh) => {
    setSelectedWh(wh);
    setShowModal(true);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    const requestedQty = Number(bookingForm.quantity);
    if (!bookingForm.quantity || isNaN(bookingForm.quantity) || requestedQty <= 0) {
      errs.quantity = 'Enter a valid storage weight in MT.';
    } else if (selectedWh && requestedQty > selectedWh.maxCap) {
      errs.quantity = `Exceeds available capacity! Max available: ${selectedWh.capacity}`;
    }

    if (!bookingForm.months || isNaN(bookingForm.months) || Number(bookingForm.months) <= 0) {
      errs.months = 'Storage duration in months is required.';
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const newCertId = `STG-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      id: newCertId,
      warehouse: selectedWh.name,
      crop: bookingForm.crop,
      quantity: `${requestedQty.toFixed(1)} MT`,
      duration: `${bookingForm.months} Months`,
      startDate: bookingForm.startDate,
      rate: selectedWh.rate,
      status: 'Active Reserved',
      bookedAt: 'Just Now'
    };

    const updatedBookings = [newBooking, ...myBookings];
    setMyBookings(updatedBookings);
    localStorage.setItem('agrisync_warehouse_bookings', JSON.stringify(updatedBookings));

    setShowModal(false);
    setToastMessage(`✓ Storage Reserved! ${bookingForm.quantity} MT at ${selectedWh.name}. Reservation Certificate #${newCertId} issued.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-4 bg-[#dcfce7] border-2 border-[#bbf7d0] text-[#15803d] rounded-2xl text-xs font-extrabold shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-[#0f172a]">Storage & Warehousing Discovery</h1>
        <p className="text-xs text-slate-600 mt-1">Locate nearby WDRA-certified cold storage and dry warehouses to hold produce during market dips.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warehouses.map((w, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-[#047857] uppercase tracking-wider">{w.dist}</span>
              <h3 className="text-base font-black text-[#0f172a] mt-1">{w.name}</h3>
              <p className="text-xs text-slate-600 mt-1">{w.type}</p>
              <div className="mt-4 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Available Space:</span> <span className="font-bold text-[#0f172a]">{w.capacity}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Rental Tariff:</span> <span className="font-extrabold text-[#047857] font-data-tabular">{w.rate}</span></div>
              </div>
            </div>
            <button 
              onClick={() => handleOpenModal(w)}
              className="mt-5 text-center w-full py-2.5 bg-[#0f172a] text-white rounded-xl text-xs font-bold hover:bg-[#1e293b] transition-colors shadow-2xs cursor-pointer active:scale-98"
            >
              Book Warehouse Space
            </button>
          </div>
        ))}
      </div>

      {/* Active Warehouse Reservations List */}
      {myBookings.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#047857] text-xl">verified</span>
              <h2 className="text-base font-extrabold text-[#0f172a]">My Reserved Storage Facilities</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-[10px] font-extrabold border border-[#bbf7d0]">
              {myBookings.length} Active Booking{myBookings.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myBookings.map((b, idx) => (
              <div key={idx} className="p-4 bg-[#f8fafc] rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 font-data-tabular">Cert #{b.id}</span>
                    <h4 className="font-extrabold text-sm text-[#0f172a]">{b.warehouse}</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-[10px] font-extrabold border border-[#bbf7d0]">
                    {b.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                  <div><span className="text-slate-500 block">Commodity:</span> <strong>{b.crop}</strong></div>
                  <div><span className="text-slate-500 block">Weight Reserved:</span> <strong className="text-[#047857]">{b.quantity}</strong></div>
                  <div><span className="text-slate-500 block">Duration:</span> <strong>{b.duration}</strong></div>
                  <div><span className="text-slate-500 block">Start Date:</span> <strong>{b.startDate}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Warehouse Modal */}
      {showModal && selectedWh && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#047857] uppercase">Warehouse Reservation</span>
                <h2 className="text-base font-black text-[#0f172a]">{selectedWh.name}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop Commodity *</label>
                <select 
                  value={bookingForm.crop}
                  onChange={(e) => setBookingForm({...bookingForm, crop: e.target.value})}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none"
                >
                  <option value="Red Onion (Garwa)">Red Onion (Garwa)</option>
                  <option value="Soybean (JS-335)">Soybean (JS-335)</option>
                  <option value="Pomegranate (Bhagwa)">Pomegranate (Bhagwa)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Storage Weight (MT) *</label>
                  <input 
                    type="number"
                    step="0.5"
                    value={bookingForm.quantity}
                    onChange={(e) => setBookingForm({...bookingForm, quantity: e.target.value})}
                    className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none focus:border-[#047857]"
                  />
                  {errors.quantity && <span className="text-red-600 text-[10px] font-bold mt-0.5 block">{errors.quantity}</span>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Months) *</label>
                  <input 
                    type="number"
                    min="1"
                    max="12"
                    value={bookingForm.months}
                    onChange={(e) => setBookingForm({...bookingForm, months: e.target.value})}
                    className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none focus:border-[#047857]"
                  />
                  {errors.months && <span className="text-red-600 text-[10px] font-bold mt-0.5 block">{errors.months}</span>}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Start Storage Date</label>
                <input 
                  type="date"
                  value={bookingForm.startDate}
                  onChange={(e) => setBookingForm({...bookingForm, startDate: e.target.value})}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none"
                />
              </div>

              <div className="p-3 bg-[#f0fdf4] rounded-xl border border-[#dcfce7] text-slate-700">
                <div className="flex justify-between font-bold">
                  <span>Estimated Tariff Rate:</span>
                  <span className="text-[#047857]">{selectedWh.rate}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#047857] text-white font-extrabold rounded-xl hover:bg-[#065f46] shadow-md"
                >
                  Confirm Storage Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageDiscovery;
