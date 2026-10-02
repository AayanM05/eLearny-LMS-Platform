import { Check } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { AppText } from "@/components/AppText";

export function Checkbox({
  checked,
  onOpenPolicy,
  label,
}: {
  checked: boolean;
  onOpenPolicy: () => void;
  label: string;
}) {
  return (
    <Pressable onPress={onOpenPolicy} className="flex-row items-start gap-2">
      <View
        className={`mt-0.5 h-5 w-5 items-center justify-center rounded border ${
          checked ? "border-primary bg-primary" : "border-border bg-background"
        }`}
      >
        {checked && <Check size={14} color="white" strokeWidth={3} />}
        {/* lucide-react-native icons take a direct color prop, not a
            NativeWind className, so this can't reference --color-primary-
            foreground the way the JSX styling elsewhere does. Matches its
            current value (white) — update both together if that token
            value ever changes. */}
      </View>
      <AppText className="flex-1 text-sm text-foreground">{label}</AppText>
    </Pressable>
  );
}
