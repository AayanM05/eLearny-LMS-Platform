'use client';

import React from 'react';
import { Trophy, Flame, Zap, Award, Star, ShieldCheck } from 'lucide-react';

export default function LeaderboardPage() {
  const leaderboardData = [
    { rank: 1, name: 'Alex Rivera', xp: 4850, streak: 14, badge: 'LMS_MASTER', isUser: false },
    { rank: 2, name: 'Demo Student (You)', xp: 2450, streak: 7, badge: '7_DAY_STREAK', isUser: true },
    { rank: 3, name: 'Sofia Patel', xp: 2100, streak: 5, badge: '500_XP_ACHIEVER', isUser: false },
    { rank: 4, name: 'Marcus Vance', xp: 1890, streak: 4, badge: '3_DAY_STREAK', isUser: false },
    { rank: 5, name: 'Elena Rostova', xp: 1650, streak: 3, badge: 'BEGINNER', isUser: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-purple-900 to-indigo-950 rounded-3xl p-8 text-white shadow-2xl space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-amber-400" />
          Gamification & XP Leaderboard
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
          Global Learning Champions
        </h1>
        <p className="text-slate-200 text-sm sm:text-base max-w-2xl">
          Earn XP by completing video lessons, passing quizzes, and solving daily coding challenges in Practice Hub.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Total XP</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading">2,450 XP</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Current Streak</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading">7 Days</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Global Rank</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading">#2</h3>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 font-semibold text-sm text-slate-700 dark:text-slate-300">
          Top 20 Leaderboard
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {leaderboardData.map((user) => (
            <div
              key={user.rank}
              className={`px-6 py-4 flex items-center justify-between transition-all ${
                user.isUser
                  ? 'bg-indigo-50/60 dark:bg-indigo-950/30 font-semibold'
                  : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                    user.rank === 1
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                      : user.rank === 2
                      ? 'bg-slate-300 text-slate-900'
                      : user.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'text-slate-500 font-medium'
                  }`}
                >
                  {user.rank}
                </span>

                <div>
                  <h4 className="text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    {user.name}
                    {user.isUser && (
                      <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                        You
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-slate-400 font-normal">Badge: {user.badge}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-orange-500 text-xs font-semibold">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  {user.streak}d
                </div>
                <div className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                  {user.xp.toLocaleString()} XP
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
