import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Txt } from "@/components/Typography";
import { Card, EmptyState, Field, Input } from "@/components/ui";
import { PROVIDERS } from "@/constants/fixtures";
import { useColors } from "@/hooks/useColors";
import { enquiries } from "@/lib/storage";

const RATE_LIMIT = 5;

export default function EnquiryScreen() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const router = useRouter();
  const c = useColors();
  const provider = PROVIDERS.find((p) => p.id === providerId);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [recentCount, setRecentCount] = useState(0);

  useEffect(() => {
    enquiries.recordCount().then(setRecentCount);
  }, []);

  if (!provider) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
        <EmptyState icon="alert-circle" title="Provider not found" />
      </SafeAreaView>
    );
  }

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      // Honeypot: if filled, silently succeed (do nothing).
      if (honeypot) {
        setSent(true);
        return;
      }
      // Soft rate limit per docs: silent success after limit.
      if (recentCount >= RATE_LIMIT) {
        setSent(true);
        return;
      }
      await new Promise((r) => setTimeout(r, 600));
      await enquiries.add(provider.id);
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
        <View style={styles.successWrap}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: c.sageMist,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Feather name="check" size={32} color={c.sageDark} />
          </View>
          <Txt variant="display" style={{ textAlign: "center" }}>
            Enquiry sent
          </Txt>
          <Txt
            variant="body"
            color={c.mutedForeground}
            style={{ textAlign: "center", marginTop: 6 }}
          >
            {provider.name} will be in touch via email. Most providers reply within
            two business days.
          </Txt>
          <Button
            label="Done"
            onPress={() => router.back()}
            style={{ marginTop: 24, alignSelf: "stretch" }}
            fullWidth
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={{ gap: 6 }}>
          <Txt variant="caption" color={c.mutedForeground}>
            Enquire about
          </Txt>
          <Txt variant="title">{provider.name}</Txt>
          <Txt variant="caption" color={c.mutedForeground}>
            {provider.suburb}, {provider.state}
          </Txt>
        </Card>

        <Card style={{ gap: 14 }}>
          <Field label="Your name">
            <Input value={name} onChangeText={setName} placeholder="First name" />
          </Field>
          <Field label="Email" hint="So the provider can reply directly.">
            <Input
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Your message">
            <Input
              value={message}
              onChangeText={setMessage}
              placeholder="Tell them about your supports and what you're hoping to find."
              multiline
              style={{ minHeight: 120, textAlignVertical: "top" }}
            />
          </Field>

          {/* Honeypot — visually hidden but accessible to bots */}
          <View style={{ height: 0, overflow: "hidden" }} aria-hidden>
            <Input
              value={honeypot}
              onChangeText={setHoneypot}
              autoComplete="off"
              importantForAutofill="no"
            />
          </View>

          <Button
            label="Send enquiry"
            onPress={submit}
            loading={submitting}
            disabled={!name || !email || !message}
            fullWidth
          />
          <Txt variant="caption" color={c.mutedForeground}>
            We share your name, email and message with this provider only.
          </Txt>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  successWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
});
