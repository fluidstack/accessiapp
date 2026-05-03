import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewProps,
} from "react-native";
import { Txt } from "@/components/Typography";
import colors from "@/constants/colors";
import { useColors } from "@/hooks/useColors";

export function Card({
  children,
  style,
  ...rest
}: ViewProps & { children: React.ReactNode }) {
  const c = useColors();
  return (
    <View
      style={[
        {
          backgroundColor: c.card,
          borderColor: c.border,
          borderWidth: 1,
          borderRadius: colors.radius,
          padding: 16,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

export function Badge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "accent" | "muted";
}) {
  const c = useColors();
  const tones = {
    neutral: { bg: c.sageMist, fg: c.sageDark },
    success: { bg: c.sageMist, fg: c.sageDark },
    accent: { bg: c.accentSoft, fg: c.accent },
    muted: { bg: c.muted, fg: c.mutedForeground },
  };
  const t = tones[tone];
  return (
    <View
      style={{
        backgroundColor: t.bg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        alignSelf: "flex-start",
      }}
    >
      <Txt variant="caption" color={t.fg}>
        {label}
      </Txt>
    </View>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const c = useColors();
  return (
    <View style={{ gap: 6 }}>
      <Txt variant="label" color={c.foreground}>
        {label}
      </Txt>
      {children}
      {hint && !error ? (
        <Txt variant="caption" color={c.mutedForeground}>
          {hint}
        </Txt>
      ) : null}
      {error ? (
        <Txt variant="caption" color={c.destructive}>
          {error}
        </Txt>
      ) : null}
    </View>
  );
}

export function Input(props: TextInputProps) {
  const c = useColors();
  return (
    <TextInput
      placeholderTextColor={c.mutedForeground}
      {...props}
      style={[
        {
          borderWidth: 1,
          borderColor: c.border,
          backgroundColor: c.input,
          borderRadius: colors.radius,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontFamily: "Inter_400Regular",
          fontSize: 15,
          color: c.foreground,
          minHeight: 48,
        },
        props.style,
      ]}
    />
  );
}

export function SearchBar({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}) {
  const c = useColors();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: c.card,
        borderColor: c.border,
        borderWidth: 1,
        borderRadius: colors.radius,
        paddingHorizontal: 14,
        minHeight: 48,
      }}
    >
      <Feather name="search" size={18} color={c.mutedForeground} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.mutedForeground}
        style={{
          flex: 1,
          fontFamily: "Inter_400Regular",
          fontSize: 15,
          color: c.foreground,
          paddingVertical: 12,
        }}
        accessibilityLabel={placeholder}
      />
      {value ? (
        <Pressable
          onPress={() => onChangeText("")}
          accessibilityLabel="Clear search"
          hitSlop={10}
        >
          <Feather name="x-circle" size={18} color={c.mutedForeground} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={{
        backgroundColor: selected ? c.primary : c.card,
        borderColor: selected ? c.primary : c.border,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
      }}
    >
      <Txt
        variant="caption"
        color={selected ? c.primaryForeground : c.foreground}
      >
        {label}
      </Txt>
    </Pressable>
  );
}

export function Divider() {
  const c = useColors();
  return <View style={{ height: 1, backgroundColor: c.border, marginVertical: 12 }} />;
}

export function EmptyState({
  icon = "inbox",
  title,
  description,
}: {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  description?: string;
}) {
  const c = useColors();
  return (
    <View style={styles.empty}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: c.sageMist,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Feather name={icon} size={28} color={c.sageDark} />
      </View>
      <Txt variant="heading" style={{ textAlign: "center" }}>
        {title}
      </Txt>
      {description ? (
        <Txt
          variant="body"
          color={c.mutedForeground}
          style={{ textAlign: "center", marginTop: 6 }}
        >
          {description}
        </Txt>
      ) : null}
    </View>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  trailing,
}: {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  const c = useColors();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 14,
      }}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Txt variant="display">{title}</Txt>
        {subtitle ? (
          <Txt variant="body" color={c.mutedForeground}>
            {subtitle}
          </Txt>
        ) : null}
      </View>
      {trailing}
    </View>
  );
}

export function StarRating({
  value,
  size = 14,
}: {
  value: number;
  size?: number;
}) {
  const c = useColors();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Feather name="star" size={size} color={c.accent} />
      <Txt variant="caption" color={c.foreground}>
        {value.toFixed(1)}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
});
