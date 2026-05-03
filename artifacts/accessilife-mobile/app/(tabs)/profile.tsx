import { useAuth, useUser } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Txt } from "@/components/Typography";
import { Badge, Card, Divider, Field, Input, ScreenHeader } from "@/components/ui";
import { PROVIDERS, EVENTS } from "@/constants/fixtures";
import { useColors } from "@/hooks/useColors";
import { useAccessibility } from "@/lib/accessibility";
import { favourites, profile, rsvps } from "@/lib/storage";

export default function ProfileScreen() {
  const c = useColors();
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const { highContrast, fontScale, setHighContrast, setFontScale } =
    useAccessibility();

  const [displayName, setDisplayName] = useState("");
  const [suburb, setSuburb] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [bio, setBio] = useState("");
  const [favIds, setFavIds] = useState<string[]>([]);
  const [rsvpIds, setRsvpIds] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    profile.get().then((p) => {
      setDisplayName(p.displayName ?? user?.firstName ?? "");
      setSuburb(p.suburb ?? "");
      setStateCode(p.state ?? "");
      setBio(p.bio ?? "");
    });
    favourites.list().then(setFavIds);
    rsvps.list().then(setRsvpIds);
  }, [user]);

  const save = async () => {
    await profile.set({ displayName, suburb, state: stateCode, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const favProviders = PROVIDERS.filter((p) => favIds.includes(p.id));
  const rsvpEvents = EVENTS.filter((e) => rsvpIds.includes(e.id));

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <ScreenHeader
          title="Your space"
          subtitle={user?.primaryEmailAddress?.emailAddress ?? ""}
        />

        <View style={{ paddingHorizontal: 20, gap: 16 }}>
          <Card style={{ gap: 14 }}>
            <Txt variant="heading">Profile</Txt>
            <Field label="Display name">
              <Input
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="What should we call you?"
                accessibilityLabel="Display name"
              />
            </Field>
            <View style={styles.row}>
              <View style={{ flex: 2 }}>
                <Field label="Suburb">
                  <Input
                    value={suburb}
                    onChangeText={setSuburb}
                    placeholder="e.g. Newtown"
                  />
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label="State">
                  <Input
                    value={stateCode}
                    onChangeText={setStateCode}
                    placeholder="NSW"
                    autoCapitalize="characters"
                    maxLength={3}
                  />
                </Field>
              </View>
            </View>
            <Field label="About you" hint="Optional. Visible only to you in v1.">
              <Input
                value={bio}
                onChangeText={setBio}
                placeholder="A short note about your supports and goals."
                multiline
                style={{ minHeight: 96, textAlignVertical: "top" }}
              />
            </Field>
            <Button label={saved ? "Saved" : "Save profile"} onPress={save} />
          </Card>

          <Card style={{ gap: 12 }}>
            <Txt variant="heading">Accessibility</Txt>
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Txt variant="subheading">High contrast</Txt>
                <Txt variant="caption" color={c.mutedForeground}>
                  Stronger borders and darker text.
                </Txt>
              </View>
              <Switch
                value={highContrast}
                onValueChange={setHighContrast}
                accessibilityLabel="Toggle high contrast"
              />
            </View>
            <Divider />
            <View>
              <Txt variant="subheading">Text size</Txt>
              <Txt variant="caption" color={c.mutedForeground}>
                Currently {Math.round(fontScale * 100)}%
              </Txt>
              <View style={[styles.row, { marginTop: 12 }]}>
                {[
                  { l: "A", v: 0.9 },
                  { l: "A", v: 1 },
                  { l: "A", v: 1.15 },
                  { l: "A", v: 1.35 },
                ].map((opt, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => setFontScale(opt.v)}
                    accessibilityRole="button"
                    accessibilityLabel={`Text size ${Math.round(opt.v * 100)} percent`}
                    style={[
                      styles.sizePill,
                      {
                        backgroundColor:
                          Math.abs(fontScale - opt.v) < 0.02
                            ? c.primary
                            : c.card,
                        borderColor:
                          Math.abs(fontScale - opt.v) < 0.02
                            ? c.primary
                            : c.border,
                      },
                    ]}
                  >
                    <Txt
                      variant="subheading"
                      color={
                        Math.abs(fontScale - opt.v) < 0.02
                          ? c.primaryForeground
                          : c.foreground
                      }
                      style={{ fontSize: 12 + idx * 3 }}
                    >
                      {opt.l}
                    </Txt>
                  </Pressable>
                ))}
              </View>
            </View>
          </Card>

          <Card style={{ gap: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Txt variant="heading">Favourites</Txt>
              <Badge label={`${favProviders.length}`} tone="muted" />
            </View>
            {favProviders.length === 0 ? (
              <Txt variant="body" color={c.mutedForeground}>
                Tap the heart on a provider to save them here.
              </Txt>
            ) : (
              favProviders.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => router.push(`/provider/${p.id}`)}
                  accessibilityRole="button"
                  style={styles.listRow}
                >
                  <Feather name="heart" size={18} color={c.accent} />
                  <View style={{ flex: 1 }}>
                    <Txt variant="subheading">{p.name}</Txt>
                    <Txt variant="caption" color={c.mutedForeground}>
                      {p.suburb}, {p.state}
                    </Txt>
                  </View>
                  <Feather name="chevron-right" size={20} color={c.mutedForeground} />
                </Pressable>
              ))
            )}
          </Card>

          <Card style={{ gap: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Txt variant="heading">Your RSVPs</Txt>
              <Badge label={`${rsvpEvents.length}`} tone="muted" />
            </View>
            {rsvpEvents.length === 0 ? (
              <Txt variant="body" color={c.mutedForeground}>
                Events you RSVP to will appear here.
              </Txt>
            ) : (
              rsvpEvents.map((e) => (
                <Pressable
                  key={e.id}
                  onPress={() => router.push(`/event/${e.id}`)}
                  accessibilityRole="button"
                  style={styles.listRow}
                >
                  <Feather name="calendar" size={18} color={c.sageDark} />
                  <View style={{ flex: 1 }}>
                    <Txt variant="subheading">{e.title}</Txt>
                    <Txt variant="caption" color={c.mutedForeground}>
                      {e.date} · {e.startTime}
                    </Txt>
                  </View>
                  <Feather name="chevron-right" size={20} color={c.mutedForeground} />
                </Pressable>
              ))
            )}
          </Card>

          <Button
            label="Sign out"
            variant="outline"
            onPress={() => signOut()}
            leadingIcon={<Feather name="log-out" size={18} color={c.foreground} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, alignItems: "flex-end" },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  sizePill: {
    width: 56,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
});
