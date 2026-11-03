import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ReproWidget } from "./widgets/repro-widget";

const STEP_MS = 15 * 60 * 1000;

function publish(entries: number) {
  const now = Date.now();
  ReproWidget.updateTimeline(
    Array.from({ length: entries }, (_, entry) => {
      const date = new Date(now + entry * STEP_MS);
      const at = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return { date, props: { entry, entries, at, taps: 0 } };
    }),
  );
}

export default function App() {
  const [published, setPublished] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>expo-widgets timeline repro</Text>
      <Text style={styles.body}>
        Add the large "Timeline Repro" widget to the Home Screen, publish a
        timeline, go home and tap the widget buttons. Entries are 15 minutes
        apart.
      </Text>
      {[1, 24].map((entries) => (
        <Pressable
          key={entries}
          style={styles.button}
          onPress={() => {
            publish(entries);
            setPublished(entries);
          }}
        >
          <Text
            style={styles.buttonText}
          >{`Publish ${entries} ${entries === 1 ? "entry" : "entries"}`}</Text>
        </Pressable>
      ))}
      <Text style={styles.body}>
        {published === null
          ? "Nothing published yet."
          : `Published ${published}.`}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: { fontSize: 22, fontWeight: "700" },
  body: { fontSize: 15, color: "#444" },
  button: { backgroundColor: "#1f6feb", borderRadius: 10, padding: 14 },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
