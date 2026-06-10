import { useState, useTransition } from "react";
import AverageCalculator from "./components/AverageCalculator";
import ProductsAggregator from "./components/ProductsAggregator";
import TrainScheduler from "./components/TrainScheduler";
import NotificationDashboard from "../notification_app_fe/NotificationDashboard";
import { Cpu, ShoppingBag, Compass, Landmark, Github, User, ChevronRight, Activity, Bell } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"avg" | "products" | "trains" | "notifications">("avg");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tab: "avg" | "products" | "trains" | "notifications") => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <header className="bg-white border-b border-gray-150 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/10 text-white font-extrabold text-lg">
                AM
              </div>
              <div>
                <h1 className="text-md font-extrabold text-gray-900 tracking-tight leading-none">
                  AffordMed Platform
                </h1>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Recruitment Assessment Suite
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs font-extrabold text-gray-900">
                  Ritik Varshney
                </span>
                <span className="text-[10px] font-semibold text-indigo-600">
                  ritik.varshney_cs23@gla.ac.in
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                RV
              </div>
              <a
                href="https://github.com/RITIK926/2315001858---Afford-medical-technologies-assessment-that"
                target="_blank"
                referrerPolicy="no-referrer"
                className="p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-150 rounded-xl text-gray-500 hover:text-gray-900 transition-colors"
                title="View GitHub Credentials Repository"
              >
                <Github className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="bg-indigo-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-indigo-950/15">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20 -mr-20 -mt-20" />
          <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-emerald-500 rounded-full filter blur-3xl opacity-10 -ml-20 -mb-20" />

          <div className="relative space-y-4 max-w-2xl">
            <span className="text-[10px] font-extrabold tracking-widest bg-white/10 px-2.5 py-1 rounded-md uppercase">
              Microservice Aggregators
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Enterprise Coding Assessments Board
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
              Consolidated suite evaluating sliding-window numbers generation, 
              cross-network commercial catalog matching, and train departures schedulers.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-100">
                <Landmark className="w-4 h-4 text-emerald-400" />
                GLA University Scholar
              </div>
              <span className="text-indigo-500">•</span>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-100">
                <Activity className="w-4 h-4 text-indigo-400" />
                DND Channel Live Sync
              </div>
            </div>
          </div>
        </section>

        <nav className="flex border-b border-gray-200">
          <div className="flex gap-1">
            <button
              onClick={() => handleTabChange("avg")}
              className={`py-3.5 px-5 text-xs font-bold uppercase tracking-wider relative flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "avg"
                  ? "text-indigo-600 font-extrabold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Cpu className="w-4 h-4" />
              Sliding Average
              {activeTab === "avg" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </button>

            <button
              onClick={() => handleTabChange("products")}
              className={`py-3.5 px-5 text-xs font-bold uppercase tracking-wider relative flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "products"
                  ? "text-indigo-600 font-extrabold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              E-Commerce directory
              {activeTab === "products" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </button>

            <button
              onClick={() => handleTabChange("trains")}
              className={`py-3.5 px-5 text-xs font-bold uppercase tracking-wider relative flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "trains"
                  ? "text-indigo-600 font-extrabold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Compass className="w-4 h-4" />
              Railways scheduler
              {activeTab === "trains" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </button>

            <button
              onClick={() => handleTabChange("notifications")}
              className={`py-3.5 px-5 text-xs font-bold uppercase tracking-wider relative flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "notifications"
                  ? "text-indigo-600 font-extrabold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Bell className="w-4 h-4" />
              Notification system
              {activeTab === "notifications" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </button>
          </div>
        </nav>

        <section className={`transition-opacity duration-200 ${isPending ? "opacity-50" : "opacity-100"}`}>
          {activeTab === "avg" && <AverageCalculator />}
          {activeTab === "products" && <ProductsAggregator />}
          {activeTab === "trains" && <TrainScheduler />}
          {activeTab === "notifications" && <NotificationDashboard />}
        </section>
      </main>

      <footer className="bg-white border-t border-gray-150 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              AffordMed Premium Assessment Sandbox
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Developed by Ritik Varshney (GLA University) under secure sandbox guidelines
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              LIVE METRICS SYNCED
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
