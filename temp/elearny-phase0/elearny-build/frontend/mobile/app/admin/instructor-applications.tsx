import { useEffect, useState } from "react";
import { FlatList, Pressable, TextInput, View } from "react-native";
import { AppText } from "@/components/AppText";
import { AppHeading } from "@/components/AppHeading";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
  ApiRequestError,
  InstructorApplicationResponse,
  approveApplication,
  listPendingApplications,
  rejectApplication,
} from "@/lib/api";

export default function AdminInstructorApplicationsScreen() {
  const authChecked = useRequireAuth();
  const [applications, setApplications] = useState<InstructorApplicationResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [rejectReasonById, setRejectReasonById] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authChecked) return;
    listPendingApplications()
      .then(setApplications)
      .catch((err) => {
        if (err instanceof ApiRequestError) {
          setError(err.status === 403 ? "You don't have admin access." : err.apiError?.message ?? "Failed to load.");
        }
      });
  }, [authChecked]);

  async function handleApprove(id: string) {
    setActioningId(id);
    try {
      await approveApplication(id);
      setApplications((prev) => prev?.filter((a) => a.id !== id) ?? null);
    } catch (err) {
      if (err instanceof ApiRequestError) setError(err.apiError?.message ?? "Approve failed.");
    } finally {
      setActioningId(null);
    }
  }

  async function handleReject(id: string) {
    const reason = rejectReasonById[id]?.trim();
    if (!reason) {
      setError("A rejection reason is required.");
      return;
    }
    setActioningId(id);
    try {
      await rejectApplication(id, reason);
      setApplications((prev) => prev?.filter((a) => a.id !== id) ?? null);
    } catch (err) {
      if (err instanceof ApiRequestError) setError(err.apiError?.message ?? "Reject failed.");
    } finally {
      setActioningId(null);
    }
  }

  if (!authChecked) return null;

  return (
    <View className="flex-1 bg-background px-5 pt-14">
      <AppHeading className="text-2xl text-foreground">Instructor applications</AppHeading>
      <AppText className="mt-1 text-sm text-muted-foreground">Pending review</AppText>

      {error && (
        <View className="mt-4 rounded border border-destructive bg-destructive/10 px-3 py-2">
          <AppText className="text-sm text-destructive">{error}</AppText>
        </View>
      )}

      {applications === null && <AppText className="mt-6 text-muted-foreground">Loading…</AppText>}
      {applications?.length === 0 && <AppText className="mt-6 text-muted-foreground">No pending applications.</AppText>}

      <FlatList
        data={applications ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-4 py-4"
        renderItem={({ item }) => (
          <View className="rounded border border-border p-4">
            <View className="flex-row items-baseline justify-between">
              <AppText className="font-medium text-foreground">
                {item.applicantFirstName} {item.applicantLastName}
              </AppText>
              <AppText className="text-sm text-muted-foreground">{item.applicantEmail}</AppText>
            </View>
            <AppText className="mt-2 text-sm text-foreground">{item.bio}</AppText>
            <AppText className="mt-1 text-sm text-muted-foreground">
              {item.yearsExperience} years · {item.expertiseTags}
            </AppText>

            <View className="mt-3 flex-row items-center gap-2">
              <Pressable
                onPress={() => handleApprove(item.id)}
                disabled={actioningId === item.id}
                className="rounded bg-success px-3 py-1.5"
              >
                <AppText className="text-sm font-medium text-white">Approve</AppText>
              </Pressable>
              <TextInput
                placeholder="Rejection reason"
                className="flex-1 rounded border border-border bg-background px-2 py-1.5 font-sans text-sm text-foreground"
                value={rejectReasonById[item.id] ?? ""}
                onChangeText={(v) => setRejectReasonById((prev) => ({ ...prev, [item.id]: v }))}
              />
              <Pressable
                onPress={() => handleReject(item.id)}
                disabled={actioningId === item.id}
                className="rounded border border-destructive px-3 py-1.5"
              >
                <AppText className="text-sm font-medium text-destructive">Reject</AppText>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
