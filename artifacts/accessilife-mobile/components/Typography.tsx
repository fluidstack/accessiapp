import React from "react";
import { Text, type TextProps, type TextStyle } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useAccessibility } from "@/lib/accessibility";

type Variant =
  | "display"
  | "title"
  | "heading"
  | "subheading"
  | "body"
  | "caption"
  | "label";

const VARIANTS: Record<Variant, TextStyle> = {
  display: { fontFamily: "Fraunces_600SemiBold", fontSize: 32, lineHeight: 38 },
  title: { fontFamily: "Fraunces_600SemiBold", fontSize: 24, lineHeight: 30 },
  heading: { fontFamily: "Fraunces_500Medium", fontSize: 20, lineHeight: 26 },
  subheading: { fontFamily: "Inter_600SemiBold", fontSize: 16, lineHeight: 22 },
  body: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: "Inter_500Medium", fontSize: 12, lineHeight: 16 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 13, lineHeight: 18 },
};

export function Txt({
  variant = "body",
  style,
  color,
  ...rest
}: TextProps & { variant?: Variant; color?: string }) {
  const colors = useColors();
  const { fontScale } = useAccessibility();
  const base = VARIANTS[variant];
  const scaled: TextStyle = {
    ...base,
    fontSize: (base.fontSize ?? 15) * fontScale,
    lineHeight: (base.lineHeight ?? 22) * fontScale,
    color: color ?? colors.foreground,
  };
  return <Text {...rest} style={[scaled, style]} allowFontScaling />;
}
