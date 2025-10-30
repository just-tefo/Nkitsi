import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NotificationsModal = ({
  isOpen,
  onClose,
  notifications,
  onSeeDetails,
}) => {
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        {/* Modal */}
        <Pressable style={styles.notificationsModal} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {notifications.length === 0 ? (
              <Text style={styles.noNotifications}>
                No business requests at the moment.
              </Text>
            ) : (
              notifications.map((n) => (
                <View key={n.id} style={styles.notificationItem}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="business-outline" size={24} color="#007AFF" />
                  </View>
                  <View style={styles.notificationText}>
                    <Text style={styles.businessName}>{n.businessName}</Text>
                    <Text style={styles.requestedAt}>{n.requestedAt}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.seeDetailsBtn}
                    onPress={() => onSeeDetails(n.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.seeDetailsBtnText}>See Details</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  notificationsModal: {
    width: 320,
    maxHeight: "80%",
    backgroundColor: "#fff",
    marginTop: 60,
    marginRight: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeBtn: {
    padding: 4,
  },
  modalContent: {
    maxHeight: 400,
  },
  noNotifications: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  businessName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  requestedAt: {
    fontSize: 12,
    color: "#666",
  },
  seeDetailsBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  seeDetailsBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default NotificationsModal