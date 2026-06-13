import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  RefreshControl,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { findDocuments } from "../../services/supabase";

// Greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning 👋";
  if (hour < 17) return "Good afternoon 👋";
  return "Good evening 👋";
};

// Crowd badge
const CrowdBadge = ({ level }) => {
  const config = {
    low: { label: "Seats Available", bg: "#E6F4F1", color: "#0B5E52" },
    medium: { label: "Getting Full", bg: "#FFF3E0", color: "#F57C00" },
    high: { label: "Full", bg: "#FDECEA", color: "#D32F2F" },
  };
  const c = config[level] || config.low;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
};

// Saved route card
const SavedRouteCard = ({ route }) => {
  const isDelayed = route.status === "delayed";
  const eta = route.eta || "8 min";
  return (
    <View style={styles.savedCard}>
      <Text style={styles.savedRouteName}>{route.route_name || route.routeName}</Text>
      <Text style={styles.savedRouteStops} numberOfLines={1}>
        {route.stops?.[0]?.stopName} → {route.stops?.[route.stops.length - 1]?.stopName}
      </Text>
      <View style={styles.savedEtaRow}>
        <View style={[styles.etaDot, { backgroundColor: isDelayed ? "#F57C00" : "#0B5E52" }]} />
        <Text style={[styles.etaText, { color: isDelayed ? "#F57C00" : "#0B5E52" }]}>
          {eta}{isDelayed ? " · Delayed" : ""}
        </Text>
      </View>
    </View>
  );
};

// Nearby bus card
const NearbyBusCard = ({ bus, onPress }) => {
  const routeNum = bus.route_number || bus.routeNumber || "---";
  const routeName = bus.route_name || bus.routeName || "";
  const stops = routeName.split(" - ");
  const from = stops[0] || "";
  const to = stops[1] || "";
  const crowd = bus.crowd_level || bus.crowdLevel || "low";
  const eta = Math.floor(Math.random() * 20) + 5;
  const isDelayed = bus.status === "delayed";

  return (
    <TouchableOpacity style={styles.busCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.busNumBox}>
        <Text style={styles.busNum}>{routeNum}</Text>
      </View>
      <View style={styles.busInfo}>
        <View style={styles.busTopRow}>
          <Text style={styles.busRouteName}>Route {routeNum}</Text>
          <CrowdBadge level={crowd} />
        </View>
        <Text style={styles.busStops}>{from} → {to}</Text>
        <View style={styles.busEtaRow}>
          {isDelayed ? (
            <Ionicons name="warning-outline" size={13} color="#F57C00" />
          ) : (
            <Ionicons name="time-outline" size={13} color="#7A93A6" />
          )}
          <Text style={[styles.busEta, { color: isDelayed ? "#F57C00" : "#7A93A6" }]}>
            {" "}{eta} min away{isDelayed ? " · Delayed" : ""}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#C0C8D0" />
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const loadData = async () => {
    try {
      const [routeData, busData] = await Promise.all([
        findDocuments("routes"),
        findDocuments("buses"),
      ]);
      setRoutes(routeData || []);
      setBuses(busData || []);
    } catch (err) {
      console.log("Load error:", err.message);
    }
  };

  useEffect(() => {
    loadData();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const firstName = user?.name?.split(" ")[0] || "Passenger";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B5E52" />

      {/* Green Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{firstName}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={13} color="#4DFFD6" />
              <Text style={styles.locationText}>Colombo, Western Province</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications" size={20} color="white" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#7A93A6" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search route or bus number..."
            placeholderTextColor="#AABCC8"
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => navigation.navigate("Search")}
          />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={20} color="#7A93A6" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0B5E52" />}
      >
        {/* Alert banner */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.alertBanner}>
            <View style={styles.alertIcon}>
              <Text style={{ fontSize: 28 }}>🚌</Text>
            </View>
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>Route 138 is 8 min away</Text>
              <Text style={styles.alertSub}>Leave now — 5 min walk to your stop</Text>
            </View>
            <TouchableOpacity style={styles.leaveBtn}>
              <Text style={styles.leaveBtnText}>Leave now</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Saved Routes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Routes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.savedScroll} contentContainerStyle={{ paddingRight: 24 }}>
          {routes.length > 0 ? (
            routes.map((r, i) => <SavedRouteCard key={i} route={r} />)
          ) : (
            <>
              <View style={styles.savedCard}>
                <Text style={styles.savedRouteName}>Route 138</Text>
                <Text style={styles.savedRouteStops}>Colombo → Gampaha</Text>
                <View style={styles.savedEtaRow}>
                  <View style={[styles.etaDot, { backgroundColor: "#0B5E52" }]} />
                  <Text style={[styles.etaText, { color: "#0B5E52" }]}>8 min</Text>
                </View>
              </View>
              <View style={styles.savedCard}>
                <Text style={styles.savedRouteName}>Route 204</Text>
                <Text style={styles.savedRouteStops}>Kandy → Peradeniya</Text>
                <View style={styles.savedEtaRow}>
                  <View style={[styles.etaDot, { backgroundColor: "#F57C00" }]} />
                  <Text style={[styles.etaText, { color: "#F57C00" }]}>22 min · Delayed</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        {/* Nearby Buses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Buses</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.busList}>
          {buses.length > 0 ? (
            buses.map((bus, i) => (
              <NearbyBusCard
                key={i}
                bus={bus}
                onPress={() => navigation.navigate("BusDetail", { bus })}
              />
            ))
          ) : (
            <>
              {[
                { route_number: "138", route_name: "Colombo - Gampaha", crowd_level: "low" },
                { route_number: "177", route_name: "Nugegoda - Maharagama", crowd_level: "medium" },
                { route_number: "255", route_name: "Kiribathgoda - Kadawatha", crowd_level: "high", status: "delayed" },
              ].map((bus, i) => (
                <NearbyBusCard
                  key={i}
                  bus={bus}
                  onPress={() => navigation.navigate("BusDetail", { bus })}
                />
              ))}
            </>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F5F9",
  },
  header: {
    backgroundColor: "#0B5E52",
    paddingTop: Platform.OS === "ios" ? 54 : 36,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  greeting: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 2,
  },
  userName: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4444",
    borderWidth: 1.5,
    borderColor: "#0B5E52",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1A2E3B",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  alertBanner: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  alertIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#F0FAF7",
    alignItems: "center",
    justifyContent: "center",
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A2E3B",
    marginBottom: 3,
  },
  alertSub: {
    fontSize: 12,
    color: "#7A93A6",
    lineHeight: 17,
  },
  leaveBtn: {
    backgroundColor: "#0B5E52",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  leaveBtnText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A2E3B",
  },
  seeAll: {
    fontSize: 13,
    color: "#0B5E52",
    fontWeight: "600",
  },
  savedScroll: {
    marginBottom: 24,
    marginHorizontal: -20,
    paddingLeft: 20,
  },
  savedCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    width: 170,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  savedRouteName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A2E3B",
    marginBottom: 4,
  },
  savedRouteStops: {
    fontSize: 12,
    color: "#7A93A6",
    marginBottom: 10,
  },
  savedEtaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  etaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  etaText: {
    fontSize: 13,
    fontWeight: "600",
  },
  busList: {
    gap: 10,
    marginBottom: 12,
  },
  busCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  busNumBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F0FAF7",
    alignItems: "center",
    justifyContent: "center",
  },
  busNum: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0B5E52",
  },
  busInfo: {
    flex: 1,
  },
  busTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  busRouteName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A2E3B",
  },
  busStops: {
    fontSize: 12,
    color: "#7A93A6",
    marginBottom: 4,
  },
  busEtaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  busEta: {
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
});