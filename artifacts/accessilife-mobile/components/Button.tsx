import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type ViewStyle,
} from "react-native";
import { Txt } from "@/components/Typography";
import colors from "@/constants/colors";
import { useColors } from "@/hooks/useColors";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "destructive";

type Props = Omit<PressableProps, "children" | "style"> & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  style?: ViewStyle;
};

export function Button({
  label,
  variant = "primary",
  loading,
  disabled,
  fullWidth,
  leadingIcon,
  onPress,
  style,
  ...rest
}: Props) {
  const c = useColors();

  const palette: Record<Variant, { bg: string; fg: string; border: string }> = {
    primary: { bg: c.primary, fg: c.primaryForeground, border: c.primary },
    secondary: { bg: c.secondary, fg: c.secondaryForeground, border: c.secondary },
    ghost: { bg: "transparent", fg: c.primary, border: "transparent" },
    outline: { bg: "transparent", fg: c.foreground, border: c.border },
    destructive: { bg: c.destructive, fg: c.destructiveForeground, border: c.destructive },
  };

  const p = palette[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      onPress={(e) => {
        if (disabled || loading) return;
        Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: p.bg,
          borderColor: p.border,
          borderRadius: colors.radius,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
          alignSelf: fullWidth ? "stretch" : "auto",
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <View style={styles.row}>
          {leadingIcon}
          <Txt variant="subheading" color={p.fg}>
            {label}
          </Txt>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
});
