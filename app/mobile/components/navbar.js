import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NavBar = ({ activeTab, onNavigate }) => {
  const tabs = [
    { id: "home", label: "Home", icon: "home-outline", activeIcon: "home" },
    { id: "documents", label: "Documents", icon: "document-text-outline", activeIcon: "document-text" },
    { id: "network", label: "Network", icon: "people-outline", activeIcon: "people" },
  ];

  return (
    <View style={styles.navbar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.navBtn}
            onPress={() => onNavigate(tab.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={isActive ? "#009688" : "#999"}
            />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  navLabelActive: {
    color: "#009688",
    fontWeight: "600",
  },
});

export default NavBar;