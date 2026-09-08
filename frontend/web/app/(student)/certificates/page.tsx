'use client';

import React from 'react';
import { Award, Download, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CertificatesPage() {
  const dummyCertificates = [
    {
      id: 'cert-1',
      courseTitle: 'Full-Stack Web Development Bootcamp',
      instructorName: 'Dr. Alex Rivera',
      issuedAt: '2026-08-15',
      code: 'CERT-ELE-89A4B12C',
      verificationUrl: 'http://localhost:3000/verify-certificate/CERT-ELE-89A4B12C',
    },
    {
      id: 'cert-2',
      courseTitle: 'Spring Boot 3 & Microservices Masterclass',
      instructorName: 'Sarah Jenkins',
      issuedAt: '2026-09-01',
      code: 'CERT-ELE-99F1C33X',
      verificationUrl: 'http://localhost:3000/verify-certificate/CERT-ELE-99F1C33X',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Award className="w-4 h-4 text-amber-400" />
          Apache PDFBox Verification Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
          My Earned Certificates
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
          Download officially signed PDF certificates of completion featuring unique verification codes and QR links.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyCertificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Award className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Badge
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading leading-snug">
                  {cert.courseTitle}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Instructor: <span className="font-semibold text-slate-700 dark:text-slate-200">{cert.instructorName}</span>
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Issued Date:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{cert.issuedAt}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Certificate ID:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{cert.code}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={`/api/v1/certificates/download/${cert.code}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
              <a
                href={`/verify-certificate/${cert.code}`}
                className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Verify
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
