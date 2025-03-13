
import LoginScreen from '../Screens/AuthScreen/LoginScreen';
import SignUpScreen from '../Screens/AuthScreen/SignUpScreen';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../Screens/OnboardingScreen/OnboardingScreen';

const Stack = createStackNavigator();

export default function AuthNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      {/* <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} /> */}
      {/* <Stack.Screen name="OTPVerificationScreen" component={OTPVerificationScreen} /> */}
    </Stack.Navigator>
  );
}