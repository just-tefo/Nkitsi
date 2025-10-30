import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const MyNetwork = ({ companies, onSelectCompany }) => {
  return (
    <View style={styles.networkContainer}>
      {companies.length === 0 ? (
        <Text style={styles.emptyText}>
          You haven't shared your documents with any companies yet.
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.networkScroll}
        >
          {companies.map((company) => (
            <TouchableOpacity
              key={company.id}
              style={styles.networkCard}
              onPress={() => onSelectCompany(company.id)}
              activeOpacity={0.7}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={{ uri: company.logoUrl }}
                  style={styles.companyLogo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.companyName} numberOfLines={2}>
                {company.name}
              </Text>
              {company.lastShared && (
                <Text style={styles.lastShared}>
                  Last shared: {company.lastShared}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  networkContainer: {
    marginBottom: 24,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  networkScroll: {
    paddingRight: 16,
  },
  networkCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  companyLogo: {
    width: 50,
    height: 50,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
    minHeight: 36,
  },
  lastShared: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
  },
});

export default MyNetwork;