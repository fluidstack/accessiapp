import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Txt } from "@/components/Typography";
import { Badge, Card, Divider, EmptyState, StarRating } from "@/components/ui";
import { PROVIDERS } from "@/constants/fixtures";
import { useColors } from "@/hooks/useColors";
import { favourites } from "@/lib/storage";

const REVIEWS: Record<string, { author: string; stars: number; text: string; daysAgo: number }[]> = {
  p1: [
    { author: "Hannah", stars: 5, text: "Therapist came to our home and built such a good relationship with my son.", daysAgo: 18 },
    { author: "Tom", stars: 4, text: "Booking is easy. Wait list was a few weeks but worth it.", daysAgo: 41 },
  ],
  p2: [
    { author: "Margaret", stars: 5, text: "Plain English summary of my plan was a game changer.", daysAgo: 7 },
  ],
};

export default function ProviderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const c = useColors();
  const provider = PROVIDERS.find((p) => p.id === id);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (id) favourites.has(id).then(setFav);
  }, [id]);

  if (!provider) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
        <EmptyState icon="alert-circle" title="Provider not found" />
      </SafeAreaView>
    );
  }

  const reviews = REVIEWS[provider.id] ?? [];

  const toggle = async () => {
    const next = await favourites.toggle(provider.id);
    setFav(next);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View
          style={[
            styles.cover,
            { backgroundColor: c.sageMist, borderColor: c.border },
          ]}
        >
          <View style={styles.coverPattern}>
            <Feather name="leaf" size={84} color={c.sageDark} />
          </View>
        </View>

        <View style={{ padding: 20, gap: 14, marginTop: -28 }}>
          <Card style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Badge label={provider.category} />
              {provider.ndisRegistered && <Badge label="NDIS registered" tone="accent" />}
            </View>
            <Txt variant="display">{provider.name}</Txt>
            <Txt variant="body" color={c.mutedForeground}>
              {provider.suburb}, {provider.state}
            </Txt>
            <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
              <StarRating value={provider.rating} size={16} />
              <Txt variant="caption" color={c.mutedForeground}>
                {provider.reviewCount} reviews
              </Txt>
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
              <View style={{ flex: 1 }}>
                <Button
                  label="Enquire"
                  onPress={() => router.push(`/enquiry/${provider.id}`)}
                  fullWidth
                  leadingIcon={<Feather name="mail" size={16} color={c.primaryForeground} />}
                />
              </View>
              <Button
                label={fav ? "Saved" : "Save"}
                variant={fav ? "secondary" : "outline"}
                onPress={toggle}
                leadingIcon={
                  <Feather name="heart" size={16} color={fav ? c.accent : c.foreground} />
                }
              />
            </View>
          </Card>

          <Card style={{ gap: 8 }}>
            <Txt variant="heading">About</Txt>
            <Txt variant="body" color={c.foreground}>
              {provider.bio}
            </Txt>
          </Card>

          <Card style={{ gap: 10 }}>
            <Txt variant="heading">Supports offered</Txt>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {provider.supports.map((s) => (
                <Badge key={s} label={s} tone="muted" />
              ))}
            </View>
            <Divider />
            <Row icon="user" label={`Primary contact · ${provider.contactName}`} />
            <Row icon="map-pin" label={`${provider.suburb}, ${provider.state}`} />
            <Row
              icon="check-circle"
              label={
                provider.ndisRegistered
                  ? "Accepts NDIA, plan-managed and self-managed"
                  : "Plan-managed and self-managed only"
              }
            />
          </Card>

          <Card style={{ gap: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Txt variant="heading">Reviews</Txt>
              <Pressable accessibilityRole="link" hitSlop={10}>
                <Txt variant="label" color={c.primary}>
                  Leave a review
                </Txt>
              </Pressable>
            </View>
            {reviews.length === 0 ? (
              <Txt variant="body" color={c.mutedForeground}>
                No member reviews yet. Be the first.
              </Txt>
            ) : (
              reviews.map((r, i) => (
                <View key={i} style={{ gap: 4, paddingVertical: 8 }}>
                  <View
                    style={{ flexDirection: "row", justifyContent: "space-between" }}
                  >
                    <Txt variant="subheading">{r.author}</Txt>
                    <StarRating value={r.stars} />
                  </View>
                  <Txt variant="body" color={c.foreground}>
                    {r.text}
                  </Txt>
                  <Txt variant="caption" color={c.mutedForeground}>
                    {r.daysAgo}d ago
                  </Txt>
                </View>
              ))
            )}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({
  icon,
  label,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
}) {
  const c = useColors();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Feather name={icon} size={16} color={c.sageDark} />
      <Txt variant="body" color={c.foreground} style={{ flex: 1 }}>
        {label}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 200,
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  coverPattern: { opacity: 0.4 },
});
