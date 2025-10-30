import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");
const SIDEBAR_WIDTH = 280;

const Sidebar = ({ isOpen, onClose }) => {
  const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 8, speed: 12 }),
        Animated.timing(overlayAnim, { toValue: 0.5, duration: 200, useNativeDriver: true })
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: SIDEBAR_WIDTH, useNativeDriver: true, bounciness: 0, speed: 12 }),
        Animated.timing(overlayAnim, { toValue: 0, duration: 200, useNativeDriver: true })
      ]).start();
    }
  }, [isOpen]);

  if (!isOpen && slideAnim._value === SIDEBAR_WIDTH) return null;

  return (
    <>
      {/* Overlay */}
      <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.headerTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.topMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { console.log("My Account"); onClose(); }}>
              <Ionicons name="person-outline" size={20} color="#333" />
              <Text style={styles.menuText}>My Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => { console.log("Blockchain & Security"); onClose(); }}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#333" />
              <Text style={styles.menuText}>Blockchain & Security</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { console.log("Settings"); onClose(); }}>
              <Ionicons name="settings-outline" size={20} color="#333" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.logoutBtn]} onPress={() => { console.log("Logout"); onClose(); }}>
              <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
              <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: screenWidth,
    height: "100%",
    backgroundColor: "#000",
    zIndex: 1,
  },
  sidebar: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0, // stretch to bottom
    width: SIDEBAR_WIDTH,
    backgroundColor: "#fff",
    zIndex: 2,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  closeBtn: { padding: 4 },
  topMenu: { flex: 1, paddingTop: 8 },
  bottomMenu: { paddingBottom: 24, borderTopWidth: 1, borderTopColor: "#e5e5e5" },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#f5f5f5" },
  menuText: { fontSize: 16, fontWeight: "600", color: "#333", marginLeft: 16 },
  logoutBtn: { borderBottomWidth: 0 },
  logoutText: { color: "#ff3b30" },
});

export default Sidebar;
