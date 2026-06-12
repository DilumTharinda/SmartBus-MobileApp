import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { findDocuments } from "./src/services/mongodb";

export default function App() {
  const [status, setStatus] = useState("Connecting to Supabase...");
  const [color, setColor] = useState("orange");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    findDocuments("users")
      .then((data) => {
        setStatus("✅ Database Connected Successfully!");
        setColor("green");
        setUsers(data);
      })
      .catch((err) => {
        setStatus("❌ Connection Failed!\n\n" + err.message);
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
      {users.length > 0 && (
        <View style={styles.list}>
          <Text style={styles.listTitle}>Users in database:</Text>
          {users.map((u, i) => (
            <Text key={i} style={styles.item}>
              • {u.name} — {u.role}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#1a1a2e", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 40 },
  box: { padding: 24, borderRadius: 12, borderWidth: 2, width: "100%", alignItems: "center", marginBottom: 20 },
  status: { fontSize: 16, fontWeight: "600", textAlign: "center", lineHeight: 26 },
  listTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#333" },
  item: { fontSize: 14, color: "#555", marginBottom: 6 },
  list: { width: "100%" }
});