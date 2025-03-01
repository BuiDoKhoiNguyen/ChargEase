import React from 'react';
import * as WebBrowser from "expo-web-browser";
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from './../../Utils/Colors';
import { useWarmUpBrowser } from '../../../hooks/warmUpBrowser'
import { useSSO } from '@clerk/clerk-expo';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const onPress = async()=>{
    try {
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
      })
 
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
      <Image
        source={require('../../../assets/images/logo2.png')}
        style={styles.logoImage}
      />
      <Image
        source={require('../../../assets/images/evchargin.jpeg')}
        style={styles.bgImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Your Ultimate EV Charging finder App</Text>
        <Text style={styles.desc}>Find EV Charging station near you, plan a trip and much more in just one click</Text>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Login with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  logoImage: {
    width: 200,
    height: 40,
  },
  bgImage: {
    width: '100%',
    height: 220,
    marginTop: 20,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 25,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    marginTop: 20,
  },
  desc: {
    fontSize: 17,
    fontFamily: 'outfit',
    marginTop: 15,
    textAlign: 'center',
    color: Colors.GRAY,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    display: 'flex',
    borderRadius: 40,
    marginTop: 40,
  },
  buttonText: {
    color: Colors.WHITE,
    textAlign: 'center',
    fontFamily: 'outfit',
    fontSize: 17,
  },
});

export default LoginScreen;