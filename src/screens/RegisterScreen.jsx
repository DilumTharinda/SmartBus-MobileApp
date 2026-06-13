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
import { findOne, insertOne } from "../services/supabase";

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
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

  // Password strength logic
  const getPasswordStrength = () => {
    if (password.length === 0) return { level: 0, label: "", color: "#E8EDF2" };
    if (password.length < 6) return { level: 1, label: "Weak — add numbers & symbols", color: "#F19C12" };
    if (password.length < 10 && !/[!@#$%^&*]/.test(password)) return { level: 2, label: "Fair — add symbols", color: "#F19C12" };
    if (password.length >= 10 && /[!@#$%^&*]/.test(password) && /[0-9]/.test(password)) return { level: 4, label: "Strong", color: "#0B5E52" };
    return { level: 3, label: "Good", color: "#10B891" };
  };

  const strength = getPasswordStrength();

  const handleRegister = async () => {
    if (!name || !phone || !password) {
      shake();
      Alert.alert("Error", "Please fill in name, phone and password");
      return;
    }
    if (password.length < 8) {
      shake();
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    if (!agreed) {
      Alert.alert("Error", "Please agree to the Terms of Service & Privacy Policy");
      return;
    }
    setLoading(true);
    try {
      if (email) {
        const existing = await findOne("users", "email", email.trim().toLowerCase());
        if (existing) {
          shake();
          Alert.alert("Error", "An account with this email already exists");
          setLoading(false);
          return;
        }
      }
      const newUser = {
        name: name.trim(),
        email: email.trim().toLowerCase() || null,
        password,
        phone: phone.trim(),
        role: "passenger",
      };
      await insertOne("users", newUser);
      const created = email
        ? await findOne("users", "email", email.trim().toLowerCase())
        : await findOne("users", "phone", phone.trim());
      login(created);
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => Alert.alert("Google Login", "Google sign-in coming soon.");
  const handleFacebook = () => Alert.alert("Facebook Login", "Facebook sign-in coming soon.");

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
        {/* Green header with bus icon */}
        <View style={styles.header}>
          <View style={styles.busIconOuter}>
            <View style={styles.busIconInner}>
              <Text style={styles.busEmoji}>🚌</Text>
            </View>
          </View>
          <Text style={styles.headerTitle}>SmartBus</Text>
          <Text style={styles.headerSub}>Create your free account</Text>
        </View>

        {/* White card */}
        <View style={styles.card}>
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>

            {/* Card title row with back arrow */}
            <View style={styles.cardTitleRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={18} color="#0B5E52" />
              </TouchableOpacity>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.cardTitle}>Create account</Text>
                <Text style={styles.cardSubtitle}>Join SmartBus — it's free</Text>
              </View>
            </View>

            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputWrapper, nameFocused && styles.inputFocused]}>
              <View style={styles.iconBox}>
                <Ionicons name="ellipse" size={10} color="#0B5E52" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. Dilum Tharinda"
                placeholderTextColor="#C0C8D0"
                value={name}
                onChangeText={setName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>

            {/* Phone Number */}
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputWrapper, phoneFocused && styles.inputFocused]}>
              <View style={styles.iconBox}>
                <Ionicons name="call" size={14} color="#E05A3A" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="+94 77 000 0000"
                placeholderTextColor="#C0C8D0"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
              />
            </View>

            {/* Email (optional) */}
            <Text style={styles.label}>Email Address <Text style={styles.optional}>(optional)</Text></Text>
            <View style={[styles.inputWrapper, emailFocused && styles.inputFocused]}>
              <View style={styles.iconBox}>
                <Ionicons name="mail-outline" size={14} color="#999" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#C0C8D0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, passwordFocused && styles.inputFocused]}>
              <View style={styles.iconBox}>
                <Ionicons name="lock-closed-outline" size={14} color="#999" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Min. 8 characters"
                placeholderTextColor="#C0C8D0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Password strength bar */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBarBg}>
                  <View
                    style={[
                      styles.strengthBarFill,
                      {
                        width: `${(strength.level / 4) * 100}%`,
                        backgroundColor: strength.color,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>
                  {strength.label}
                </Text>
              </View>
            )}

            {/* Terms checkbox */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Ionicons name="checkmark" size={12} color="white" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the{" "}
                <Text style={styles.termsLink}>Terms of Service & Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

          </Animated.View>

          {/* Create account button */}
          <TouchableOpacity
            style={[styles.createBtn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.createBtnText}>Create account</Text>
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
              <Text style={styles.googleText}>G  Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.facebookBtn} onPress={handleFacebook} activeOpacity={0.8}>
              <Text style={styles.facebookText}>f  Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Sign in link */}
          <View style={styles.signinRow}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.signinLink}>Sign in</Text>
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
    paddingTop: 52,
    paddingBottom: 44,
    alignItems: "center",
  },
  busIconOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  busIconInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#10B891",
    alignItems: "center",
    justifyContent: "center",
  },
  busEmoji: {
    fontSize: 26,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  headerSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
  card: {
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -16,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F0FAF7",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A2E3B",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#7A93A6",
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2A4A5A",
    marginBottom: 8,
  },
  optional: {
    fontWeight: "400",
    color: "#999",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#DDE4EE",
    marginBottom: 16,
    paddingHorizontal: 14,
    height: 52,
  },
  inputFocused: {
    borderColor: "#0B5E52",
    backgroundColor: "#F0FAF7",
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(11,94,82,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1A2E3B",
  },
  strengthContainer: {
    marginTop: -8,
    marginBottom: 16,
  },
  strengthBarBg: {
    height: 4,
    backgroundColor: "#E8EDF2",
    borderRadius: 2,
    marginBottom: 4,
  },
  strengthBarFill: {
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DDE4EE",
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#DDE4EE",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#0B5E52",
    borderColor: "#0B5E52",
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: "#2A4A5A",
    lineHeight: 18,
  },
  termsLink: {
    color: "#0B5E52",
    fontWeight: "600",
  },
  createBtn: {
    backgroundColor: "#0B5E52",
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0B5E52",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  createBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
    marginBottom: 24,
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
  googleText: {
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
  facebookText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  signinRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signinText: {
    color: "#666",
    fontSize: 14,
  },
  signinLink: {
    color: "#0B5E52",
    fontSize: 14,
    fontWeight: "700",
  },
});