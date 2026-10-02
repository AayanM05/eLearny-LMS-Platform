import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { AppText } from "@/components/AppText";
import { AppHeading } from "@/components/AppHeading";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
  ApiRequestError,
  CourseDetailResponse,
  addLesson,
  addSection,
  getCourseDetail,
  publishCourse,
} from "@/lib/api";

const CONTENT_TYPES = ["VIDEO", "ARTICLE", "RESOURCE"];

export default function CourseBuilderScreen() {
  const authChecked = useRequireAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [addingSection, setAddingSection] = useState(false);

  const [lessonFormOpenFor, setLessonFormOpenFor] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContentType, setLessonContentType] = useState("VIDEO");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonArticleContent, setLessonArticleContent] = useState("");
  const [lessonResourceUrl, setLessonResourceUrl] = useState("");
  const [lessonDripDays, setLessonDripDays] = useState("0");
  const [addingLesson, setAddingLesson] = useState(false);

  function reload() {
    getCourseDetail(id).then(setCourse).catch((err) => {
      if (err instanceof ApiRequestError) {
        setError(err.status === 404 ? "Course not found (or it's not yours)." : "Failed to load course.");
      }
    });
  }

  useEffect(() => {
    if (!authChecked) return;
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked, id]);

  if (!authChecked) return null;

  async function handleAddSection() {
    if (!newSectionTitle.trim() || !course) return;
    setAddingSection(true);
    try {
      await addSection(id, newSectionTitle, course.sections.length);
      setNewSectionTitle("");
      reload();
    } catch (err) {
      if (err instanceof ApiRequestError) setError(err.apiError?.message ?? "Failed to add section.");
    } finally {
      setAddingSection(false);
    }
  }

  async function handleAddLesson(sectionId: string, position: number) {
    setAddingLesson(true);
    try {
      await addLesson(id, sectionId, {
        title: lessonTitle,
        contentType: lessonContentType,
        videoUrl: lessonContentType === "VIDEO" ? lessonVideoUrl || undefined : undefined,
        articleContent: lessonContentType === "ARTICLE" ? lessonArticleContent || undefined : undefined,
        resourceUrl: lessonContentType === "RESOURCE" ? lessonResourceUrl || undefined : undefined,
        position,
        dripDelayDays: Number(lessonDripDays) || 0,
      });
      setLessonFormOpenFor(null);
      setLessonTitle("");
      setLessonVideoUrl("");
      setLessonArticleContent("");
      setLessonResourceUrl("");
      setLessonDripDays("0");
      reload();
    } catch (err) {
      if (err instanceof ApiRequestError) setError(err.apiError?.message ?? "Failed to add lesson.");
    } finally {
      setAddingLesson(false);
    }
  }

  async function handlePublish() {
    setPublishMessage(null);
    setError(null);
    try {
      await publishCourse(id);
      setPublishMessage("Course published! 🎉");
      reload();
    } catch (err) {
      if (err instanceof ApiRequestError) setError(err.apiError?.message ?? "Couldn't publish.");
    }
  }

  if (error && !course) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <AppText className="text-center text-destructive">{error}</AppText>
      </View>
    );
  }

  if (!course) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <AppText className="text-muted-foreground">Loading…</AppText>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background px-5 pt-14" contentContainerClassName="pb-10">
      <View className="flex-row items-center justify-between">
        <View>
          <AppHeading className="text-2xl text-foreground">{course.title}</AppHeading>
          <View
            className={`mt-1 self-start rounded px-2 py-0.5 ${course.status === "PUBLISHED" ? "bg-success/10" : "bg-muted"}`}
          >
            <AppText className={`text-xs font-medium ${course.status === "PUBLISHED" ? "text-success" : "text-muted-foreground"}`}>
              {course.status} · v{course.version}
            </AppText>
          </View>
        </View>
        {course.status === "DRAFT" && (
          <Pressable onPress={handlePublish} className="rounded bg-primary px-4 py-2">
            <AppText className="text-sm font-medium text-primary-foreground">Publish</AppText>
          </Pressable>
        )}
      </View>

      {publishMessage && <AppText className="mt-4 text-sm text-success">{publishMessage}</AppText>}
      {error && (
        <View className="mt-4 rounded border border-destructive bg-destructive/10 px-3 py-2">
          <AppText className="text-sm text-destructive">{error}</AppText>
        </View>
      )}

      <View className="mt-8 gap-4">
        {course.sections.map((section) => (
          <View key={section.id} className="rounded border border-border p-4">
            <AppText className="font-medium text-foreground">{section.title}</AppText>

            <View className="mt-2 gap-1">
              {section.lessons.map((lesson) => (
                <View key={lesson.id} className="flex-row items-center gap-2">
                  <View className="rounded bg-muted px-1.5 py-0.5">
                    <AppText className="text-xs text-muted-foreground">{lesson.contentType}</AppText>
                  </View>
                  <AppText className="text-sm text-muted-foreground">{lesson.title}</AppText>
                </View>
              ))}
              {section.lessons.length === 0 && (
                <AppText className="text-sm italic text-muted-foreground">No lessons yet</AppText>
              )}
            </View>

            {lessonFormOpenFor === section.id ? (
              <View className="mt-3 gap-2 rounded border border-border p-3">
                <TextInput
                  placeholder="Lesson title"
                  className="rounded border border-border bg-background px-2 py-2 font-sans text-sm text-foreground"
                  value={lessonTitle}
                  onChangeText={setLessonTitle}
                />
                <View className="flex-row gap-1">
                  {CONTENT_TYPES.map((t) => (
                    <Pressable
                      key={t}
                      onPress={() => setLessonContentType(t)}
                      className={`rounded border px-2 py-1 ${lessonContentType === t ? "border-primary bg-primary" : "border-border"}`}
                    >
                      <AppText className={`text-xs ${lessonContentType === t ? "text-primary-foreground" : "text-foreground"}`}>
                        {t}
                      </AppText>
                    </Pressable>
                  ))}
                </View>
                {lessonContentType === "VIDEO" && (
                  <TextInput
                    placeholder="Video URL"
                    autoCapitalize="none"
                    className="rounded border border-border bg-background px-2 py-2 font-sans text-sm text-foreground"
                    value={lessonVideoUrl}
                    onChangeText={setLessonVideoUrl}
                  />
                )}
                {lessonContentType === "ARTICLE" && (
                  <TextInput
                    placeholder="Article content"
                    multiline
                    numberOfLines={3}
                    className="rounded border border-border bg-background px-2 py-2 font-sans text-sm text-foreground"
                    value={lessonArticleContent}
                    onChangeText={setLessonArticleContent}
                  />
                )}
                {lessonContentType === "RESOURCE" && (
                  <TextInput
                    placeholder="Resource URL"
                    autoCapitalize="none"
                    className="rounded border border-border bg-background px-2 py-2 font-sans text-sm text-foreground"
                    value={lessonResourceUrl}
                    onChangeText={setLessonResourceUrl}
                  />
                )}
                <View className="flex-row items-center gap-2">
                  <AppText className="text-xs text-muted-foreground">Drip delay (days)</AppText>
                  <TextInput
                    keyboardType="number-pad"
                    className="w-16 rounded border border-border bg-background px-2 py-1 font-sans text-sm text-foreground"
                    value={lessonDripDays}
                    onChangeText={setLessonDripDays}
                  />
                </View>
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => handleAddLesson(section.id, section.lessons.length)}
                    disabled={addingLesson}
                    className="rounded bg-primary px-3 py-2"
                  >
                    <AppText className="text-sm font-medium text-primary-foreground">Add lesson</AppText>
                  </Pressable>
                  <Pressable onPress={() => setLessonFormOpenFor(null)}>
                    <AppText className="text-sm text-muted-foreground">Cancel</AppText>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable onPress={() => setLessonFormOpenFor(section.id)} className="mt-3">
                <AppText className="text-sm text-primary underline">+ Add lesson</AppText>
              </Pressable>
            )}
          </View>
        ))}
      </View>

      <View className="mt-6 flex-row gap-2">
        <TextInput
          placeholder="New section title"
          className="flex-1 rounded border border-border bg-background px-3 py-2.5 font-sans text-sm text-foreground"
          value={newSectionTitle}
          onChangeText={setNewSectionTitle}
        />
        <Pressable onPress={handleAddSection} disabled={addingSection} className="rounded bg-primary px-4 py-2.5">
          <AppText className="text-sm font-medium text-primary-foreground">+ Add section</AppText>
        </Pressable>
      </View>
    </ScrollView>
  );
}
