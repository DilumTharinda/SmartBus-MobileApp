import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

// Auth Screens
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

// Passenger Screens
import PassengerHome from "./src/screens/passenger/HomeScreen";
import SearchScreen from "./src/screens/passenger/SearchScreen";
import BusListScreen from "./src/screens/passenger/BusListScreen";
import LiveMapScreen from "./src/screens/passenger/LiveMapScreen";
import BusDetailScreen from "./src/screens/passenger/BusDetailScreen";
import NotificationsScreen from "./src/screens/passenger/NotificationsScreen";
import OffersScreen from "./src/screens/passenger/OffersScreen";

// Driver Screens
import DriverDashboard from "./src/screens/driver/DashboardScreen";
import StartRouteScreen from "./src/screens/driver/StartRouteScreen";
import ActiveTripScreen from "./src/screens/driver/ActiveTripScreen";

// Owner Screens
import OwnerDashboard from "./src/screens/owner/OwnerDashboard";
import FleetMapScreen from "./src/screens/owner/FleetMapScreen";

// Shared Screens
import ProfileScreen from "./src/screens/shared/ProfileScreen";
import SettingsScreen from "./src/screens/shared/SettingsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ── Passenger Bottom Tabs ──
function PassengerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0B5E52",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#F0F0F0",
          height: 75,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            Home: focused ? "home" : "home-outline",
            Search: focused ? "search" : "search-outline",
            Track: focused ? "radio-button-on" : "radio-button-off",
            Offers: focused ? "pricetag" : "pricetag-outline",
            Profile: focused ? "person" : "person-outline",
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={PassengerHome} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Track" component={LiveMapScreen} />
      <Tab.Screen name="Offers" component={OffersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ── Driver Bottom Tabs ──
function DriverTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2E7D32",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { backgroundColor: "#fff", borderTopColor: "#eee" },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Dashboard: "speedometer",
            Profile: "person",
            Settings: "settings",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DriverDashboard} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// ── Owner Bottom Tabs ──
function OwnerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2E7D32",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { backgroundColor: "#fff", borderTopColor: "#eee" },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Fleet: "bus",
            Map: "map",
            Profile: "person",
            Settings: "settings",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Fleet" component={OwnerDashboard} />
      <Tab.Screen name="Map" component={FleetMapScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// ── Main Navigator (role based) ──
function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Not logged in — show auth screens
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : user.role === "passenger" ? (
        // Passenger flow
        <>
          <Stack.Screen name="PassengerTabs" component={PassengerTabs} />
          <Stack.Screen name="BusList" component={BusListScreen} />
          <Stack.Screen name="LiveMap" component={LiveMapScreen} />
          <Stack.Screen name="BusDetail" component={BusDetailScreen} />
          <Stack.Screen name="Offers" component={OffersScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      ) : user.role === "driver" ? (
        // Driver flow
        <>
          <Stack.Screen name="DriverTabs" component={DriverTabs} />
          <Stack.Screen name="StartRoute" component={StartRouteScreen} />
          <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} />
        </>
      ) : (
        // Bus Owner flow
        <>
          <Stack.Screen name="OwnerTabs" component={OwnerTabs} />
          <Stack.Screen name="FleetMap" component={FleetMapScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

// ── App Root ──
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}