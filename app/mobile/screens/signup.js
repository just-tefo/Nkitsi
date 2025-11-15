import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import { signupUser } from "../controllers/authControllers"; // ✅ Correct controller import
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CountryPicker from "react-native-country-picker-modal";

const Signup = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [countryCode, setCountryCode] = useState("US");
  const [callingCode, setCallingCode] = useState("1");
  const [withCallingCode, setWithCallingCode] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    consent: false,
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    // Prevent multiple submissions
    if (loading) return;

    // Add validation
    if (!formData.fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    if (!formData.password) {
      Alert.alert("Error", "Please enter a password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!formData.consent) {
      Alert.alert("Error", "Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (!formData.phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)"
      );
      return;
    }

    // ... after validation
    console.log('Form Data:', formData);

    try {
      setLoading(true);

      // Format phone number with country code
      const fullPhone = formData.phone ? `+${callingCode}${formData.phone}` : "";

      // Call controller to handle signup
      const result = await signupUser({ ...formData, phone: fullPhone });

      // Show success message
      Alert.alert("Success! 🎉", result.message, [
        {
          text: "OK",
          onPress: () => {
            // Navigate to confirmation screen with email
            navigation.navigate("ConfirmSignup", { email: formData.email });
          },
        },
      ]);
    } catch (error) {
      // Show error message from Amplify with details
      const errorMsg = error.message || error || "An error occurred during signup. Please try again.";
      const details = error.code ? ` (${error.code})` : "";
      Alert.alert("Signup Failed", errorMsg + details);
      console.error('Signup error details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.signupContainer}>
          {/* Logo */}
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../../assets/Nkitsi_logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Fill in your details below</Text>

          {/* Full Name */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={formData.fullName}
            onChangeText={(value) => handleChange("fullName", value)}
            autoCapitalize="words"
          />

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Phone Number with Country Code */}
          <View style={styles.phoneWrapper}>
            <CountryPicker
              countryCode={countryCode}
              withCallingCode={withCallingCode}
              withFilter
              withFlag
              withAlphaFilter
              onSelect={(country) => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
              }}
            />
            <Text style={styles.callingCode}>+{callingCode}</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              value={formData.phone}
              onChangeText={(value) => handleChange("phone", value)}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          {/* Password */}
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#999"
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              disabled={loading}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Password Requirements */}
          <Text style={styles.passwordHint}>
            Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)
          </Text>

          {/* Confirm Password */}
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange("confirmPassword", value)}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
              disabled={loading}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Consent */}
          <TouchableOpacity
            style={styles.consentContainer}
            onPress={() => handleChange("consent", !formData.consent)}
            disabled={loading}
          >
            <View
              style={[
                styles.checkbox,
                formData.consent && styles.checkboxChecked,
              ]}
            >
              {formData.consent && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <Text style={styles.consentText}>
              I agree to the{" "}
              <Text style={styles.link}>Terms of Service</Text> and{" "}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* Signup Button */}
          <TouchableOpacity 
            style={[styles.signupButton, loading && styles.signupButtonDisabled]} 
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 20 },
  signupContainer: { width: "100%", maxWidth: 400, alignSelf: "center" },
  logoWrapper: { alignItems: "center", marginBottom: 30 },
  logoImage: { width: 125, height: 100 },
  title: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 6 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 24 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  phoneWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  callingCode: { marginHorizontal: 6, fontSize: 16 },
  phoneInput: { flex: 1, fontSize: 16, height: "100%" },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  passwordInput: { flex: 1, fontSize: 16 },
  eyeIcon: { padding: 4 },
  consentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 4,
    marginRight: 8,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#009688", borderColor: "#009688" },
  consentText: { flex: 1, fontSize: 14, color: "#666", lineHeight: 20 },
  link: { color: "#009688", textDecorationLine: "underline" },
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#009688",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  signupButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  loginRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  loginText: { fontSize: 14, color: "#666" },
  loginLink: { fontSize: 14, color: "#009688", textDecorationLine: "underline" },
});

export default Signup;
