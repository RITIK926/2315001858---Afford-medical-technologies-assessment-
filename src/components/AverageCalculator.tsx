import { useState } from "react";
import { NumberResponse } from "../types";
import { Play, RotateCcw, AlertCircle, TrendingUp, Cpu, Activity, ArrowRight, Table } from "lucide-react";
import { motion } from "motion/react";

const WINDOW_SIZE = 10;

export default function AverageCalculator() {
  const [activeType, setActiveType] = useState<"p" | "f" | "e" | "r">("p");
  const [history, setHistory] = useState<{ type: string; timestamp: string; data: NumberResponse }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<NumberResponse | null>(null);

  const fetchNumbers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/numbers/${activeType}`);
      if (!res.ok) throw new Error("Faulty response from backend.");
      const data: NumberResponse = await res.json();
      setLastResponse(data);
      setHistory(prev => [
        {
          type: activeType,
          timestamp: new Date().toLocaleTimeString(),
          data
        },
        ...prev
      ]);
    } catch (err: any) {
      setError(err?.message || "Failed to query sliding numbers.");
    } finally {
      setLoading(false);
    }
  };

  const clearRecords = () => {
    setHistory([]);
    setLastResponse(null);
    setError(null);
  };

  const getTypeName = (t: string) => {
    switch (t) {
      case "p": return "Primes";
      case "f": return "Fibonacci";
      case "e": return "Even Numbers";
      case "r": return "Random Numbers";
      default: return "";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                Sliding Microservice Streamer
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Maintain sliding windows of unique arithmetic counts
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearRecords}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                title="Reset local statistics"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {(["p", "f", "e", "r"] as const).map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`py-3 px-4 rounded-xl font-medium text-sm transition-all flex flex-col items-center justify-center gap-1 border ${
                  activeType === type
                    ? "bg-indigo-50/50 border-indigo-200 text-indigo-700 shadow-xs"
                    : "bg-white border-gray-100 hover:border-gray-200 text-gray-600"
                }`}
              >
                <span className="text-xs uppercase opacity-75">
                  {type === "p" ? "Prime" : type === "f" ? "Fib" : type === "e" ? "Even" : "Rand"}
                </span>
                <span className="text-sm font-semibold">{getTypeName(type)}</span>
              </button>
            ))}
          </div>

          <button
            onClick={fetchNumbers}
            disabled={loading}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl shadow-md cursor-pointer shadow-indigo-600/10 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
            Trigger REST Fetch & Process
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 flex gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {lastResponse && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Sliding Window Average
              </span>
              <div className="my-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-gray-900">
                  {lastResponse.avg}
                </span>
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-xs text-gray-500">
                Size limit: {WINDOW_SIZE} elements
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs md:col-span-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Raw Received Stream
                </span>
                <div className="flex flex-wrap gap-2 mt-4">
                  {lastResponse.numbers.map((n, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-gray-50 rounded-lg text-sm font-semibold text-gray-700 border border-gray-100"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-4 block">
                Detected count: {lastResponse.numbers.length} values
              </span>
            </div>
          </div>
        )}

        {lastResponse && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-6">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              State Window Evolution
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500">Previous Sliding Window</span>
                  <span className="text-xs font-mono text-gray-400">({lastResponse.windowPrevState.length}/{WINDOW_SIZE})</span>
                </div>
                <div className="min-h-12 bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-1.5 flex-wrap">
                  {lastResponse.windowPrevState.length === 0 ? (
                    <span className="text-xs text-gray-400">Empty start state</span>
                  ) : (
                    lastResponse.windowPrevState.map((n, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-gray-100 text-xs font-semibold text-gray-500 rounded-lg">
                        {n}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-indigo-50 p-2 rounded-full border border-indigo-100">
                  <ArrowRight className="w-4 h-4 text-indigo-500 rotate-90 md:rotate-0" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-indigo-700">Updated Current Sliding Window</span>
                  <span className="text-xs font-mono text-indigo-600 font-semibold">({lastResponse.windowCurrState.length}/{WINDOW_SIZE})</span>
                </div>
                <div className="min-h-12 bg-indigo-50/20 rounded-xl p-3 border border-indigo-100/50 flex flex-wrap items-center gap-1.5">
                  {lastResponse.windowCurrState.length === 0 ? (
                    <span className="text-xs text-indigo-400">Empty end state</span>
                  ) : (
                    lastResponse.windowCurrState.map((n, i) => {
                      const isNew = !lastResponse.windowPrevState.includes(n);
                      return (
                        <motion.span
                          initial={isNew ? { scale: 0.8, opacity: 0 } : {}}
                          animate={{ scale: 1, opacity: 1 }}
                          key={i}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                            isNew
                              ? "bg-indigo-600 text-white border border-indigo-600 shadow-xs"
                              : "bg-white border border-indigo-100 text-indigo-800"
                          }`}
                        >
                          {n}
                        </motion.span>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <h3 className="font-semibold text-gray-800 text-md tracking-tight mb-4 flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-500" />
            History Log
          </h3>

          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4">
              <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2 text-gray-400 font-mono text-sm">Ø</span>
              <p className="text-xs font-medium text-gray-400">No requests registered yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 space-y-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-700">{getTypeName(item.type)}</span>
                    <span className="text-[10px] text-gray-400">{item.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Avg: <strong className="text-gray-900 text-sm font-bold">{item.data.avg}</strong></span>
                    <span>Values: <strong className="text-gray-800">{item.data.windowCurrState.length}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
