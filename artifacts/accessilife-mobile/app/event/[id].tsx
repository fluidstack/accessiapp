import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Txt } from "@/components/Typography";
import { Badge, Card, EmptyState } from "@/components/ui";
import { EVENTS } from "@/constants/fixtures";
import { useColors } from "@/hooks/useColors";
import { rsvps } from "@/lib/storage";

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const event = EVENTS.find((e) => e.id === id);
  const [going, setGoing] = useState(false);

  useEffect(() => {
    if (id) rsvps.has(id).then(setGoing);
  }, [id]);

  if (!event) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
        <EmptyState icon="alert-circle" title="Event not found" />
      </SafeAreaView>
    );
  }

  const toggle = async () => {
    const next = await rsvps.toggle(event.id);
    setGoing(next);
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
          <Feather name="calendar" size={84} color={c.sageDark} />
        </View>
        <View style={{ padding: 20, gap: 14, marginTop: -28 }}>
          <Card style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Badge label={event.format} />
              {going && <Badge label="You're going" tone="accent" />}
            </View>
            <Txt variant="display">{event.title}</Txt>
            <Txt variant="body" color={c.mutedForeground}>
              Hosted by {event.host}
            </Txt>
            <Row icon="clock" label={`${event.date} · ${event.startTime}–${event.endTime}`} />
            <Row icon="map-pin" label={event.suburb} />
            <Row icon="users" label={`${event.attending} of ${event.capacity} going`} />
            <Button
              label={going ? "Cancel RSVP" : "RSVP — I'll be there"}
              variant={going ? "outline" : "primary"}
              onPress={toggle}
              leadingIcon={
                <Feather
                  name={going ? "x" : "check"}
                  size={16}
                  color={going ? c.foreground : c.primaryForeground}
                />
              }
            />
          </Card>
          <Card style={{ gap: 8 }}>
            <Txt variant="heading">About this event</Txt>
            <Txt variant="body">{event.description}</Txt>
          </Card>
          <Card style={{ gap: 8 }}>
            <Txt variant="heading">Access notes</Txt>
            <Txt variant="body">{event.accessNotes}</Txt>
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
      <Txt variant="body" style={{ flex: 1 }}>
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
});
