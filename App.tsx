import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Provider } from "react-redux";
import store from './App/Utils/Redux/Store';
import AuthNavigation from './App/Navigations/AuthNavigation';
import TabNagivation from './App/Navigations/TabNavigation';
import SplashScreenComponent from './App/Screens/SplashScreen/SplashScreen';
import { tokenCache } from './App/Utils/Cache';

SplashScreen.preventAutoHideAsync();

export default function App() {
  // const publishableKey = 'pk_test_YXJ0aXN0aWMtbmFyd2hhbC03NS5jbGVyay5hY2NvdW50cy5kZXYk'

  const publishableKey = 'pk_test_cGVhY2VmdWwtZGlub3NhdXItMjguY2xlcmsuYWNjb3VudHMuZGV2JA';

  const [appReady, setAppReady] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  const [fontsLoaded, fontError] = useFonts({
    'Outfit-Bold': require('./assets/fonts/Outfit-Bold.ttf'),
    'Outfit-Regular': require('./assets/fonts/Outfit-Regular.ttf'),
    'Outfit-SemiBold': require('./assets/fonts/Outfit-SemiBold.ttf'),
  });

  useEffect(() => {
    const prepareApp = async () => {
      try {
        if (!fontsLoaded && !fontError) return;

        await new Promise(resolve => setTimeout(resolve, 2000));

        setAppReady(true);
      } catch (e) {
        console.warn(e);
      }
    };

    prepareApp();
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return <SplashScreenComponent />;
  }

  return (
    <Provider store={store}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <NavigationContainer onReady={onLayoutRootView}>
          <SignedIn>
            <TabNagivation />
          </SignedIn>
          <SignedOut>
            <AuthNavigation />
          </SignedOut>
        </NavigationContainer>
        <StatusBar style="auto" />
      </ClerkProvider>
    </Provider>
  );
}
