import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Txt } from "@/components/Typography";
import { Card, Chip, Field, Input } from "@/components/ui";
import { useColors } from "@/hooks/useColors";
import { localPosts } from "@/lib/storage";

const TOPICS = [
  "Plan management",
  "Allied health",
  "Sensory tools",
  "Travel",
  "General",
];

export default function NewPostScreen() {
  const c = useColors();
  const router = useRouter();
  const [topic, setTopic] = useState("General");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    await localPosts.add({ topic, title: title.trim(), body: body.trim() });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 14 }}
        keyboardShouldPersistTaps="handled"
      >
        <Txt variant="display">Start a discussion</Txt>
        <Txt variant="body" color={c.mutedForeground}>
          Share a question, recommendation or experience with the community.
        </Txt>

        <Card style={{ gap: 14 }}>
          <Field label="Topic">
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {TOPICS.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  selected={topic === t}
                  onPress={() => setTopic(t)}
                />
              ))}
            </View>
          </Field>
          <Field label="Title">
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="A short, clear title"
              maxLength={120}
            />
          </Field>
          <Field label="Your post" hint="Be kind, be specific. Avoid sharing personal info.">
            <Input
              value={body}
              onChangeText={setBody}
              placeholder="What's on your mind?"
              multiline
              style={{ minHeight: 160, textAlignVertical: "top" }}
            />
          </Field>
          <Button
            label="Post to community"
            onPress={submit}
            loading={submitting}
            disabled={!title.trim() || !body.trim()}
            fullWidth
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
