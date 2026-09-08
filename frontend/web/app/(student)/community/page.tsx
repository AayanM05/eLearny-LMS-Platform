'use client';

import React, { useState } from 'react';
import { MessageSquare, Plus, CheckCircle2, Pin, ThumbsUp, MessageCircle } from 'lucide-react';

export default function CommunityPage() {
  const [discussions, setDiscussions] = useState([
    {
      id: 'd-1',
      author: 'Alex Johnson',
      avatar: 'AJ',
      title: 'How to handle JWT token refresh in Spring Security 6 & Next.js?',
      content: 'I am building an authentication flow and wondering what is the best practice for setting up silent token refresh using HTTP-only cookies versus local storage.',
      pinned: true,
      createdAt: '2 hours ago',
      repliesCount: 4,
      accepted: true,
    },
    {
      id: 'd-2',
      author: 'Sophia Chen',
      avatar: 'SC',
      title: 'Best strategy for state management in Expo SDK 51 React Native app?',
      content: 'Comparing Zustand vs Redux Toolkit vs React Query for caching API endpoints in Expo Router v3.',
      pinned: false,
      createdAt: '5 hours ago',
      repliesCount: 2,
      accepted: false,
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setDiscussions([
      {
        id: `d-${Date.now()}`,
        author: 'Demo Student',
        avatar: 'DS',
        title: newTitle,
        content: newContent,
        pinned: false,
        createdAt: 'Just now',
        repliesCount: 0,
        accepted: false,
      },
      ...discussions,
    ]);

    setNewTitle('');
    setNewContent('');
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Global Q&A & Discussion Forum
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Student & Instructor Community
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Ask questions, share code snippets, help peers, and engage with course instructors in real time.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          Ask a Question
        </button>
      </div>

      {/* Discussion List */}
      <div className="space-y-4">
        {discussions.map((d) => (
          <div
            key={d.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/30 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-sm">
                  {d.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {d.author}
                  </h4>
                  <span className="text-xs text-slate-400">{d.createdAt}</span>
                </div>
              </div>

              {d.pinned && (
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
                  <Pin className="w-3.5 h-3.5" />
                  Pinned Discussion
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                {d.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {d.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium hover:text-indigo-600 cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  {d.repliesCount} Replies
                </span>
                <span className="flex items-center gap-1.5 font-medium hover:text-indigo-600 cursor-pointer">
                  <ThumbsUp className="w-4 h-4" />
                  Helpful
                </span>
              </div>

              {d.accepted && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Solved Answer
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              Ask the Community
            </h2>
            <form onSubmit={handlePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Question Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How to resolve Spring Security CORS error?"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Details & Code Context
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Describe your issue or code snippet..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
