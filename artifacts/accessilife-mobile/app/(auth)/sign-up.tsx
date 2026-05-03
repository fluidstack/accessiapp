import { useSignUp, useSSO } from "@clerk/expo";
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
  Switch,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Txt } from "@/components/Typography";
import { Field, Input } from "@/components/ui";
import { useColors } from "@/hooks/useColors";
import { getOrCreateConsentUuid, recordConsent } from "@/lib/storage";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const c = useColors();
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [communications, setCommunications] = useState(false);

  useEffect(() => {
    if (Platform.OS === "android") {
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }
  }, []);

  const handleSubmit = async () => {
    if (!accepted) return;
    const { error } = await signUp.password({
      emailAddress: email,
      password,
    });
    if (error) return;
    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === "complete") {
      const uuid = await getOrCreateConsentUuid();
      await recordConsent(uuid);
      await signUp.finalize({
        navigate: () => router.replace("/(tabs)"),
      });
    }
  };

  const oauth = useCallback(
    async (
      strategy: "oauth_google" | "oauth_apple" | "oauth_github" | "oauth_x",
    ) => {
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri(),
        });
        if (createdSessionId && setActive) {
          const uuid = await getOrCreateConsentUuid();
          await recordConsent(uuid);
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

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields?.includes("email_address")
  ) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={{ gap: 6 }}>
            <Txt variant="display">Check your inbox</Txt>
            <Txt variant="body" color={c.mutedForeground}>
              We've sent a 6-digit code to {email}.
            </Txt>
          </View>
          <View style={{ marginTop: 24, gap: 16 }}>
            <Field
              label="Verification code"
              error={errors?.fields?.code?.message}
            >
              <Input
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
                placeholder="123456"
                maxLength={6}
                accessibilityLabel="Verification code"
              />
            </Field>
            <Button
              label="Verify and continue"
              onPress={handleVerify}
              loading={fetchStatus === "fetching"}
              disabled={code.length < 6}
              fullWidth
            />
            <Pressable
              onPress={() => signUp.verifications.sendEmailCode()}
              accessibilityRole="button"
              style={{ alignSelf: "center", padding: 8 }}
            >
              <Txt variant="subheading" color={c.primary}>
                Send a new code
              </Txt>
            </Pressable>
          </View>
          <View nativeID="clerk-captcha" />
        </ScrollView>
      </SafeAreaView>
    );
  }

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
          <Txt variant="title">Accessilife</Txt>
        </View>

        <View style={{ marginTop: 24, gap: 6 }}>
          <Txt variant="display">Create your account</Txt>
          <Txt variant="body" color={c.mutedForeground}>
            Free to join. Member access only — providers manage listings on the web.
          </Txt>
        </View>

        <View style={{ marginTop: 28, gap: 16 }}>
          <Field label="Email" error={errors?.fields?.emailAddress?.message}>
            <Input
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </Field>
          <Field
            label="Password"
            hint="Use at least 8 characters."
            error={errors?.fields?.password?.message}
          >
            <Input
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </Field>

          <View style={[styles.consentRow, { borderColor: c.border }]}>
            <Switch
              value={accepted}
              onValueChange={setAccepted}
              accessibilityLabel="I agree to the Terms and Privacy Policy"
            />
            <Txt variant="body" style={{ flex: 1 }}>
              I agree to the Terms of Service, Privacy Policy and Community Guidelines.
            </Txt>
          </View>

          <View style={[styles.consentRow, { borderColor: c.border }]}>
            <Switch
              value={communications}
              onValueChange={setCommunications}
              accessibilityLabel="Send me occasional community updates"
            />
            <Txt variant="body" style={{ flex: 1 }}>
              Send me occasional community updates (optional).
            </Txt>
          </View>

          <Button
            label="Create account"
            onPress={handleSubmit}
            loading={fetchStatus === "fetching"}
            disabled={!email || !password || !accepted}
            fullWidth
          />
          <View nativeID="clerk-captcha" />
        </View>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: c.border }]} />
          <Txt variant="caption" color={c.mutedForeground}>
            or sign up with
          </Txt>
          <View style={[styles.dividerLine, { backgroundColor: c.border }]} />
        </View>

        <View style={{ gap: 12 }}>
          <Button
            label="Continue with Google"
            variant="outline"
            onPress={() => oauth("oauth_google")}
            leadingIcon={<Feather name="globe" size={18} color={c.foreground} />}
            disabled={!accepted}
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
              disabled={!accepted}
              fullWidth
            />
          )}
          <Button
            label="Continue with GitHub"
            variant="outline"
            onPress={() => oauth("oauth_github")}
            leadingIcon={<Feather name="github" size={18} color={c.foreground} />}
            disabled={!accepted}
            fullWidth
          />
          <Button
            label="Continue with X"
            variant="outline"
            onPress={() => oauth("oauth_x")}
            leadingIcon={<Feather name="twitter" size={18} color={c.foreground} />}
            disabled={!accepted}
            fullWidth
          />
        </View>

        <View style={styles.footer}>
          <Txt variant="body" color={c.mutedForeground}>
            Already with us?{" "}
          </Txt>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable accessibilityRole="link">
              <Txt variant="subheading" color={c.primary}>
                Sign in
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
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
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
