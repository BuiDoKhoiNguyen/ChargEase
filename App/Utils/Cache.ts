import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { TokenCache } from '@clerk/clerk-expo/dist/cache';

const createTokenCache = (): TokenCache => ({
    async getToken(key: string): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (err) {
            console.error('Error getting token:', err);
            return null;
        }
    },
    async saveToken(key: string, value: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (err) {
            console.error('Error saving token:', err);
        }
    },
});

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined;