import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NotificationsModal from "./notificationsModal";

// Import your logo
// import Logo from "../../assets/Nkitsi_logo.png";

const Header = ({
  onProfileClick,
  onNotificationClick,
  hasNotifications = false,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  // Example notifications
  const notifications = [
    { id: "1", businessName: "Business A", requestedAt: "Today, 10:30 AM" },
    { id: "2", businessName: "Business B", requestedAt: "Yesterday, 3:15 PM" },
  ];

  const handleNotificationPress = () => {
    setModalOpen(true);
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  const handleSeeDetails = (id) => {
    console.log("Go to details for", id);
    setModalOpen(false);
  };

  return (
    <View style={styles.header}>
      {/* Left spacer for centering */}
      <View style={styles.leftSpacer} />

      {/* Centered Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/Nkitsi_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Icons (Right Side) */}
      <View style={styles.rightIcons}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color="#333" />
          {hasNotifications && <View style={styles.notifDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onProfileClick}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Notifications modal */}
      <NotificationsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        notifications={notifications}
        onSeeDetails={handleSeeDetails}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftSpacer: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    // allow a larger visible logo while keeping it inside the 60px header
    width: 190,
    height: 80,
    resizeMode: "contain",
  },
  rightIcons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  iconBtn: {
    padding: 8,
    position: "relative",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff3b30",
  },
});

export default Header;