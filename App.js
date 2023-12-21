import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import MovieScreen from "./src/screens/MovieScreen";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Regular: require("./assets/fonts/Nunito-Regular.ttf"),
    Bold: require("./assets/fonts/Nunito-Bold.ttf"),
    Black: require("./assets/fonts/Nunito-Black.ttf"),
    ExtraBold: require("./assets/fonts/Nunito-ExtraBold.ttf"),
    Extraloght: require("./assets/fonts/Nunito-ExtraLight.ttf"),
    Light: require("./assets/fonts/Nunito-Light.ttf"),
    SemiBold: require("./assets/fonts/Nunito-SemiBold.ttf"),
  });

  useEffect(() => {
    const loadApp = async () => {
      await SplashScreen.preventAutoHideAsync();
      await Promise.all([]);
      await SplashScreen.hideAsync();
    };

    if (!fontsLoaded) {
      loadApp();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="movie" component={MovieScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
