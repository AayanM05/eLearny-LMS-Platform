import { useState } from "react";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import { AppText } from "@/components/AppText";
import { AppHeading } from "@/components/AppHeading";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ApiRequestError, applyToBeInstructor } from "@/lib/api";

export default function InstructorApplyScreen() {
  const authChecked = useRequireAuth();
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [expertiseTags, setExpertiseTags] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!authChecked) return null;

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await applyToBeInstructor({
        bio,
        yearsExperience: Number(yearsExperience) || 0,
        expertiseTags,
        portfolioUrl: portfolioUrl || undefined,
        resumeUrl: resumeUrl || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.apiError?.message ?? "Something went wrong.");
      } else {
        setError("Couldn't reach the server.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-6">
        <AppHeading className="text-2xl text-foreground">Application submitted</AppHeading>
        <AppText className="text-center text-muted-foreground">
          An admin will review it. You&apos;ll get an email if you&apos;re approved.
        </AppText>
        <Pressable onPress={() => router.push("/")}>
          <AppText className="text-primary underline">Back home</AppText>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
      <ScrollView contentContainerClassName="px-5 py-10">
        <View className="gap-5 rounded border border-border bg-background p-6">
          <View className="items-center">
            <AppHeading className="text-2xl text-foreground">Apply to become an instructor</AppHeading>
            <AppText className="mt-1 text-center text-sm text-muted-foreground">
              No separate instructor registration — every instructor account starts here.
            </AppText>
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Bio *</AppText>
            <TextInput
              multiline
              numberOfLines={4}
              className="rounded border border-border bg-background px-3 py-2 font-sans text-foreground"
              value={bio}
              onChangeText={setBio}
            />
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Years of experience *</AppText>
            <TextInput
              keyboardType="number-pad"
              className="rounded border border-border bg-background px-3 py-2 font-sans text-foreground"
              value={yearsExperience}
              onChangeText={setYearsExperience}
            />
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Areas of expertise *</AppText>
            <TextInput
              placeholder="e.g. JavaScript, React, Node.js"
              className="rounded border border-border bg-background px-3 py-2 font-sans text-foreground"
              value={expertiseTags}
              onChangeText={setExpertiseTags}
            />
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Portfolio URL</AppText>
            <TextInput
              autoCapitalize="none"
              className="rounded border border-border bg-background px-3 py-2 font-sans text-foreground"
              value={portfolioUrl}
              onChangeText={setPortfolioUrl}
            />
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Resume URL</AppText>
            <TextInput
              autoCapitalize="none"
              className="rounded border border-border bg-background px-3 py-2 font-sans text-foreground"
              value={resumeUrl}
              onChangeText={setResumeUrl}
            />
          </View>

          {error && (
            <View className="rounded border border-destructive bg-destructive/10 px-3 py-2">
              <AppText className="text-sm text-destructive">{error}</AppText>
            </View>
          )}

          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            className={`rounded bg-primary px-4 py-3 ${submitting ? "opacity-40" : ""}`}
          >
            <AppText className="text-center font-medium text-primary-foreground">
              {submitting ? "Submitting…" : "Submit application"}
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
