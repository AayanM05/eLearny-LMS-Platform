import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, View } from "react-native";
import { AppText } from "@/components/AppText";
import { AppHeading } from "@/components/AppHeading";

// Phase 0 placeholder screen, migrated to expo-router's file-based routing
// when Mobile needed real navigation for Phase 1's Register/Verify screens.
export default function Home() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
      <AppHeading className="text-2xl text-foreground">eLearny</AppHeading>
      <AppText className="text-center text-muted-foreground">
        Phase 0 scaffold, now with expo-router navigation for Phase 1's
        Register and Email Verification screens.
      </AppText>
      {/* asChild + Pressable is the documented, reliable expo-router
          pattern for a styled "link-as-button" — a bare <Link> wrapping a
          styled child rendered inconsistently on-device (reported by user,
          2026-09-14), asChild hands rendering fully to the Pressable
          instead of Link's own (Text-based) default rendering. */}
      <Link href="/register" asChild>
        <Pressable className="rounded border border-border bg-primary px-4 py-2">
          <AppText className="text-sm font-medium text-primary-foreground">Go to Register</AppText>
        </Pressable>
      </Link>
      <StatusBar style="auto" />
    </View>
  );
}
