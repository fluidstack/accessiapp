import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AccessibilityInfo } from "react-native";

type AccessibilityState = {
  highContrast: boolean;
  reduceMotion: boolean;
  fontScale: number;
  setHighContrast: (v: boolean) => void;
  setFontScale: (v: number) => void;
};

export const AccessibilityContext = createContext<AccessibilityState | null>(
  null,
);

const STORAGE_KEY = "accessilife.a11y.v1";

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [highContrast, setHC] = useState(false);
  const [fontScale, setFS] = useState(1);
  const [reduceMotion, setRM] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed.highContrast === "boolean")
          setHC(parsed.highContrast);
        if (typeof parsed.fontScale === "number") setFS(parsed.fontScale);
      } catch {}
    });
    AccessibilityInfo.isReduceMotionEnabled().then(setRM).catch(() => {});
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setRM,
    );
    return () => sub?.remove();
  }, []);

  const setHighContrast = useCallback(
    (v: boolean) => {
      setHC(v);
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ highContrast: v, fontScale }),
      );
    },
    [fontScale],
  );

  const setFontScale = useCallback(
    (v: number) => {
      const clamped = Math.max(0.85, Math.min(1.5, v));
      setFS(clamped);
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ highContrast, fontScale: clamped }),
      );
    },
    [highContrast],
  );

  const value = useMemo(
    () => ({
      highContrast,
      reduceMotion,
      fontScale,
      setHighContrast,
      setFontScale,
    }),
    [highContrast, reduceMotion, fontScale, setHighContrast, setFontScale],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityState {
  const ctx = React.useContext(AccessibilityContext);
  if (!ctx)
    return {
      highContrast: false,
      reduceMotion: false,
      fontScale: 1,
      setHighContrast: () => {},
      setFontScale: () => {},
    };
  return ctx;
}
