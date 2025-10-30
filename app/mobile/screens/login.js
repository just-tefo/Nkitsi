import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { login, logout } from '../../../api/authService';
import { Auth } from "aws-amplify";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const login = async () => {
    await Auth.federatedSignIn();
  };


  const handleGoogleLogin = () => {
    console.log("Google login pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.loginContainer}>
            {/* Logo */}
            <View style={styles.logoWrapper}>
              <Image
                source={require("../../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Please enter your details</Text>

            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Password Input */}
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Remember Me + Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberWrapper}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Buttons */}
            <TouchableOpacity style={styles.loginButton} onPress={login}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
            >
              <Image
                source={require("../../../assets/icons8-google-48.png")}
                style={styles.googleIcon}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>Log In with Google</Text>
            </TouchableOpacity>

            {/* Sign Up */}
            <View style={styles.signUpRow}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ 
  flex: { flex: 1 }, 
  container: { flex: 1, backgroundColor: "#fff" }, 
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: "center", 
    alignItems: "center", padding: 20, }, 
    loginContainer: { 
      width: "100%", 
      maxWidth: 400, 
      alignSelf: "stretch" 
    }, 
    logoWrapper: { 
      alignItems: "center", // centers horizontally 
      marginBottom: 20, // space below logo 
    }, 
    logo: { 
      width: 120, 
      height: undefined, 
      aspectRatio: 1, // keeps logo proportional 
    }, 
    logo: { 
      width: 150, 
      height: undefined, 
      aspectRatio: 2, 
      marginBottom: 20 
    }, 
    title: { 
      fontSize: 28, 
      fontWeight: "700", 
      color: "#333", 
      marginBottom: 6 
    }, 
    subtitle: { 
      fontSize: 16, 
      color: "#666", 
      marginBottom: 20 
    }, 
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
    passwordWrapper: { 
      flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 16, height: 50, marginBottom: 16, backgroundColor: "#fff", }, passwordInput: { flex: 1, fontSize: 16 }, eyeIcon: { padding: 4 }, optionsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24, }, rememberWrapper: { flexDirection: "row", alignItems: "center" }, checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: "#ddd", borderRadius: 4, marginRight: 8, justifyContent: "center", alignItems: "center", }, checkboxChecked: { backgroundColor: "#007AFF", borderColor: "#007AFF" }, rememberText: { fontSize: 14, color: "#666" }, forgotText: { fontSize: 14, color: "#007AFF" }, loginButton: { width: "100%", height: 50, backgroundColor: "#007AFF", borderRadius: 8, justifyContent: "center", alignItems: "center", marginBottom: 12, }, loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" }, googleButton: { width: "100%", height: 50, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 16, }, googleIcon: { width: 24, height: 24, marginRight: 8 }, googleButtonText: { color: "#333", fontSize: 16, fontWeight: "600" }, signUpRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 8, }, signUpText: { fontSize: 14, color: "#666" }, signUpLink: { fontSize: 14, color: "#007AFF", textDecorationLine: "underline", }, });

export default Login;
/*
// src/screens/LoginScreen.js
import React from "react";
import { View, Button } from "react-native";
import { Auth } from "aws-amplify";

export default function LoginScreen() {
  const login = async () => {
    await Auth.federatedSignIn();
  };

  return (
    <View>
      <Button title="Login with Cognito" onPress={login} />
    </View>
  );
}*/
