import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const ExpiringSoon = ({ documents }) => {
  return (
    <View style={styles.expiringSoon}>
      <Text style={styles.sectionTitle}>Expiring Soon</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.expiringScroll}
      >
        {documents.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            style={styles.expiringCard}
            activeOpacity={0.7}
            onPress={() => console.log("View document:", doc.id)}
          >
            <View style={styles.thumbnail}>
              <Image
                source={{ uri: doc.thumbnail }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.docName} numberOfLines={1}>
                {doc.name}
              </Text>
              <Text style={styles.docExpiry}>{doc.expiresIn}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  expiringSoon: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  expiringScroll: {
    paddingRight: 16,
  },
  expiringCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  thumbnail: {
    width: "100%",
    height: 100,
    backgroundColor: "#f5f5f5",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  cardInfo: {
    padding: 12,
  },
  docName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  docExpiry: {
    fontSize: 12,
    color: "#ff3b30",
    fontWeight: "500",
  },
});

export default ExpiringSoon;