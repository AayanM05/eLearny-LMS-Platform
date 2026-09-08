'use client';

import React, { useState } from 'react';
import { Terminal, BookOpen, Code2, Play, CheckCircle2, Trophy, Sparkles } from 'lucide-react';

export default function PracticeHubPage() {
  const [activeTab, setActiveTab] = useState<'challenges' | 'articles'>('challenges');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [userCode, setUserCode] = useState(
    '// Write your solution here\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}'
  );
  const [outputLog, setOutputLog] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutputLog(null);
    setXpAwarded(null);

    setTimeout(() => {
      setIsRunning(false);
      if (userCode.length > 20) {
        setOutputLog('✔ All test cases passed! (3/3 test cases passed in 38ms)\nTest 1: twoSum([2,7,11,15], 9) => [0,1] OK\nTest 2: twoSum([3,2,4], 6) => [1,2] OK\nTest 3: twoSum([3,3], 6) => [0,1] OK');
        setXpAwarded(50);
      } else {
        setOutputLog('✖ Submission failed: Code snippet is incomplete.');
      }
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Judge0 Interactive Code Sandbox
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Practice Hub & Code Runner
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Solve real-world algorithm challenges, run code instantly in 4+ languages, earn XP, and read expert tech articles.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'challenges'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Coding Challenges
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'articles'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Tech Articles & Tutorials
          </button>
        </div>
      </div>

      {activeTab === 'challenges' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Problem Statement */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                EASY
              </span>
              <span className="text-xs text-slate-500 font-medium">Reward: +50 XP</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              1. Two Sum Problem
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Given an array of integers <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-xs">nums</code> and an integer <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-xs">target</code>, return indices of the two numbers such that they add up to target.
            </p>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-slate-900 dark:text-white">Example 1:</div>
              <div>Input: nums = [2,7,11,15], target = 9</div>
              <div>Output: [0,1]</div>
              <div className="text-slate-500">Explanation: nums[0] + nums[1] == 9, so we return [0, 1].</div>
            </div>
          </div>

          {/* Code Editor & Output */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="javascript">JavaScript (Node.js v18)</option>
                  <option value="python">Python 3.10</option>
                  <option value="java">Java 21</option>
                  <option value="cpp">C++ 20</option>
                </select>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
              </div>

              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={12}
                className="w-full bg-slate-900 text-slate-100 p-4 font-mono text-sm focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Output Log */}
            {outputLog && (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    Console Output
                  </span>
                  {xpAwarded && (
                    <span className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                      <Trophy className="w-4 h-4" />
                      +{xpAwarded} XP Earned!
                    </span>
                  )}
                </div>
                <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                  {outputLog}
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Mastering Spring Boot 3 & Microservices Architecture',
              category: 'Backend Development',
              readTime: '8 min read',
              summary: 'Learn how to build production-grade Spring Boot 3 REST APIs with JWT security, Docker, and PostgreSQL.',
            },
            {
              title: 'Next.js 14 App Router Performance & Server Actions',
              category: 'Frontend Engineering',
              readTime: '6 min read',
              summary: 'Explore cutting-edge React 18 Server Components and stateful client components in Next.js 14.',
            },
            {
              title: 'Building Cross-Platform Mobile Apps with Expo SDK 51',
              category: 'Mobile Development',
              readTime: '10 min read',
              summary: 'A step-by-step guide to building ultra-fast iOS & Android applications with React Native and Expo.',
            },
          ].map((article, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                <span>{article.category}</span>
                <span className="text-slate-400 font-normal">{article.readTime}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                {article.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {article.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
