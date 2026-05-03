import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Txt } from "@/components/Typography";
import { Badge, Card, EmptyState } from "@/components/ui";
import { LISTINGS } from "@/constants/fixtures";
import { useColors } from "@/hooks/useColors";

export default function ListingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const listing = LISTINGS.find((l) => l.id === id);

  if (!listing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
        <EmptyState icon="alert-circle" title="Listing not found" />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View
          style={[
            styles.cover,
            { backgroundColor: c.sageMist, borderColor: c.border },
          ]}
        >
          <Feather name="package" size={96} color={c.sageDark} />
        </View>
        <View style={{ padding: 20, gap: 14, marginTop: -28 }}>
          <Card style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Badge label={listing.category} />
              <Badge label={listing.condition} tone="muted" />
            </View>
            <Txt variant="display">{listing.title}</Txt>
            <Txt variant="title" color={c.primary}>
              ${listing.price.toLocaleString("en-AU")}
            </Txt>
            <Txt variant="body" color={c.mutedForeground}>
              {listing.suburb}, {listing.state} · listed {listing.postedDaysAgo}d ago
            </Txt>
            <Button
              label="Message seller"
              leadingIcon={<Feather name="message-square" size={16} color={c.primaryForeground} />}
            />
          </Card>
          <Card style={{ gap: 8 }}>
            <Txt variant="heading">Description</Txt>
            <Txt variant="body">{listing.description}</Txt>
          </Card>
          <Card style={{ gap: 8 }}>
            <Txt variant="heading">Seller</Txt>
            <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: c.sageMist,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="user" size={18} color={c.sageDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt variant="subheading">{listing.sellerName}</Txt>
                <Txt variant="caption" color={c.mutedForeground}>
                  Verified Accessilife member
                </Txt>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 220,
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
