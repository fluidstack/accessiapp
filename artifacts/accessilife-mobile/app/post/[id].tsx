import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Txt } from "@/components/Typography";
import { Badge, Card, EmptyState, Field, Input } from "@/components/ui";
import { POSTS } from "@/constants/fixtures";
import { useColors } from "@/hooks/useColors";
import { localReplies } from "@/lib/storage";

const SEED_REPLIES: Record<string, { author: string; body: string; daysAgo: number }[]> = {
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
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState(false);
  const [extraReplies, setExtraReplies] = useState<
    { id: string; body: string; postedAt: string }[]
  >([]);
  const [submitting, setSubmitting] = useState(false);

  const post = POSTS.find((p) => p.id === id);

  useEffect(() => {
    if (id) localReplies.listFor(id).then(setExtraReplies);
  }, [id]);

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
        <EmptyState icon="alert-circle" title="Discussion not found" />
      </SafeAreaView>
    );
  }

  const seeded = SEED_REPLIES[post.id] ?? [];

  const submitReply = async () => {
    if (!draft.trim()) return;
    setSubmitting(true);
    await localReplies.add(post.id, draft.trim());
    setDraft("");
    const refreshed = await localReplies.listFor(post.id);
    setExtraReplies(refreshed);
    setSubmitting(false);
  };

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
      >
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
          <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
            <Button
              label={liked ? "Liked" : "Like"}
              variant={liked ? "secondary" : "outline"}
              onPress={() => setLiked((v) => !v)}
              leadingIcon={
                <Feather
                  name="heart"
                  size={16}
                  color={liked ? c.accent : c.foreground}
                />
              }
            />
          </View>
        </Card>

        <Txt variant="heading" style={{ paddingHorizontal: 4 }}>
          Replies ({post.replyCount + extraReplies.length})
        </Txt>

        {seeded.map((r, i) => (
          <Card key={`s-${i}`} style={{ gap: 6 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Txt variant="subheading">{r.author}</Txt>
              <Txt variant="caption" color={c.mutedForeground}>
                {r.daysAgo}d ago
              </Txt>
            </View>
            <Txt variant="body">{r.body}</Txt>
          </Card>
        ))}

        {extraReplies.map((r) => (
          <Card key={r.id} style={{ gap: 6 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Txt variant="subheading">You</Txt>
              <Txt variant="caption" color={c.mutedForeground}>
                just now
              </Txt>
            </View>
            <Txt variant="body">{r.body}</Txt>
          </Card>
        ))}

        <Card style={{ gap: 10 }}>
          <Field label="Add a reply">
            <Input
              value={draft}
              onChangeText={setDraft}
              placeholder="Be kind and specific."
              multiline
              style={{ minHeight: 96, textAlignVertical: "top" }}
            />
          </Field>
          <Button
            label="Post reply"
            onPress={submitReply}
            loading={submitting}
            disabled={!draft.trim()}
            fullWidth
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
