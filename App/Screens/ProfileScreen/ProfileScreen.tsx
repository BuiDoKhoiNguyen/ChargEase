import { View, Text, Button } from 'react-native';
import React from 'react';
import { useAuth } from '@clerk/clerk-expo';

export default function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Profile Screen</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
}