'use client';

import React, { useState } from 'react';
import { Gift, Copy, Check, Users, Sparkles, Trophy } from 'lucide-react';

export default function ReferralPage() {
  const referralCode = 'REF-ELE-89A4B12C';
  const referralLink = 'http://localhost:3000/register?ref=REF-ELE-89A4B12C';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <Gift className="w-4 h-4 text-amber-400" />
          Referral & Growth Rewards
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
          Invite Friends, Earn +200 XP
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
          Share your unique referral code with peers. You get +200 XP for every friend who joins, and they get +100 XP welcome bonus!
        </p>
      </div>

      {/* Referral Code & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
            Your Unique Referral Code
          </h2>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="font-mono text-lg font-black text-indigo-600 dark:text-indigo-400 flex-1">
              {referralCode}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Link!' : 'Copy Share Link'}
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">How it works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">1. Share Code</span>
                <p className="text-slate-600 dark:text-slate-400">Send your referral link to friends or classmates.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">2. Sign Up</span>
                <p className="text-slate-600 dark:text-slate-400">Friend creates a free eLearny student account.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">3. Claim Rewards</span>
                <p className="text-slate-600 dark:text-slate-400">+200 XP credited instantly to your leaderboard profile.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase">Successful Referrals</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading">3 Students</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase">XP Earned from Referrals</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading">+600 XP</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
