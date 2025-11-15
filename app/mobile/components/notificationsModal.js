import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height: screenHeight } = Dimensions.get("window");

const NotificationsModal = ({ isOpen, onClose, notifications, onSeeDetails }) => {
  const slideAnim = useRef(new Animated.Value(-screenHeight)).current; // start off-screen
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={onClose}>
      {/* Overlay */}
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Animated.View style={[styles.notificationsModal, { transform: [{ translateY: slideAnim }], opacity: opacityAnim }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <Text style={styles.noNotifications}>
                No business requests at the moment.
              </Text>
            ) : (
              notifications.map((n) => (
                <View key={n.id} style={styles.notificationItem}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="business-outline" size={24} color="#009688" />
                  </View>
                  <View style={styles.notificationText}>
                    <Text style={styles.businessName}>{n.businessName}</Text>
                    <Text style={styles.requestedAt}>{n.requestedAt}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.seeDetailsBtn}
                    onPress={() => onSeeDetails(n.id)}
                  >
                    <Text style={styles.seeDetailsBtnText}>See Details</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 60,
  },
  notificationsModal: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  closeBtn: { padding: 4 },
  modalContent: { paddingBottom: 8 },
  noNotifications: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    paddingVertical: 32,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E0F2F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationText: { flex: 1 },
  businessName: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 2 },
  requestedAt: { fontSize: 12, color: "#666", fontStyle: "italic" },
  seeDetailsBtn: {
    backgroundColor: "#009688",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  seeDetailsBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
});

export default NotificationsModal;