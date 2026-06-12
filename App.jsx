import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connectDB } from "./src/services/mongodb";

export default function App() {
  const [status, setStatus] = useState("Connecting to MongoDB...");
  const [color, setColor] = useState("orange");

  useEffect(() => {
    connectDB()
      .then(() => {
        setStatus("✅ MongoDB Connected Successfully!");
        setColor("green");
      })
      .catch((err) => {
        setStatus("❌ MongoDB Connection Failed!\n\n" + err.message);
        setColor("red");
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SmartBus</Text>
      <Text style={styles.subtitle}>Database Connection Test</Text>
      <View style={[styles.box, { borderColor: color }]}>
        <Text style={[styles.status, { color: color }]}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  box: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    width: "100%",
    alignItems: "center",
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 26,
  },
});