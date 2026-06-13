import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const { user } = useAuth();

  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const circle1Scale = useRef(new Animated.Value(0)).current;
  const circle2Scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate background circles
    Animated.parallel([
      Animated.spring(circle1Scale, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(circle2Scale, {
        toValue: 1,
        delay: 200,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate logo
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Animate text
    Animated.sequence([
      Animated.delay(700),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate tagline
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate loading dots
    Animated.sequence([
      Animated.delay(1300),
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after splash
    const timer = setTimeout(() => {
      if (user) {
        if (user.role === "passenger") navigation.replace("PassengerTabs");
        else if (user.role === "driver") navigation.replace("DriverTabs");
        else navigation.replace("OwnerTabs");
      } else {
        navigation.replace("Login");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B5E52" />

      {/* Background decorative circles */}
      <Animated.View
        style={[
          styles.bgCircle1,
          { transform: [{ scale: circle1Scale }] },
        ]}
      />
      <Animated.View
        style={[
          styles.bgCircle2,
          { transform: [{ scale: circle2Scale }] },
        ]}
      />
      <Animated.View style={styles.bgCircle3} />
      <Animated.View style={styles.bgCircle4} />

      {/* Center content */}
      <View style={styles.centerContent}>
        {/* Logo ring + icon */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.outerRing}>
            <View style={styles.innerRing}>
              <View style={styles.iconCircle}>
                <Ionicons name="bus" size={36} color="white" />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* App name */}
        <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
          SmartBus
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          SmartBus
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text style={[styles.subtitle, { opacity: taglineOpacity }]}>
          Real-time bus tracking
        </Animated.Text>
      </View>

      {/* Loading dots at bottom */}
      <Animated.View style={[styles.loadingContainer, { opacity: dotsOpacity }]}>
        <LoadingDots />
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>

      {/* Version */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot1, { toValue: 0.3, duration: 300, useNativeDriver: true }),
      ]).start();
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(dot2, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]).start();
      }, 200);
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(dot3, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]).start();
      }, 400);
    };
    animate();
    const interval = setInterval(animate, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.dots}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B5E52",
    alignItems: "center",
    justifyContent: "center",
  },
  bgCircle1: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -30,
    right: -60,
  },
  bgCircle2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: 80,
    left: -100,
  },
  bgCircle3: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.03)",
    top: 150,
    left: 20,
  },
  bgCircle4: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: 200,
    right: 10,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    marginBottom: 32,
  },
  outerRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 2,
    borderColor: "rgba(77,255,214,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  innerRing: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(77,255,214,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#10B891",
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    color: "white",
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 100,
    alignItems: "center",
  },
  dots: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4DFFD6",
    marginHorizontal: 4,
  },
  loadingText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
  },
  version: {
    position: "absolute",
    bottom: 40,
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
  },
});