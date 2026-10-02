"use client";

import { X } from "lucide-react";

// Placeholder legal text — pages.md §1.8's real Terms & Privacy Viewer isn't
// built yet either. Replace this before any real launch; it exists so the
// modal has real scrollable content to demonstrate the actual UX pattern.
const POLICY_TEXT = `
eLearny Terms of Service & Privacy Policy (Draft)

1. Acceptance of Terms
By creating an account, you agree to these Terms of Service and the
accompanying Privacy Policy. If you do not agree, do not create an account.

2. Accounts
You are responsible for keeping your password confidential and for all
activity under your account. You must provide accurate registration
information, including a real email address you control.

3. Acceptable Use
You agree not to share your account, upload content you don't have rights
to, or attempt to circumvent platform security (including exam integrity
controls).

4. Payments & Refunds
Course purchases are processed via Razorpay. Refund eligibility is
described on each course's page at the time of purchase.

5. Instructor Content
Instructors retain ownership of their course content but grant eLearny a
license to host, stream, and display it to enrolled students.

6. Privacy — What We Collect
We collect the information you provide at registration (name, email,
username, optional phone), your course activity and progress, and payment
metadata (not full card numbers — those are handled by Razorpay directly).

7. Privacy — How We Use It
Your data is used to operate your account, process payments, issue
certificates, and — only where you've enabled it — power gamification
leaderboards and personalized course recommendations.

8. Data Retention & Deletion
You may request account deletion at any time via Support. Some records
(e.g. completed payment records) may be retained as required by law.

9. Changes to These Terms
We'll notify you by email if these terms change materially. Continued use
after a change constitutes acceptance of the updated terms.

10. Contact
Questions about these terms can be sent via the Support page.
`.trim();

export function PolicyModal({
  open,
  onClose,
  onAccept,
}: {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4">
      <div className="flex max-h-[80vh] w-full max-w-lg flex-col rounded border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">Terms of Service &amp; Privacy Policy</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">{POLICY_TEXT}</pre>
        </div>

        <div className="border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onAccept}
            className="w-full cursor-pointer rounded bg-primary px-4 py-2 font-medium text-primary-foreground"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
