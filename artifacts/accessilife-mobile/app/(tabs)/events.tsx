import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Txt } from "@/components/Typography";
import { Badge, Card, Chip, ScreenHeader } from "@/components/ui";
import { EVENTS } from "@/constants/fixtures";
import { useColors } from "@/hooks/useColors";
import { rsvps } from "@/lib/storage";

export default function EventsScreen() {
  const c = useColors();
  const router = useRouter();
  const [filter, setFilter] = useState<"All" | "In person" | "Online">("All");
  const [rsvpIds, setRsvpIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    rsvps.list().then((arr) => setRsvpIds(new Set(arr)));
  }, []);

  const results = EVENTS.filter(
    (e) => filter === "All" || e.format === filter,
  );

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.background }}>
      <ScreenHeader title="Events" subtitle="Workshops, meetups, online sessions." />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {(["All", "In person", "Online"] as const).map((k) => (
          <Chip
            key={k}
            label={k}
            selected={filter === k}
            onPress={() => setFilter(k)}
          />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 12 }}>
        {results.map((e) => {
          const rsvped = rsvpIds.has(e.id);
          return (
            <Pressable
              key={e.id}
              onPress={() => router.push(`/event/${e.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`${e.title} on ${e.date} at ${e.startTime}`}
            >
              <Card style={{ gap: 10 }}>
                <View style={styles.row}>
                  <View
                    style={[
                      styles.dateBlock,
                      { backgroundColor: c.sageMist, borderColor: c.border },
                    ]}
                  >
                    <Txt variant="caption" color={c.sageDark}>
                      {e.date.split(" ")[0]}
                    </Txt>
                    <Txt variant="title" color={c.sageDark}>
                      {e.date.split(" ")[1]}
                    </Txt>
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <Badge label={e.format} />
                      {rsvped && <Badge label="Going" tone="accent" />}
                    </View>
                    <Txt variant="subheading">{e.title}</Txt>
                    <Txt variant="caption" color={c.mutedForeground}>
                      {e.startTime}–{e.endTime} · {e.suburb}
                    </Txt>
                    <View style={styles.metaRow}>
                      <Feather name="users" size={14} color={c.mutedForeground} />
                      <Txt variant="caption" color={c.mutedForeground}>
                        {e.attending} of {e.capacity} going
                      </Txt>
                    </View>
                  </View>
                </View>
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chipRow: { paddingHorizontal: 20, gap: 8, paddingTop: 12 },
  row: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  dateBlock: {
    width: 64,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
});
