import React from 'react';
import * as WebBrowser from "expo-web-browser";
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../../Utils/Colors';
import { useWarmUpBrowser } from '../../../hooks/warmUpBrowser'
import { useAuth, useSSO } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { OAuthStrategy } from '@clerk/types';


WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  useWarmUpBrowser();
  const navigation = useNavigation<any>();
  const { signOut, isSignedIn } = useAuth();

  const { startSSOFlow } = useSSO();
  const onPress = async (newStrategy: OAuthStrategy | "enterprise_sso") => {
    try {
      if (isSignedIn) {
        await signOut();
      }
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow(
        newStrategy === 'enterprise_sso'
          ? { strategy: 'enterprise_sso', identifier: 'your-identifier' }
          : { strategy: newStrategy }
      );

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/logo-app.png')} style={styles.logo} />
      <Image source={require('../../../assets/images/evchargin.jpeg')} style={styles.illustration} />

      <Text style={styles.title}>Let's you in</Text>
      <TouchableOpacity style={styles.button} onPress={() => onPress('oauth_google')}>
        <Image
          source={{ uri: "https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-1024.png" }}
          style={{ width: 30, height: 30 }}
        />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => onPress('oauth_facebook')}>
        <Ionicons name="logo-facebook" size={30} color="#1877F2" />
        <Text style={styles.buttonText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => onPress('oauth_facebook')}>
        <Ionicons name="logo-apple" size={30} color="black" />
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.divider} />
      </View>

      <TouchableOpacity
        style={styles.phoneButton}
      // onPress={() => navigation.navigate('PhoneLogin')}
      >
        <Text style={styles.phoneButtonText}>Sign in with Phone Number</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate('SignUp')}
          >
            Sign up
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 500,
    height: 200,
    resizeMode: 'contain',
  },
  illustration: {
    width: 300,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 16,
  },
  phoneButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  phoneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    marginTop: 20,
    gap: 5,
  },
  signupText: {
    fontSize: 16,
    color: 'black',
  },
  signupLink: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  },
});

export default LoginScreen;