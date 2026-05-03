import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Txt } from "@/components/Typography";
import { Badge, Card, EmptyState } from "@/components/ui";
import { POSTS } from "@/constants/fixtures";
import { useColors } from "@/hooks/useColors";

const REPLIES: Record<string, { author: string; body: string; daysAgo: number }[]> = {
  c1: [
    { author: "Priya", body: "Switched mid-plan last year. The LAC needed a quick chat but it was straightforward.", daysAgo: 1 },
    { author: "Marcus", body: "Keep good records. I use a simple spreadsheet for invoices.", daysAgo: 1 },
  ],
  c2: [
    { author: "Hannah", body: "We use a 5kg bamboo cover one for summer — much cooler.", daysAgo: 3 },
  ],
};

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const post = POSTS.find((p) => p.id === id);

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
        <EmptyState icon="alert-circle" title="Discussion not found" />
      </SafeAreaView>
    );
  }

  const replies = REPLIES[post.id] ?? [];

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 80 }}>
        <Card style={{ gap: 10 }}>
          <Badge label={post.topic} />
          <Txt variant="display">{post.title}</Txt>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Feather name="user" size={14} color={c.mutedForeground} />
            <Txt variant="caption" color={c.mutedForeground}>
              {post.author} · {post.authorRole} · {post.postedDaysAgo}d ago
            </Txt>
          </View>
          <Txt variant="body">{post.body}</Txt>
        </Card>

        <Txt variant="heading" style={{ paddingHorizontal: 4 }}>
          Replies ({post.replyCount})
        </Txt>

        {replies.map((r, i) => (
          <Card key={i} style={{ gap: 6 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Txt variant="subheading">{r.author}</Txt>
              <Txt variant="caption" color={c.mutedForeground}>
                {r.daysAgo}d ago
              </Txt>
            </View>
            <Txt variant="body">{r.body}</Txt>
          </Card>
        ))}

        <Card style={{ alignItems: "center", gap: 4 }}>
          <Feather name="lock" size={20} color={c.mutedForeground} />
          <Txt variant="caption" color={c.mutedForeground}>
            Replies are coming to mobile soon. Use the website to join in.
          </Txt>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
