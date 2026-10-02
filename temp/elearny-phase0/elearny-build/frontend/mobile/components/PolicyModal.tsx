import { X } from "lucide-react-native";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { AppText } from "@/components/AppText";

// Same placeholder text as the web version — keep both in sync manually
// until this is pulled from a shared package or a real CMS-backed endpoint.
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
username), your course activity and progress, and payment metadata (not
full card numbers — those are handled by Razorpay directly).

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
  visible,
  onClose,
  onAccept,
}: {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/40 px-4">
        <View className="max-h-[80%] w-full max-w-lg rounded border border-border bg-background">
          <View className="flex-row items-center justify-between border-b border-border px-5 py-4">
            <AppText className="font-semibold text-foreground">Terms of Service &amp; Privacy Policy</AppText>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={20} color="#75757A" />
            </Pressable>
          </View>

          <ScrollView className="px-5 py-4">
            <AppText className="text-sm text-foreground">{POLICY_TEXT}</AppText>
          </ScrollView>

          <View className="border-t border-border px-5 py-4">
            <Pressable onPress={onAccept} className="rounded bg-primary px-4 py-3">
              <AppText className="text-center font-medium text-primary-foreground">Accept</AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
