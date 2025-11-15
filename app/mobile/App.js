import * as React from "react";
import 'react-native-get-random-values';

// Import and configure Amplify BEFORE any Auth usage
import "../../amplifyConfig";
import { Auth } from 'aws-amplify';
// Hub can be imported from 'aws-amplify' (exports Hub) — use that to stay consistent
import { Hub } from 'aws-amplify';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/splashScreen";
import Login from "./screens/login";
import Signup from "./screens/signup";
import ForgotPassword from "./screens/forgotPassword";
import PasswordResetConfirmation from "./screens/passwordResetConfirmation";
import ConfirmSignup from "./screens/confirmSignup";
import Homepage from "../mobile/screens/homepage";
import MyAccountScreen from "./screens/myAccountScreen";
import DocumentsScreen from "./screens/documentScreen";
import AddDocumentScreen from "./screens/addDocument";
import NetworkScreen from "./screens/networkScreen";
import CompanyDetails from "./screens/companyDetails";
import { navigationRef, navigate } from "./services/navigationService";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import NavBar from "./components/navbar";
import { TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  React.useEffect(() => {
    // On mount, check if user is already signed in and navigate
    const checkUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        console.log('Existing authenticated user:', !!user);
        if (user && navigationRef.isReady()) {
          navigationRef.reset({ index: 0, routes: [{ name: 'Homepage' }] });
        }
      } catch (err) {
        // no user signed in
      }
    };

    checkUser();

    // Listen for sign in events from Amplify (hosted UI will emit these)
    const listener = (data) => {
      const { payload } = data;
      if (payload && payload.event === 'signIn') {
        console.log('Hub auth signIn event received');
        if (navigationRef.isReady()) {
          navigationRef.reset({ index: 0, routes: [{ name: 'Homepage' }] });
        }
      }
    };
    if (typeof Hub !== 'undefined' && Hub && typeof Hub.listen === 'function') {
      console.log('Registering Hub listener');
      Hub.listen('auth', listener);
    } else {
      console.warn('Amplify Hub is not available; auth events will not be listened to', Hub);
    }

    return () => {
      try {
        if (typeof Hub !== 'undefined' && Hub && typeof Hub.remove === 'function') {
          Hub.remove('auth', listener);
        }
      } catch (e) {
        // ignore
      }
    };
  }, []);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [currentRoute, setCurrentRoute] = useState('');

  const toggleSidebar = () => setSidebarOpen((s) => !s);
  const closeSidebar = () => setSidebarOpen(false);
  const handleNotificationClick = () => setHasNotifications(false);

  const handleShare = () => {
    // TODO: implement share action or keep as a placeholder
    console.log('Share pressed');
  };

  const handleAddDocument = () => {
    // Navigate to the AddDocument screen
    if (navigationRef.isReady()) {
      navigate('AddDocument');
    } else {
      Alert.alert('Navigation not ready', 'Please try again');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Only render persistent chrome when we know the current route and it's not Login/Signup */}
      {currentRoute && !['Login', 'Signup'].includes(currentRoute) && (
        <>
          <Header onProfileClick={toggleSidebar} onNotificationClick={handleNotificationClick} hasNotifications={hasNotifications} />
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        </>
      )}
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          const r = navigationRef.getCurrentRoute();
          setCurrentRoute(r ? r.name : '');
        }}
        onStateChange={() => {
          const r = navigationRef.getCurrentRoute();
          setCurrentRoute(r ? r.name : '');
        }}
      >
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ConfirmSignup" component={ConfirmSignup} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="PasswordResetConfirmation" component={PasswordResetConfirmation} />
          <Stack.Screen name="Homepage" component={Homepage} />
          <Stack.Screen name="MyAccount" component={MyAccountScreen} options={{ headerShown: true, title: "My Account" }} />
          <Stack.Screen name="Documents" component={DocumentsScreen} />
          <Stack.Screen name="AddDocument" component={AddDocumentScreen} />
          <Stack.Screen name="Network" component={NetworkScreen} />
          <Stack.Screen name="CompanyDetails" component={CompanyDetails} />
        </Stack.Navigator>
      </NavigationContainer>

      {/* Persistent FAB (hidden on Login/Signup) */}
      {currentRoute && !['Login', 'Signup'].includes(currentRoute) && (
        <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 80,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#009688',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5,
        }}
        onPress={() => {
          if (currentRoute === 'Documents') {
            handleAddDocument();
          } else {
            handleShare();
          }
        }}
      >
        <Ionicons name={currentRoute === 'Documents' ? 'add' : 'share-outline'} size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Persistent bottom navbar (hidden on Login/Signup) */}
      {currentRoute && !['Login', 'Signup'].includes(currentRoute) && (
        <NavBar
          activeTab={activeTab}
          onNavigate={(tabId) => {
            setActiveTab(tabId);
            switch (tabId) {
              case 'home':
                navigate('Homepage', { tab: 'home' });
                break;
              case 'documents':
                navigate('Documents');
                break;
              case 'network':
                navigate('Network');
                break;
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}
