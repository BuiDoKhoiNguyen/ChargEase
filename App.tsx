import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNagivation from './App/Navigations/TabNavigation';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { tokenCache } from './App/Utils/Cache';
import LoginScreen from './App/Screen/LoginScreen/LoginScreen';

export default function App() {
  const publishableKey = 'pk_test_cHVtcGVkLXR1bmEtMi5jbGVyay5hY2NvdW50cy5kZXYk'

  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file')
  }

  const [fontsLoaded, fontError] = useFonts({
    'Outfit-Bold': require('./assets/fonts/Outfit-Bold.ttf'),
    'Outfit-Regular': require('./assets/fonts/Outfit-Regular.ttf'),
    'Outfit-SemiBold': require('./assets/fonts/Outfit-SemiBold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey} >
      <View style={styles.container} onLayout={onLayoutRootView}>
        <SignedIn>
          <NavigationContainer>
            <TabNagivation />
          </NavigationContainer>
        </SignedIn>
        <SignedOut>
          <LoginScreen />
        </SignedOut>
        <StatusBar style="auto" />
      </View>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});