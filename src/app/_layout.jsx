import { Stack } from "expo-router";
import "../../global.css";
import React, { Fragment, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import config from '../../tamagui.config';
import { TamaguiProvider } from "tamagui";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'GeistMono-Regular': require('../../assets/fonts/geistMono/GeistMono-Regular.ttf'),
    'GeistMono-Bold': require('../../assets/fonts/geistMono/GeistMono-Bold.ttf'),
    'GeistMono-Medium': require('../../assets/fonts/geistMono/GeistMono-Medium.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null; // Tambahkan agar tidak crash saat font belum dimuat

  return (
    <TamaguiProvider config={config}>
    <Fragment>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: true}}>
        <Stack.Screen name="cameraPage" options={{ headerShown: false, animation: 'slide_from_bottom'}} />
        <Stack.Screen name="qrisPage" options={{
          headerShown: true,
          headerTitle: "Isi nominal 2",
          headerShadowVisible: false,
          animation: 'slide_from_right',
          headerTitleStyle:{
            fontFamily: 'GeistMono-Bold',
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: '#BFF0CD',
          },
        }} />
        <Stack.Screen name="index" options={{ 
          headerShown: true, 
          headerTitle: "QRIS converter", 
          headerStyle: {
            backgroundColor: '#BFF0CD',
          },
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: 'GeistMono-Bold', // ✅ Gunakan font yang kamu daftarkan
          },
          headerBackVisible: false,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          animation: 'none'
        }} />
      </Stack>
    </Fragment>
    </TamaguiProvider>
  );
}
