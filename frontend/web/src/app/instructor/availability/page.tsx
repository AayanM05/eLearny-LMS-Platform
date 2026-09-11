"use me";
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  CheckCircle,
  Video,
  UserPlus,
  Sparkles,
  Trash2
} from "lucide-react";

interface Leave {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
}

interface Slot {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  meetingLink: string;
}

interface TA {
  id: number;
  email: string;
  permissions: string;
  status: string;
}

export default function InstructorAvailabilityPage() {
  const [activeTab, setActiveTab] = useState<"LEAVE" | "LIVE" | "TA">("LIVE");

  const [leaves, setLeaves] = useState<Leave[]>([
    { id: 1, startDate: "2026-09-20", endDate: "2026-09-25", reason: "Annual Academic Research Conference" }
  ]);

  const [slots, setSlots] = useState<Slot[]>([
    { id: 1, title: "1-on-1 Code Review & Mentorship", startTime: "2026-09-15T14:00", endTime: "2026-09-15T15:00", maxCapacity: 1, meetingLink: "https://meet.elearny.com/room-101" },
    { id: 2, title: "Spring Security Q&A Office Hours", startTime: "2026-09-18T16:00", endTime: "2026-09-18T17:30", maxCapacity: 25, meetingLink: "https://meet.elearny.com/office-hours" }
  ]);

  const [tas, setTas] = useState<TA[]>([
    { id: 1, email: "john.ta@elearny.com", permissions: "GRADING,QNA", status: "ACCEPTED" }
  ]);

  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  const [slotTitle, setSlotTitle] = useState("");
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [slotCapacity, setSlotCapacity] = useState(1);

  const [taEmail, setTaEmail] = useState("");

  const handleAddLeave = () => {
    if (!leaveStart || !leaveEnd) return;
    setLeaves([...leaves, { id: Date.now(), startDate: leaveStart, endDate: leaveEnd, reason: leaveReason || "Personal Leave" }]);
    setLeaveStart("");
    setLeaveEnd("");
    setLeaveReason("");
  };

  const handleAddSlot = () => {
    if (!slotTitle || !slotStart || !slotEnd) return;
    setSlots([...slots, { id: Date.now(), title: slotTitle, startTime: slotStart, endTime: slotEnd, maxCapacity: slotCapacity, meetingLink: "https://meet.elearny.com/slot-" + Date.now() }]);
    setSlotTitle("");
    setSlotStart("");
    setSlotEnd("");
  };

  const handleInviteTA = () => {
    if (!taEmail) return;
    setTas([...tas, { id: Date.now(), email: taEmail, permissions: "GRADING,QNA", status: "PENDING" }]);
    setTaEmail("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-[#D96B43] selection:text-white">
      {/* Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D96B43] to-[#F2994A] flex items-center justify-center text-white shadow-lg shadow-[#D96B43]/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">eLearny <span className="text-[#D96B43]">Studio</span></span>
        </Link>
        <Link href="/instructor/courses/create" className="text-sm font-medium text-[#D96B43] hover:underline">
          Create Course
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div>
          <div className="inline-flex items-center space-x-2 text-[#D96B43] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Academic Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Availability, Live Classes & TA Delegation</h1>
          <p className="text-slate-400 text-sm mt-1">Configure blackout date ranges, offer 1-on-1 office hours, and delegate grading rights to Teaching Assistants.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 space-x-8">
          <button
            onClick={() => setActiveTab("LIVE")}
            className={`pb-4 font-semibold text-sm flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "LIVE" ? "border-[#D96B43] text-[#D96B43]" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>Live Slots & Office Hours</span>
          </button>
          <button
            onClick={() => setActiveTab("LEAVE")}
            className={`pb-4 font-semibold text-sm flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "LEAVE" ? "border-[#D96B43] text-[#D96B43]" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Blackout Dates & Leave</span>
          </button>
          <button
            onClick={() => setActiveTab("TA")}
            className={`pb-4 font-semibold text-sm flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "TA" ? "border-[#D96B43] text-[#D96B43]" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Teaching Assistants (TA)</span>
          </button>
        </div>

        {/* Tab 1: Live Slots */}
        {activeTab === "LIVE" && (
          <div className="space-y-6">
            {/* Create Slot Form */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Video className="w-5 h-5 mr-2 text-[#D96B43]" /> Schedule New Live Office Hour / 1-on-1
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={slotTitle}
                  onChange={(e) => setSlotTitle(e.target.value)}
                  placeholder="Session Title (e.g. Code Review)"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-[#D96B43] outline-none"
                />
                <input
                  type="datetime-local"
                  value={slotStart}
                  onChange={(e) => setSlotStart(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-[#D96B43] outline-none"
                />
                <input
                  type="datetime-local"
                  value={slotEnd}
                  onChange={(e) => setSlotEnd(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-[#D96B43] outline-none"
                />
                <button
                  onClick={handleAddSlot}
                  className="py-3 rounded-xl bg-gradient-to-r from-[#D96B43] to-[#F2994A] text-white font-bold text-sm shadow-lg shadow-[#D96B43]/20 flex items-center justify-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Slot</span>
                </button>
              </div>
            </div>

            {/* Existing Slots */}
            <div className="space-y-4">
              {slots.map((s) => (
                <div key={s.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-white text-base">{s.title}</h4>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {new Date(s.startTime).toLocaleString()} — {new Date(s.endTime).toLocaleTimeString()} • Max Capacity: {s.maxCapacity} student(s)
                    </p>
                  </div>
                  <a
                    href={s.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600/30"
                  >
                    Join Meeting Link
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Blackout Dates */}
        {activeTab === "LEAVE" && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-[#D96B43]" /> Record Instructor Blackout Dates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <input
                  type="date"
                  value={leaveStart}
                  onChange={(e) => setLeaveStart(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none"
                />
                <input
                  type="date"
                  value={leaveEnd}
                  onChange={(e) => setLeaveEnd(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none"
                />
                <input
                  type="text"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Reason (Conference, Vacation)"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none"
                />
                <button
                  onClick={handleAddLeave}
                  className="py-3 rounded-xl bg-[#D96B43] text-white font-bold text-sm shadow-lg"
                >
                  Save Blackout
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {leaves.map((l) => (
                <div key={l.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex justify-between items-center">
                  <div>
                    <span className="text-[#D96B43] font-semibold text-sm">{l.startDate} to {l.endDate}</span>
                    <p className="text-slate-300 text-xs mt-0.5">{l.reason}</p>
                  </div>
                  <button onClick={() => setLeaves(leaves.filter(x => x.id !== l.id))} className="text-slate-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Teaching Assistants */}
        {activeTab === "TA" && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center">
                <UserPlus className="w-5 h-5 mr-2 text-[#D96B43]" /> Invite Teaching Assistant (TA)
              </h3>
              <div className="flex gap-4">
                <input
                  type="email"
                  value={taEmail}
                  onChange={(e) => setTaEmail(e.target.value)}
                  placeholder="Enter TA email address (e.g. assistant@university.edu)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none"
                />
                <button
                  onClick={handleInviteTA}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D96B43] to-[#F2994A] text-white font-bold text-sm"
                >
                  Send Invitation
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {tas.map((t) => (
                <div key={t.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.email}</h4>
                    <p className="text-slate-400 text-xs">Permissions: {t.permissions}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    t.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
