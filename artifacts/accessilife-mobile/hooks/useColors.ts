import { useContext } from "react";
import colors from "@/constants/colors";
import { AccessibilityContext } from "@/lib/accessibility";

export function useColors() {
  const ctx = useContext(AccessibilityContext);
  return ctx?.highContrast ? colors.highContrast : colors.light;
}
