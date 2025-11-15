import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Avatar, TextInput, Button, Card, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Enable layout animation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CollapsibleSection = ({ title, icon, children, iconColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (isOpen) {
      Animated.parallel([
        Animated.timing(animatedHeight, { toValue: 0, duration: 300, useNativeDriver: false }),
        Animated.timing(animatedOpacity, { toValue: 0, duration: 200, useNativeDriver: false }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedHeight, { toValue: 1, duration: 300, useNativeDriver: false }),
        Animated.timing(animatedOpacity, { toValue: 1, duration: 200, useNativeDriver: false }),
      ]).start();
    }
    setIsOpen(!isOpen);
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={toggle} activeOpacity={0.8}>
        <Icon name={icon} size={22} color={iconColor || "#333"} />
        <Text style={[styles.headerText, { color: iconColor || "#333" }]}>{title}</Text>
      </TouchableOpacity>

      <Animated.View
        style={{
          opacity: animatedOpacity,
          height: isOpen ? "auto" : 0,
          overflow: "hidden",
        }}
      >
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </Card>
  );
};

const MyAccountScreen = () => {
  const [user, setUser] = useState({
    fullName: "Tefo Mokgoabone",
    email: "tefo@example.com",
    phone: "+267 71234567",
    idType: "Omang",
    idNumber: "123456789",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveProfile = () =>
    Alert.alert("Profile Updated", "Your changes have been saved successfully.");

  const handleChangePassword = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }
    Alert.alert("Success", "Your password has been updated.");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => console.log("Account deleted") },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Info */}
      <CollapsibleSection title="Profile Information">
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={80}
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
          />
          <Button mode="text" onPress={() => Alert.alert("Change Photo")}>
            Change Photo
          </Button>
        </View>

        <TextInput
          label="Full Name"
          value={user.fullName}
          onChangeText={(text) => setUser({ ...user, fullName: text })}
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
          style={styles.input}
        />
        <TextInput
          label="Phone Number"
          value={user.phone}
          onChangeText={(text) => setUser({ ...user, phone: text })}
          style={styles.input}
        />
        <TextInput
          label="ID Type"
          value={user.idType}
          onChangeText={(text) => setUser({ ...user, idType: text })}
          style={styles.input}
        />
        <TextInput
          label="ID Number"
          value={user.idNumber}
          onChangeText={(text) => setUser({ ...user, idNumber: text })}
          style={styles.input}
        />
        <Button mode="contained" style={styles.saveButton} onPress={handleSaveProfile}>
          Save Changes
        </Button>
      </CollapsibleSection>

      {/* Security */}
      <CollapsibleSection title="Account Security">
        <TextInput
          label="Old Password"
          value={passwords.oldPassword}
          secureTextEntry
          onChangeText={(text) => setPasswords({ ...passwords, oldPassword: text })}
          style={styles.input}
        />
        <TextInput
          label="New Password"
          value={passwords.newPassword}
          secureTextEntry
          onChangeText={(text) => setPasswords({ ...passwords, newPassword: text })}
          style={styles.input}
        />
        <TextInput
          label="Confirm New Password"
          value={passwords.confirmPassword}
          secureTextEntry
          onChangeText={(text) => setPasswords({ ...passwords, confirmPassword: text })}
          style={styles.input}
        />
        <Button mode="contained" style={styles.saveButton} onPress={handleChangePassword}>
          Update Password
        </Button>
      </CollapsibleSection>

      {/* Manage Account */}
      <CollapsibleSection title="Manage Account">
        <Button
          mode="outlined"
          textColor="red"
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          Deactivate / Delete Account
        </Button>
      </CollapsibleSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8", padding: 10 },
  card: { marginVertical: 8, borderRadius: 12 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  content: { padding: 16, backgroundColor: "#fff" },
  avatarContainer: { alignItems: "center", marginBottom: 16 },
  input: { marginBottom: 12 },
  saveButton: { marginTop: 10, borderRadius: 8 },
  deleteButton: {
    borderColor: "red",
    marginTop: 12,
    borderRadius: 8,
  },
});

export default MyAccountScreen;