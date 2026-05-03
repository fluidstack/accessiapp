import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Txt } from "@/components/Typography";
import {
  Badge,
  Card,
  Chip,
  EmptyState,
  ScreenHeader,
  SearchBar,
} from "@/components/ui";
import { LISTINGS } from "@/constants/fixtures";
import { useColors } from "@/hooks/useColors";

const CATEGORIES = ["Equipment", "Mobility", "Sensory", "Daily living"] as const;

export default function MarketplaceScreen() {
  const c = useColors();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const results = useMemo(() => {
    return LISTINGS.filter((l) => {
      if (cat && l.category !== cat) return false;
      if (
        query &&
        !`${l.title} ${l.description} ${l.suburb}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [query, cat]);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.background }}>
      <ScreenHeader
        title="Marketplace"
        subtitle="Member-to-member assistive tech and equipment."
      />
      <View style={{ paddingHorizontal: 20 }}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search listings"
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        <Chip label="All" selected={!cat} onPress={() => setCat(null)} />
        {CATEGORIES.map((k) => (
          <Chip
            key={k}
            label={k}
            selected={cat === k}
            onPress={() => setCat(k === cat ? null : k)}
          />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 12 }}>
        {results.length === 0 ? (
          <EmptyState
            icon="package"
            title="Nothing matches"
            description="Try a broader search or check back tomorrow."
          />
        ) : (
          results.map((l) => (
            <Pressable
              key={l.id}
              onPress={() => router.push(`/listing/${l.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`${l.title}, $${l.price} in ${l.suburb}`}
            >
              <Card style={{ gap: 6 }}>
                <View style={styles.row}>
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      backgroundColor: c.sageMist,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Feather name="box" size={26} color={c.sageDark} />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <Badge label={l.category} />
                      <Badge label={l.condition} tone="muted" />
                    </View>
                    <Txt variant="subheading">{l.title}</Txt>
                    <Txt variant="caption" color={c.mutedForeground}>
                      {l.suburb}, {l.state} · {l.postedDaysAgo}d ago
                    </Txt>
                  </View>
                  <Txt variant="heading" color={c.primary}>
                    ${l.price}
                  </Txt>
                </View>
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chipRow: { paddingHorizontal: 20, gap: 8, paddingTop: 12 },
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
});
