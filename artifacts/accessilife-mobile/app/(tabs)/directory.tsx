import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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
  StarRating,
} from "@/components/ui";
import { CATEGORIES, PROVIDERS, STATES } from "@/constants/fixtures";
import { useColors } from "@/hooks/useColors";
import { favourites } from "@/lib/storage";

export default function DirectoryScreen() {
  const c = useColors();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    favourites.list().then((arr) => setFavIds(new Set(arr)));
  }, []);

  const results = useMemo(() => {
    return PROVIDERS.filter((p) => {
      if (category && p.category !== category) return false;
      if (state && p.state !== state) return false;
      if (
        query &&
        !`${p.name} ${p.blurb} ${p.suburb}`.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [query, category, state]);

  const toggleFav = async (id: string) => {
    const next = await favourites.toggle(id);
    setFavIds((prev) => {
      const s = new Set(prev);
      if (next) s.add(id);
      else s.delete(id);
      return s;
    });
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.background }}>
      <ScreenHeader title="Directory" subtitle="Providers across Australia." />

      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search providers, supports, suburbs"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        <Chip
          label="All categories"
          selected={!category}
          onPress={() => setCategory(null)}
        />
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            selected={category === cat}
            onPress={() => setCategory(cat === category ? null : cat)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        <Chip
          label="All of Australia"
          selected={!state}
          onPress={() => setState(null)}
        />
        {STATES.map((s) => (
          <Chip
            key={s}
            label={s}
            selected={state === s}
            onPress={() => setState(s === state ? null : s)}
          />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 12 }}>
        {results.length === 0 ? (
          <EmptyState
            icon="search"
            title="No matches yet"
            description="Try removing a filter or searching a different suburb."
          />
        ) : (
          results.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => router.push(`/provider/${p.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`${p.name}, ${p.category} in ${p.suburb}`}
            >
              <Card style={{ gap: 8 }}>
                <View style={styles.row}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                      <Badge label={p.category} />
                      {p.ndisRegistered && <Badge label="NDIS" tone="accent" />}
                    </View>
                    <Txt variant="heading">{p.name}</Txt>
                    <Txt variant="caption" color={c.mutedForeground}>
                      {p.suburb}, {p.state} · {p.reviewCount} reviews
                    </Txt>
                  </View>
                  <Pressable
                    onPress={() => toggleFav(p.id)}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel={
                      favIds.has(p.id) ? "Remove from favourites" : "Save to favourites"
                    }
                  >
                    <Feather
                      name="heart"
                      size={22}
                      color={favIds.has(p.id) ? c.accent : c.mutedForeground}
                    />
                  </Pressable>
                </View>
                <Txt variant="body" color={c.foreground} numberOfLines={2}>
                  {p.blurb}
                </Txt>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    {p.supports.slice(0, 3).map((s) => (
                      <Badge key={s} label={s} tone="muted" />
                    ))}
                  </View>
                  <StarRating value={p.rating} />
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
  row: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
});
