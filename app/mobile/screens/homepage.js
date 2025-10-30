import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Import your components (we'll create these next)
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import NavBar from "../components/navbar";
import ExpiringSoon from "../components/expiringSoon";
import MyDocuments from "../components/documents";
import MyNetwork from "../components/network";

// Custom hook for header controller logic
const useHeaderController = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNotificationClick = () => {
    Alert.alert("Notifications", "You have new notifications!");
    setHasNotifications(false);
  };

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    hasNotifications,
    handleNotificationClick,
  };
};

const Homepage = () => {
  const {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    hasNotifications,
    handleNotificationClick,
  } = useHeaderController();

  const [activeTab, setActiveTab] = useState("home");

  // Mock data
  const documents = [
    {
      id: "1",
      name: "National ID.pdf",
      thumbnail: "/assets/id-thumb.jpg",
      expiresIn: "Expiring in 6 days",
    },
    {
      id: "2",
      name: "Driver's License.png",
      thumbnail: "/assets/license-thumb.jpg",
      expiresIn: "Expiring in 1 week",
    },
    {
      id: "3",
      name: "Passport Renewal.pdf",
      thumbnail: "/assets/passport-thumb.jpg",
      expiresIn: "Expiring in 3 days",
    },
  ];

  const mockDocuments = [
    {
      id: "1",
      name: "National ID.pdf",
      type: "PDF Document",
      updatedAt: "2 days ago",
      fileUrl: "/assets/id.pdf",
    },
    {
      id: "2",
      name: "Driver's License.png",
      type: "Image",
      updatedAt: "5 days ago",
      fileUrl: "/assets/license.png",
    },
  ];

  const mockCompanies = [
    {
      id: "1",
      name: "Stanbic Bank",
      logoUrl: "/assets/stanbic.png",
      lastShared: "2 weeks ago",
    },
    {
      id: "2",
      name: "Botswana Life",
      logoUrl: "/assets/botswanalife.png",
      lastShared: "1 month ago",
    },
    {
      id: "3",
      name: "Orange Botswana",
      logoUrl: "/assets/orange.png",
      lastShared: "3 months ago",
    },
  ];

  const handleSelectCompany = (companyId) => {
    Alert.alert("Company Details", `Open details for company ID: ${companyId}`);
  };

  const handleShare = () => {
    Alert.alert("Share", "Share coming soon!");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed header */}
      <Header
        onProfileClick={toggleSidebar}
        onNotificationClick={handleNotificationClick}
        hasNotifications={hasNotifications}
      />

      {/* Sidebar overlay */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Scrollable main content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.homeContainer}>
          <ExpiringSoon documents={documents} />
          <MyDocuments documents={mockDocuments} />
          
          <Text style={styles.sectionTitle}>My KYC Network</Text>
          <MyNetwork
            companies={mockCompanies}
            onSelectCompany={handleSelectCompany}
          />
        </View>
      </ScrollView>

      {/* Fixed bottom navbar */}
      <NavBar activeTab={activeTab} onNavigate={setActiveTab} />

      {/* Floating share button */}
      <TouchableOpacity
        style={styles.shareFab}
        onPress={handleShare}
        activeOpacity={0.8}
      >
        <Ionicons name="share-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80, // Space for navbar
  },
  homeContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 24,
    marginBottom: 16,
  },
  shareFab: {
    position: "absolute",
    bottom: 80, // Above navbar
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Homepage;