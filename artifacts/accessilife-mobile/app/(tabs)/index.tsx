import { useUser } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Txt } from "@/components/Typography";
import { Badge, Card, ScreenHeader, StarRating } from "@/components/ui";
import { EVENTS, POSTS, PROVIDERS } from "@/constants/fixtures";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const c = useColors();
  const router = useRouter();
  const { user } = useUser();
  const firstName =
    user?.firstName ?? user?.primaryEmailAddress?.emailAddress?.split("@")[0] ?? "there";

  const featured = PROVIDERS.slice(0, 3);
  const upcoming = EVENTS.slice(0, 2);
  const trending = POSTS.slice(0, 2);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ScreenHeader title={`G'day, ${firstName}`} subtitle="Find supports that suit your plan." />

        <View style={{ paddingHorizontal: 20 }}>
          <Pressable
            onPress={() => router.push("/(tabs)/directory")}
            accessibilityRole="button"
            accessibilityLabel="Browse the directory"
            style={[styles.hero, { borderColor: c.border }]}
          >
            <Image
              source={require("@/assets/images/hero.png")}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
            <View style={[StyleSheet.absoluteFill, styles.heroOverlay]} />
            <View style={styles.heroContent}>
              <Badge label="New this week" tone="accent" />
              <Txt variant="title" color="#ffffff" style={{ marginTop: 8 }}>
                Trusted NDIS supports, in plain English.
              </Txt>
              <Txt variant="body" color="#f7efd9" style={{ marginTop: 4 }}>
                Browse providers, marketplace finds, events and community.
              </Txt>
            </View>
          </Pressable>
        </View>

        <Section
          title="Featured providers"
          actionLabel="See all"
          onAction={() => router.push("/(tabs)/directory")}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {featured.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => router.push(`/provider/${p.id}`)}
                accessibilityRole="button"
              >
                <Card style={{ width: 260, gap: 8 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Badge label={p.category} />
                    <StarRating value={p.rating} />
                  </View>
                  <Txt variant="heading">{p.name}</Txt>
                  <Txt variant="caption" color={c.mutedForeground}>
                    {p.suburb}, {p.state}
                  </Txt>
                  <Txt variant="body" numberOfLines={2}>
                    {p.blurb}
                  </Txt>
                  {p.ndisRegistered && (
                    <View style={{ marginTop: 4 }}>
                      <Badge label="NDIS registered" tone="accent" />
                    </View>
                  )}
                </Card>
              </Pressable>
            ))}
          </ScrollView>
        </Section>

        <Section
          title="Upcoming events"
          actionLabel="See all"
          onAction={() => router.push("/(tabs)/events")}
        >
          <View style={{ paddingHorizontal: 20, gap: 12 }}>
            {upcoming.map((e) => (
              <Pressable
                key={e.id}
                onPress={() => router.push(`/event/${e.id}`)}
                accessibilityRole="button"
              >
                <Card>
                  <View style={styles.row}>
                    <View
                      style={[
                        styles.dateChip,
                        { backgroundColor: c.sageMist },
                      ]}
                    >
                      <Feather name="calendar" size={18} color={c.sageDark} />
                    </View>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Txt variant="caption" color={c.mutedForeground}>
                        {e.date} · {e.startTime}
                      </Txt>
                      <Txt variant="subheading">{e.title}</Txt>
                      <Txt variant="caption" color={c.mutedForeground}>
                        {e.suburb} · {e.format}
                      </Txt>
                    </View>
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        </Section>

        <Section
          title="From the community"
          actionLabel="Open"
          onAction={() => router.push("/(tabs)/community")}
        >
          <View style={{ paddingHorizontal: 20, gap: 12 }}>
            {trending.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => router.push(`/post/${p.id}`)}
                accessibilityRole="button"
              >
                <Card style={{ gap: 6 }}>
                  <Badge label={p.topic} />
                  <Txt variant="subheading">{p.title}</Txt>
                  <Txt variant="body" color={c.mutedForeground} numberOfLines={2}>
                    {p.excerpt}
                  </Txt>
                  <View style={[styles.row, { marginTop: 6 }]}>
                    <Feather name="message-square" size={14} color={c.mutedForeground} />
                    <Txt variant="caption" color={c.mutedForeground}>
                      {p.replyCount} replies · {p.author}
                    </Txt>
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  const c = useColors();
  return (
    <View style={{ marginTop: 28 }}>
      <View style={styles.sectionHeader}>
        <Txt variant="heading">{title}</Txt>
        {actionLabel && onAction ? (
          <Pressable onPress={onAction} hitSlop={10} accessibilityRole="link">
            <Txt variant="label" color={c.primary}>
              {actionLabel}
            </Txt>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 180,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    justifyContent: "flex-end",
  },
  heroOverlay: {
    backgroundColor: "rgba(45,58,42,0.55)",
  },
  heroContent: { padding: 20 },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  dateChip: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
