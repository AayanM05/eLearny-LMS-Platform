import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { AppText } from "@/components/AppText";
import { AppHeading } from "@/components/AppHeading";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ApiRequestError, CourseResponse, listMyCourses } from "@/lib/api";

export default function InstructorDashboardScreen() {
  const authChecked = useRequireAuth();
  const [courses, setCourses] = useState<CourseResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authChecked) return;
    listMyCourses()
      .then(setCourses)
      .catch((err) => {
        if (err instanceof ApiRequestError) {
          setError(err.status === 403 ? "This dashboard is for instructors only." : "Failed to load courses.");
        }
      });
  }, [authChecked]);

  if (!authChecked) return null;

  return (
    <View className="flex-1 bg-background px-5 pt-14">
      <View className="flex-row items-center justify-between">
        <AppHeading className="text-2xl text-foreground">Your courses</AppHeading>
        <Link href="/instructor/courses/create" asChild>
          <Pressable className="rounded bg-primary px-3 py-2">
            <AppText className="text-sm font-medium text-primary-foreground">+ New course</AppText>
          </Pressable>
        </Link>
      </View>

      {error && (
        <View className="mt-4 rounded border border-destructive bg-destructive/10 px-3 py-2">
          <AppText className="text-sm text-destructive">{error}</AppText>
        </View>
      )}

      {courses === null && !error && <AppText className="mt-6 text-muted-foreground">Loading…</AppText>}
      {courses?.length === 0 && (
        <AppText className="mt-6 text-muted-foreground">No courses yet — create your first one above.</AppText>
      )}

      <FlatList
        data={courses ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 py-4"
        renderItem={({ item }) => (
          <Link href={`/instructor/courses/${item.id}/builder`} asChild>
            <Pressable className="rounded border border-border p-4">
              <View className="flex-row items-center justify-between">
                <AppText className="font-medium text-foreground">{item.title}</AppText>
                <View
                  className={`rounded px-2 py-0.5 ${item.status === "PUBLISHED" ? "bg-success/10" : "bg-muted"}`}
                >
                  <AppText
                    className={`text-xs font-medium ${item.status === "PUBLISHED" ? "text-success" : "text-muted-foreground"}`}
                  >
                    {item.status}
                  </AppText>
                </View>
              </View>
              {item.tagline && <AppText className="mt-1 text-sm text-muted-foreground">{item.tagline}</AppText>}
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
