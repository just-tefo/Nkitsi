import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";

// Import your components (we'll create these next)
// Header, Sidebar and NavBar are now rendered at the app root to be persistent across screens
import ExpiringSoon from "../components/expiringSoon";
import MyDocuments from "../components/documents";
import MyNetwork from "../components/network";
import { navigate } from "../services/navigationService";

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
    //lert.alert("Notifications", "You have new notifications!");
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
  const scrollRef = useRef(null);
  const route = useRoute();

  useEffect(() => {
    const tab = route?.params?.tab;
    if (tab) {
      setActiveTab(tab);
      // if user requested the network tab, scroll to bottom where the network section is
      if (tab === 'network' && scrollRef.current) {
        // small timeout to allow layout
        setTimeout(() => {
          scrollRef.current.scrollToEnd({ animated: true });
        }, 300);
      }
    }
  }, [route]);

  // Mock data
  const documents = [
    {
      id: "1",
      name: "National ID.pdf",
      thumbnail: "/assets/id-thumb.jpg",
      // local first-page thumbnail you added
      thumbnailLocal: require("../../../assets/thumbnails/ID.jpeg"),
      expiresIn: "Expiring in 6 days",
    },
    {
      id: "2",
      name: "Driver's License.png",
      thumbnail: "/assets/license-thumb.jpg",
      thumbnailLocal: require("../../../assets/thumbnails/doc1-page1.jpg"),
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
      thumbnailLocal: require("../../../assets/thumbnails/doc1-page1.jpg"),
    },
    {
      id: "2",
      name: "Driver's License.png",
      type: "Image",
      updatedAt: "5 days ago",
      fileUrl: "/assets/license.png",
      thumbnailLocal: require("../../../assets/thumbnails/doc1-page1.jpg"),
    },
  ];

  const mockCompanies = [
    {
      id: "1",
      name: "Orange Botswana",
      logoUrl: "/assets/stanbic.png",
      lastShared: "2 weeks ago",
    },
    {
      id: "2",
      name: "First National Bank",
      logoUrl: "/assets/botswanalife.png",
      lastShared: "1 month ago",
    },
    {
      id: "3",
      name: "Bomaid",
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
      {/* Scrollable main content only - header/nav are app-level */}
      <ScrollView
        ref={scrollRef}
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  shareFab: {
    position: "absolute",
    bottom: 80, // Above navbar
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#009688",
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