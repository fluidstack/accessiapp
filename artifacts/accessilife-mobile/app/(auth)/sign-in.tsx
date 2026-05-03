import { useSignIn, useSSO } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Txt } from "@/components/Typography";
import { Field, Input } from "@/components/ui";
import { useColors } from "@/hooks/useColors";

WebBrowser.maybeCompleteAuthSession();

function useWarmUpBrowser() {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

export default function SignInScreen() {
  useWarmUpBrowser();
  const c = useColors();
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const { error } = await signIn.password({ emailAddress: email, password });
    if (error) return;
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: () => router.replace("/(tabs)"),
      });
    }
  };

  const oauth = useCallback(
    async (strategy: "oauth_google" | "oauth_apple") => {
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri(),
        });
        if (createdSessionId && setActive) {
          await setActive({
            session: createdSessionId,
            navigate: async () => router.replace("/(tabs)"),
          });
        }
      } catch (err) {
        console.error(JSON.stringify(err, null, 2));
      }
    },
    [startSSOFlow, router],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandRow}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            contentFit="cover"
          />
          <View>
            <Txt variant="title">Accessilife</Txt>
            <Txt variant="caption" color={c.mutedForeground}>
              NDIS directory & community
            </Txt>
          </View>
        </View>

        <View style={{ marginTop: 24, gap: 6 }}>
          <Txt variant="display">Welcome back</Txt>
          <Txt variant="body" color={c.mutedForeground}>
            Sign in to keep finding supports that suit you.
          </Txt>
        </View>

        <View style={{ marginTop: 28, gap: 16 }}>
          <Field
            label="Email"
            error={errors?.fields?.identifier?.message}
          >
            <Input
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="you@example.com"
              accessibilityLabel="Email address"
            />
          </Field>
          <Field
            label="Password"
            error={errors?.fields?.password?.message}
          >
            <Input
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="current-password"
              placeholder="••••••••"
              accessibilityLabel="Password"
            />
          </Field>
          <Button
            label="Sign in"
            onPress={handleSubmit}
            loading={fetchStatus === "fetching"}
            disabled={!email || !password}
            fullWidth
          />
        </View>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: c.border }]} />
          <Txt variant="caption" color={c.mutedForeground}>
            or continue with
          </Txt>
          <View style={[styles.dividerLine, { backgroundColor: c.border }]} />
        </View>

        <View style={{ gap: 12 }}>
          <Button
            label="Continue with Google"
            variant="outline"
            onPress={() => oauth("oauth_google")}
            leadingIcon={<Feather name="globe" size={18} color={c.foreground} />}
            fullWidth
          />
          {Platform.OS === "ios" && (
            <Button
              label="Continue with Apple"
              variant="outline"
              onPress={() => oauth("oauth_apple")}
              leadingIcon={
                <Feather name="smartphone" size={18} color={c.foreground} />
              }
              fullWidth
            />
          )}
        </View>

        <View style={styles.footer}>
          <Txt variant="body" color={c.mutedForeground}>
            New to Accessilife?{" "}
          </Txt>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable accessibilityRole="link">
              <Txt variant="subheading" color={c.primary}>
                Create an account
              </Txt>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 24, paddingBottom: 48, gap: 8 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 48, height: 48, borderRadius: 12 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
});
