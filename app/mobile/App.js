import * as React from "react";
import 'react-native-get-random-values';

import "../../amplifyConfig";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/splashScreen";
import Login from "./screens/login";
import Signup from "./screens/signup";
import ForgotPassword from "./screens/forgotPassword";
import PasswordResetConfirmation from "./screens/passwordResetConfirmation";
import Homepage from "../mobile/screens/homepage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="PasswordResetConfirmation" component={PasswordResetConfirmation}/>
        <Stack.Screen name="Homepage" component={Homepage}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
