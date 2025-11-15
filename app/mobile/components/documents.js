import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MyDocuments = ({ documents }) => {
  const handleOpen = async (fileUrl) => {
    try {
      const supported = await Linking.canOpenURL(fileUrl);
      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        Alert.alert("Error", "Cannot open this document");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open document");
      console.error("Error opening document:", error);
    }
  };

  return (
    <View style={styles.documentsContainer}>
    <Text style={styles.sectionTitle}>My Documents</Text>
      {documents.length === 0 ? (
        <Text style={styles.emptyText}>No documents uploaded yet.</Text>
      ) : (
        <View style={styles.documentList}>
          {documents.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={styles.documentItem}
              onPress={() => handleOpen(doc.fileUrl)}
              activeOpacity={0.7}
            >
              <View style={styles.docIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={28}
                  color="#009688"
                />
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docName} numberOfLines={1}>
                  {doc.name}
                </Text>
                <Text style={styles.docMeta}>
                  {doc.type} • Updated {doc.updatedAt}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  documentsContainer: {
    marginBottom: 24,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    paddingVertical: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  documentList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  docIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0F2F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  docMeta: {
    fontSize: 13,
    color: "#666",
  },
});

export default MyDocuments;