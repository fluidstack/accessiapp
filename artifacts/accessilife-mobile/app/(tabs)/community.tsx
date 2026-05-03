import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Txt } from "@/components/Typography";
import { Badge, Card, Chip, ScreenHeader, SearchBar } from "@/components/ui";
import { POSTS } from "@/constants/fixtures";
import { useColors } from "@/hooks/useColors";
import { localPosts } from "@/lib/storage";

type FeedPost = {
  id: string;
  topic: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  postedDaysAgo: number;
  replyCount: number;
};

const TOPICS = [
  "All",
  "Plan management",
  "Allied health",
  "Sensory tools",
  "Travel",
];

export default function CommunityScreen() {
  const c = useColors();
  const router = useRouter();
  const [topic, setTopic] = useState("All");
  const [query, setQuery] = useState("");
  const [mine, setMine] = useState<FeedPost[]>([]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      localPosts.list().then((list) => {
        if (!alive) return;
        setMine(
          list.map((p) => ({
            id: p.id,
            topic: p.topic,
            title: p.title,
            excerpt: p.body.slice(0, 160),
            author: "You",
            authorRole: "Member",
            postedDaysAgo: 0,
            replyCount: 0,
          })),
        );
      });
      return () => {
        alive = false;
      };
    }, []),
  );

  const filtered = useMemo(() => {
    const all: FeedPost[] = [...mine, ...POSTS];
    return all.filter((p) => {
      if (topic !== "All" && p.topic !== topic) return false;
      if (
        query &&
        !`${p.title} ${p.excerpt}`.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [topic, query, mine]);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.background }}>
      <ScreenHeader
        title="Community"
        subtitle="Member discussions and stories."
        trailing={
          <Pressable
            onPress={() => router.push("/post/new")}
            accessibilityRole="button"
            accessibilityLabel="Start a new discussion"
            style={{
              backgroundColor: c.primary,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 999,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Feather name="plus" size={16} color={c.primaryForeground} />
            <Txt variant="label" color={c.primaryForeground}>
              New
            </Txt>
          </Pressable>
        }
      />
      <View style={{ paddingHorizontal: 20 }}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search threads" />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {TOPICS.map((t) => (
          <Chip key={t} label={t} selected={topic === t} onPress={() => setTopic(t)} />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 12 }}>
        {filtered.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => router.push(`/post/${p.id}`)}
            accessibilityRole="button"
            accessibilityLabel={p.title}
          >
            <Card style={{ gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Badge label={p.topic} />
                <Txt variant="caption" color={c.mutedForeground}>
                  {p.postedDaysAgo}d ago
                </Txt>
              </View>
              <Txt variant="subheading">{p.title}</Txt>
              <Txt variant="body" color={c.mutedForeground} numberOfLines={3}>
                {p.excerpt}
              </Txt>
              <View style={styles.row}>
                <Feather name="user" size={14} color={c.mutedForeground} />
                <Txt variant="caption" color={c.mutedForeground}>
                  {p.author} · {p.authorRole}
                </Txt>
                <View style={{ flex: 1 }} />
                <Feather name="message-square" size={14} color={c.mutedForeground} />
                <Txt variant="caption" color={c.mutedForeground}>
                  {p.replyCount}
                </Txt>
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chipRow: { paddingHorizontal: 20, gap: 8, paddingTop: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
});
