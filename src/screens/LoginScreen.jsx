import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { findOneByTwo } from "../services/supabase.js";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      shake();
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const user = await findOneByTwo("users", "email", email.trim().toLowerCase(), "password", password);
      if (!user) {
        shake();
        Alert.alert("Login Failed", "Invalid email or password");
        return;
      }
      login(user);
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Password reset feature coming soon.");
  };

  const handleGoogle = () => {
    Alert.alert("Google Login", "Google sign-in coming soon.");
  };

  const handleFacebook = () => {
    Alert.alert("Facebook Login", "Facebook sign-in coming soon.");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0B5E52" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Green header */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <Text style={styles.headerTitle}>SmartBus</Text>
          </View>
          <Text style={styles.headerWelcome}>Welcome Back</Text>
          <Text style={styles.headerSub}>Sign in to continue</Text>
        </View>

        {/* White card */}
        <View style={styles.card}>
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>

            {/* Email input */}
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputWrapper, emailFocused && styles.inputFocused]}>
              <Ionicons name="mail-outline" size={20} color={emailFocused ? "#0B5E52" : "#999"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#bbb"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            {/* Password input */}
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, passwordFocused && styles.inputFocused]}>
              <Ionicons name="lock-closed-outline" size={20} color={passwordFocused ? "#0B5E52" : "#999"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#bbb"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Forgot password */}
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

          </Animated.View>

          {/* Login button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.loginBtnText}>Sign In</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.googleBtn} onPress={handleGoogle} activeOpacity={0.8}>
              <Text style={styles.googleBtnText}>G  Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.facebookBtn} onPress={handleFacebook} activeOpacity={0.8}>
              <Text style={styles.facebookBtnText}>f  Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#0B5E52",
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTime: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  headerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  headerWelcome: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },
  headerSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  card: {
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -16,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E8EDF2",
    marginBottom: 16,
    paddingHorizontal: 14,
    height: 52,
  },
  inputFocused: {
    borderColor: "#0B5E52",
    backgroundColor: "#F0FAF7",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1a1a2e",
  },
  eyeBtn: {
    padding: 4,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: -8,
  },
  forgotText: {
    color: "#0B5E52",
    fontSize: 13,
    fontWeight: "600",
  },
  loginBtn: {
    backgroundColor: "#0B5E52",
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#0B5E52",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 24,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8EDF2",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: "#999",
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  googleBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#DB4437",
    alignItems: "center",
    justifyContent: "center",
  },
  googleBtnText: {
    color: "#DB4437",
    fontWeight: "600",
    fontSize: 14,
  },
  facebookBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#1877F2",
    alignItems: "center",
    justifyContent: "center",
  },
  facebookBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#0B5E52",
    fontSize: 14,
    fontWeight: "700",
  },
});