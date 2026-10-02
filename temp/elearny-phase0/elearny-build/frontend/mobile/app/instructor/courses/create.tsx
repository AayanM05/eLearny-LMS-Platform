import { useState } from "react";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import { AppText } from "@/components/AppText";
import { AppHeading } from "@/components/AppHeading";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ApiRequestError, createCourse } from "@/lib/api";

const DIFFICULTY_OPTIONS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function CreateCourseScreen() {
  const authChecked = useRequireAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [priceDollars, setPriceDollars] = useState("0");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [promoVideoUrl, setPromoVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authChecked) return null;

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const course = await createCourse({
        title,
        tagline: tagline || undefined,
        category: category || undefined,
        difficultyLevel: difficultyLevel || undefined,
        priceCents: Math.round((Number(priceDollars) || 0) * 100),
        thumbnailUrl: thumbnailUrl || undefined,
        promoVideoUrl: promoVideoUrl || undefined,
      });
      router.replace(`/instructor/courses/${course.id}/builder`);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.status === 403 ? "Only instructors can create courses." : err.apiError?.message ?? "Failed to create course.");
      } else {
        setError("Couldn't reach the server.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
      <ScrollView contentContainerClassName="px-5 py-10">
        <View className="gap-5 rounded border border-border bg-background p-6">
          <AppHeading className="text-2xl text-foreground">Create a new course</AppHeading>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Title *</AppText>
            <TextInput
              className="rounded border border-border bg-background px-3 py-2.5 font-sans text-foreground"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Tagline</AppText>
            <TextInput
              className="rounded border border-border bg-background px-3 py-2.5 font-sans text-foreground"
              value={tagline}
              onChangeText={setTagline}
            />
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <AppText className="mb-1 text-sm font-medium text-foreground">Category</AppText>
              <TextInput
                className="rounded border border-border bg-background px-3 py-2.5 font-sans text-foreground"
                value={category}
                onChangeText={setCategory}
              />
            </View>
            <View className="flex-1">
              <AppText className="mb-1 text-sm font-medium text-foreground">Difficulty</AppText>
              <View className="flex-row flex-wrap gap-1">
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt}
                    onPress={() => setDifficultyLevel(opt)}
                    className={`rounded border px-2 py-1 ${difficultyLevel === opt ? "border-primary bg-primary" : "border-border"}`}
                  >
                    <AppText className={`text-xs ${difficultyLevel === opt ? "text-primary-foreground" : "text-foreground"}`}>
                      {opt.charAt(0) + opt.slice(1).toLowerCase()}
                    </AppText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Price (USD)</AppText>
            <TextInput
              keyboardType="decimal-pad"
              className="rounded border border-border bg-background px-3 py-2.5 font-sans text-foreground"
              value={priceDollars}
              onChangeText={setPriceDollars}
            />
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Thumbnail URL</AppText>
            <TextInput
              autoCapitalize="none"
              className="rounded border border-border bg-background px-3 py-2.5 font-sans text-foreground"
              value={thumbnailUrl}
              onChangeText={setThumbnailUrl}
            />
            <AppText className="mt-1 text-xs text-muted-foreground">
              Direct media uploads come in a later pass — paste a URL for now.
            </AppText>
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Promo video URL</AppText>
            <TextInput
              autoCapitalize="none"
              className="rounded border border-border bg-background px-3 py-2.5 font-sans text-foreground"
              value={promoVideoUrl}
              onChangeText={setPromoVideoUrl}
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
              {submitting ? "Creating…" : "Create course & continue"}
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
