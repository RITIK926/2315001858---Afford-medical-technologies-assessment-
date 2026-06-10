import { useState, useEffect, startTransition, useTransition } from "react";
import { Train } from "../types";
import { Clock, Navigation, Compass, CalendarCheck, AlertTriangle, CheckCircle2, Ticket, ArrowRight, UserPlus, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function TrainScheduler() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [isPending, startProgress] = useTransition();

  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [bookingClass, setBookingClass] = useState<"sleeper" | "AC">("AC");

  const fetchTrains = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/trains");
      if (!res.ok) throw new Error("Failed to sync trains schedule boards.");
      const data: Train[] = await res.json();
      setTrains(data);
    } catch (err: any) {
      setError(err?.message || "Failed to download railways schedules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const triggerBooking = (train: Train, className: "sleeper" | "AC") => {
    setBookingClass(className);
    setSelectedTrain(train);
  };

  const handleBook = () => {
    startProgress(async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const code = `JDR-${Math.floor(Math.random() * 90000) + 10000}`;
      setBookingRef(code);
    });
  };

  const calculateActualTime = (dep: { Hours: number; Minutes: number }, delay: number) => {
    let totMinutes = dep.Hours * 60 + dep.Minutes + delay;
    const hours = Math.floor(totMinutes / 60) % 24;
    const minutes = totMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              John Doe Railway Control Panel
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Live sorted board with departure coordinates and coach updates
            </p>
          </div>
          <button
            onClick={fetchTrains}
            className="self-start sm:self-auto py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-100 transition-colors cursor-pointer"
          >
            Force Sync Timetable
          </button>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-50 shadow-xs">
            <span className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-400">Loading live departures schedule feeds...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-6 text-center">
            <p className="font-semibold text-sm mb-2">{error}</p>
            <button
              onClick={fetchTrains}
              className="py-1.5 px-4 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 cursor-pointer"
            >
              Sync Again
            </button>
          </div>
        ) : trains.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-xs text-center p-6">
            <Clock className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm font-semibold text-gray-500">No scheduled departures leaving in next 30 minutes</p>
            <p className="text-xs text-gray-400 mt-1">Please check back during next shift cycle</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trains.map(train => {
              const baseDeparture = `${train.departureTime.Hours.toString().padStart(2, "0")}:${train.departureTime.Minutes.toString().padStart(2, "0")}`;
              const revisedDeparture = calculateActualTime(train.departureTime, train.delayedBy);

              return (
                <div
                  key={train.trainNumber}
                  className="bg-white rounded-2xl border border-gray-150 hover:border-indigo-150 hover:shadow-sm transition-all p-5 grid grid-cols-1 md:grid-cols-4 gap-6 items-center"
                >
                  <div className="space-y-1.5 md:col-span-1">
                    <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">{train.trainNumber}</span>
                    <h4 className="font-extrabold text-gray-900 text-md tracking-tight leading-tight">{train.trainName}</h4>
                    <div className="flex items-center gap-1.5 pt-1">
                      {train.delayedBy > 0 ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" />
                          Late {train.delayedBy}m
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          ON TIME
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:col-span-1">
                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold block uppercase tracking-wider">Scheduled Departure</span>
                      <span className="text-sm font-semibold text-gray-500 line-through">{baseDeparture}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-500 font-bold block uppercase tracking-wider">Estimated Outbox</span>
                      <span className="text-lg font-extrabold text-gray-900">{revisedDeparture}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:col-span-1.5">
                    <div className={`p-3 rounded-xl border flex flex-col justify-between h-20 ${
                      train.seatsAvailable.sleeper > 0
                        ? "bg-slate-50 border-gray-150"
                        : "bg-red-50/20 border-red-100 text-gray-400"
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Sleeper</span>
                        {train.seatsAvailable.sleeper > 0 && (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                            ${train.price.sleeper}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-end mt-1">
                        <span className="text-xs text-gray-500 font-medium">Seats</span>
                        {train.seatsAvailable.sleeper > 0 ? (
                          <strong className="text-md font-extrabold text-gray-900">{train.seatsAvailable.sleeper}</strong>
                        ) : (
                          <span className="text-xs font-semibold text-red-500">SOLD OUT</span>
                        )}
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border flex flex-col justify-between h-20 ${
                      train.seatsAvailable.AC > 0
                        ? "bg-indigo-50/10 border-indigo-150"
                        : "bg-red-50/20 border-red-100 text-gray-400"
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">AC Cabin</span>
                        {train.seatsAvailable.AC > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                            ${train.price.AC}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-end mt-1">
                        <span className="text-xs text-gray-500 font-medium">Seats</span>
                        {train.seatsAvailable.AC > 0 ? (
                          <strong className="text-md font-extrabold text-indigo-900">{train.seatsAvailable.AC}</strong>
                        ) : (
                          <span className="text-xs font-semibold text-red-500">SOLD OUT</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 md:col-span-0.5 justify-end w-full">
                    <button
                      onClick={() => triggerBooking(train, train.seatsAvailable.sleeper > 0 ? "sleeper" : "AC")}
                      className="flex-1 md:flex-none py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold leading-normal text-center cursor-pointer shadow-indigo-600/10 shadow-md transition-colors"
                    >
                      Book Ticket
                    </button>
                    <button
                      onClick={() => setSelectedTrain(train)}
                      className="p-2 hover:bg-gray-50 border border-gray-150 rounded-xl text-xs font-semibold text-gray-500 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      Route Map
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50 text-emerald-800 font-bold text-sm">
            <Clock className="w-4 h-4 text-emerald-600" />
            Control Signals
          </div>
          <div className="space-y-4">
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Station Master Signal</span>
              <span className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5 mt-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                DND Rail Corridor Active
              </span>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Terminal Priority Policy</span>
              <p className="text-xs text-gray-500 leading-normal">
                Trains are dynamically layered by optimized pricing index, available cabins capacity, and delays.
              </p>
            </div>
          </div>
        </div>

        {selectedTrain && (
          <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-xs space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{selectedTrain.trainNumber} Map</span>
                <h4 className="font-extrabold text-gray-900 text-sm mt-0.5">{selectedTrain.trainName}</h4>
              </div>
              <button
                onClick={() => {
                  setSelectedTrain(null);
                  setBookingRef(null);
                }}
                className="p-1 rounded-full hover:bg-gray-50 text-gray-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Sequential Route Journey</h5>
              <div className="relative pl-4 space-y-4 border-l border-indigo-100">
                {selectedTrain.route.map((station, idx) => {
                  const isTerminus = idx === 0 || idx === selectedTrain.route.length - 1;
                  return (
                    <div key={idx} className="relative flex items-center gap-3">
                      <span className={`absolute -left-[20px] w-2.5 h-2.5 rounded-full border-2 ${
                        isTerminus ? "bg-indigo-600 border-white" : "bg-white border-indigo-400"
                      }`} />
                      <strong className="text-xs text-gray-800 font-bold">{station}</strong>
                      <span className="text-[9px] text-gray-400">
                        {idx === 0 ? "Origin Terminal" : idx === selectedTrain.route.length - 1 ? "End Terminal" : `Crossing Stop ${idx}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {bookingRef ? (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Reservation Confirmed!</span>
                <span className="text-sm font-mono font-bold text-gray-900 block bg-white border border-emerald-100 py-1.5 px-3 rounded-lg">
                  {bookingRef}
                </span>
                <p className="text-[10px] text-emerald-600 leading-normal">
                  Show this boarding pass at the departures gateway counter to receive boarding coupons.
                </p>
                <button
                  onClick={() => setBookingRef(null)}
                  className="mt-2 text-[10px] text-indigo-600 font-semibold underline cursor-pointer"
                >
                  Book another ticket
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-50 space-y-4">
                <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Fast Ticket Booking</h5>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={selectedTrain.seatsAvailable.sleeper === 0}
                    onClick={() => startTransition(() => setBookingClass("sleeper"))}
                    className={`p-2 rounded-xl text-center text-xs font-semibold border cursor-pointer ${
                      bookingClass === "sleeper"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    Sleeper - ${selectedTrain.price.sleeper}
                  </button>
                  <button
                    disabled={selectedTrain.seatsAvailable.AC === 0}
                    onClick={() => startTransition(() => setBookingClass("AC"))}
                    className={`p-2 rounded-xl text-center text-xs font-semibold border cursor-pointer ${
                      bookingClass === "AC"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    AC Cabin - ${selectedTrain.price.AC}
                  </button>
                </div>

                <button
                  onClick={handleBook}
                  disabled={isPending}
                  className="w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  {isPending ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Ticket className="w-4 h-4" />
                  )}
                  Secure Boarding Coupons
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
