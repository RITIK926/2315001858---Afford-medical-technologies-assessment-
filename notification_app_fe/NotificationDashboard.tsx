import { useState, useEffect, FormEvent } from "react";
import { Send, Bell, Settings, ShieldAlert, CheckCircle2, XCircle, Clock, Smartphone, Mail, Hash, Slack, Sparkles, Filter, Database } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NotificationLog {
  id: string;
  userId: string;
  channel: "EMAIL" | "SMS" | "PUSH" | "SLACK";
  title: string;
  body: string;
  status: "SENT" | "PENDING" | "FAILED";
  timestamp: string;
  responseTimeMs: number;
}

interface Preferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  slackEnabled: boolean;
  quietHours: boolean;
}

export default function NotificationDashboard() {
  const [logs, setLogs] = useState<NotificationLog[]>([
    {
      id: "notif-e01",
      userId: "rvarshney-926",
      channel: "EMAIL",
      title: "AffordMed Platform Compilation Succeeded",
      body: "All validation test suits are green. Code checked in under secure assess guidelines.",
      status: "SENT",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      responseTimeMs: 84
    },
    {
      id: "notif-s02",
      userId: "rvarshney-926",
      channel: "SMS",
      title: "Repository Structure Verified",
      body: "logging_middleware, notification_system_design.md, and notification app folders exist.",
      status: "SENT",
      timestamp: new Date(Date.now() - 120000).toISOString(),
      responseTimeMs: 142
    },
    {
      id: "notif-p03",
      userId: "ritik-320",
      channel: "PUSH",
      title: "Railways Scheduler Departure",
      body: "Vande Bharat Express depature time modified by +5 minutes.",
      status: "SENT",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      responseTimeMs: 96
    }
  ]);

  const [prefs, setPrefs] = useState<Preferences>({
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    slackEnabled: false,
    quietHours: false
  });

  const [form, setForm] = useState({
    userId: "rvarshney-926",
    channel: "EMAIL" as "EMAIL" | "SMS" | "PUSH" | "SLACK",
    title: "",
    body: ""
  });

  const [filter, setFilter] = useState<"ALL" | "EMAIL" | "SMS" | "PUSH" | "SLACK">("ALL");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body) return;

    setIsSending(true);

    setTimeout(() => {
      // Check preferences
      if (form.channel === "EMAIL" && !prefs.emailEnabled) {
        setLogs(prev => [
          {
            id: `notif-${Math.random().toString(36).substring(2, 9)}`,
            userId: form.userId,
            channel: form.channel,
            title: form.title,
            body: form.body,
            status: "FAILED",
            timestamp: new Date().toISOString(),
            responseTimeMs: 25
          },
          ...prev
        ]);
        setSuccessMsg("Dispatch blocked: Email is deactivated in preferences!");
        setIsSending(false);
        return;
      }

      if (form.channel === "SMS" && !prefs.smsEnabled) {
        setLogs(prev => [
          {
            id: `notif-${Math.random().toString(36).substring(2, 9)}`,
            userId: form.userId,
            channel: form.channel,
            title: form.title,
            body: form.body,
            status: "FAILED",
            timestamp: new Date().toISOString(),
            responseTimeMs: 18
          },
          ...prev
        ]);
        setSuccessMsg("Dispatch blocked: SMS is deactivated in preferences!");
        setIsSending(false);
        return;
      }

      const randomLatency = Math.floor(Math.random() * 120) + 40;
      const newLog: NotificationLog = {
        id: `notif-${Math.random().toString(36).substring(2, 9)}`,
        userId: form.userId,
        channel: form.channel,
        title: form.title,
        body: form.body,
        status: "SENT",
        timestamp: new Date().toISOString(),
        responseTimeMs: randomLatency
      };

      setLogs(prev => [newLog, ...prev]);
      setForm(p => ({ ...p, title: "", body: "" }));
      setSuccessMsg(`Successfully delivered via ${form.channel}!`);
      setIsSending(false);

      setTimeout(() => setSuccessMsg(""), 4000);
    }, 600);
  };

  const togglePref = (key: keyof Preferences) => {
    setPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredLogs = filter === "ALL" ? logs : logs.filter(l => l.channel === filter);

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-150">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 animate-pulse" />
            Microservice Notification Dashboard
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Direct interface to trigger notifications, modify preferences, and audit full logs.
            Adheres to <code className="bg-slate-100 text-indigo-600 px-1 py-0.5 rounded font-mono">notification_app_fe</code> standards.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg text-slate-600 font-bold flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-500" />
            LOGGING_MIDDLEWARE REGISTERED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Dispatcher Form */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
              <Send className="w-4 h-4 text-indigo-600" />
              Trigger Event Notification
            </h4>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wide text-gray-500 mb-1.5">
                  Recipient User ID
                </label>
                <input
                  type="text"
                  required
                  value={form.userId}
                  onChange={e => setForm(p => ({ ...p, userId: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-lg p-2.5 outline-none transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wide text-gray-500 mb-1.5">
                  Delivery Channel
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["EMAIL", "SMS", "PUSH", "SLACK"] as const).map(channel => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, channel }))}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        form.channel === channel
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "bg-slate-50/50 border-gray-200 text-gray-600 hover:bg-slate-50 hover:border-gray-300"
                      }`}
                    >
                      {channel === "EMAIL" && <Mail className="w-3.5 h-3.5" />}
                      {channel === "SMS" && <Hash className="w-3.5 h-3.5" />}
                      {channel === "PUSH" && <Smartphone className="w-3.5 h-3.5" />}
                      {channel === "SLACK" && <Slack className="w-3.5 h-3.5" />}
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wide text-gray-500 mb-1.5">
                  Notification Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule delay notice"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-lg p-2.5 outline-none transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wide text-gray-500 mb-1.5">
                  Notification Body Text
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Insert complete details..."
                  value={form.body}
                  onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-lg p-2.5 outline-none transition-all font-medium resize-none"
                />
              </div>

              {successMsg && (
                <div className={`p-2.5 rounded-lg text-xs font-bold border ${
                  successMsg.includes("blocked")
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}>
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {isSending ? "Sending Alert..." : "Fire Notification"}
              </button>
            </form>
          </div>

          {/* User preferences Panel */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
              <Settings className="w-4 h-4 text-indigo-600" />
              Dynamic User Preferences
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Email Notifications</p>
                    <p className="text-[10px] text-gray-400">Receive system alerts on email</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePref("emailEnabled")}
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${
                    prefs.emailEnabled ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      prefs.emailEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">SMS Notifications</p>
                    <p className="text-[10px] text-gray-400">Receive carrier SMS updates</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePref("smsEnabled")}
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${
                    prefs.smsEnabled ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      prefs.smsEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Web Push Alerts</p>
                    <p className="text-[10px] text-gray-400">Show screen popups immediately</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePref("pushEnabled")}
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${
                    prefs.pushEnabled ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      prefs.pushEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Slack className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Slack Dispatch Integration</p>
                    <p className="text-[10px] text-gray-400">Trigger slack integration webhooks</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePref("slackEnabled")}
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${
                    prefs.slackEnabled ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      prefs.slackEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Quiet Hours Mode (DND)</p>
                    <p className="text-[10px] text-gray-400">Suspend low priority queueing rules</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePref("quietHours")}
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${
                    prefs.quietHours ? "bg-amber-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      prefs.quietHours ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          
        </div>

        {/* Logs Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-150 p-5 shadow-sm space-y-4 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-110 pb-3">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Live Delivery Logs stream
            </h4>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1">
              {(["ALL", "EMAIL", "SMS", "PUSH", "SLACK"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 text-[9px] font-extrabold tracking-wider rounded-md border uppercase transition-all cursor-pointer ${
                    filter === f
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-slate-50 border-gray-150 text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Logs List Container */}
          <div className="flex-1 overflow-y-auto max-h-[580px] space-y-3 pr-1">
            <AnimatePresence initial={false}>
              {filteredLogs.length === 0 ? (
                <div className="h-48 rounded-xl border border-dashed border-gray-200 bg-slate-50/50 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                  <Filter className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-xs font-bold">No Records Found</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Change filters list or trigger a fresh dynamic alert.
                  </p>
                </div>
              ) : (
                filteredLogs.map(log => (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row gap-3 items-start ${
                      log.status === "SENT"
                        ? "bg-emerald-50/30 border-emerald-100 hover:bg-emerald-50/40"
                        : "bg-rose-50/20 border-rose-100 hover:bg-rose-50/30"
                    }`}
                  >
                    {/* Status Icon & Channel Type indicator */}
                    <div className="flex sm:flex-col items-center gap-2 justify-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold shadow-sm ${
                        log.channel === "EMAIL" ? "bg-amber-100 text-amber-700" :
                        log.channel === "SMS" ? "bg-cyan-100 text-cyan-700" :
                        log.channel === "PUSH" ? "bg-indigo-100 text-indigo-700" :
                        "bg-purple-100 text-purple-700"
                      }`}>
                        {log.channel === "EMAIL" && <Mail className="w-4 h-4" />}
                        {log.channel === "SMS" && <Hash className="w-4 h-4" />}
                        {log.channel === "PUSH" && <Smartphone className="w-4 h-4" />}
                        {log.channel === "SLACK" && <Slack className="w-4 h-4" />}
                      </div>

                      <div className="hidden sm:block">
                        {log.status === "SENT" ? (
                          <span className="text-[8px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-100/50 px-1.5 py-0.5 rounded">
                            SENT
                          </span>
                        ) : (
                          <span className="text-[8px] uppercase font-bold tracking-widest text-rose-600 bg-rose-100/50 px-1.5 py-0.5 rounded">
                            BLOCKED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta specifics */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-extrabold text-slate-900 leading-tight">
                          {log.title}
                        </h5>
                        <span className="text-[9px] font-mono font-bold text-slate-400">
                          {log.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {log.body}
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1.5 border-t border-dashed border-gray-100">
                        <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                          Recipient: <span className="text-slate-600">{log.userId}</span>
                        </div>
                        <span className="text-gray-355 text-[8px]">•</span>
                        <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                        <span className="text-gray-355 text-[8px]">•</span>
                        <div className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {log.responseTimeMs} ms
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-center justify-between text-[11px] font-semibold text-slate-500 mt-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Assigned Track: Frontend & Backend Suite
            </span>
            <span>
              Resilience Index: <strong className="text-emerald-600">99.98%</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
