import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "react-native-onboarding-swiper";
import { useNavigation } from "@react-navigation/native";

// Custom Skip Button
const SkipButton = ({ ...props }) => (
  <TouchableOpacity style={styles.skipButton} {...props}>
    <Text style={styles.skipText}>Bỏ qua</Text>
  </TouchableOpacity>
);

// Custom Next Button
const NextButton = ({ ...props }) => (
  <TouchableOpacity style={styles.nextButton} {...props}>
    <Text style={styles.nextText}>Tiếp</Text>
  </TouchableOpacity>
);

// Custom Done Button
const DoneButton = ({ ...props }) => (
  <TouchableOpacity style={styles.doneButton} {...props}>
    <Text style={styles.doneText}>Xong</Text>
  </TouchableOpacity>
);

// Custom Dots Indicator
const Dots = ({ selected }: { selected: boolean }) => (
  <View style={[styles.dot, selected ? styles.activeDot : {}]} />
);

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();

  const handleDone = async () => {
    await AsyncStorage.setItem("onboardingSeen", "true");
    navigation.replace("Login"); // Chuyển đến màn hình Login
  };

  return (
    <Onboarding
      onDone={handleDone}
      onSkip={handleDone}
      NextButtonComponent={NextButton}
      SkipButtonComponent={SkipButton}
      DoneButtonComponent={DoneButton}
      DotComponent={Dots} 
      pages={[
        {
          backgroundColor: "#fff",
          image: <Image source={require("../../../assets/images/onboarding1.png")} style={styles.image} />,
          title: "Chào mừng bạn!",
          subtitle: "Khám phá ứng dụng tuyệt vời của chúng tôi.",
        },
        {
          backgroundColor: "#fff",
          image: <Image source={require("../../../assets/images/onboarding2.png")} style={styles.image} />,
          title: "Tính năng mạnh mẽ",
          subtitle: "Dễ dàng quản lý công việc với các công cụ tiện ích.",
        },
        {
          backgroundColor: "#fff",
          image: <Image source={require("../../../assets/images/onboarding3.png")} style={styles.image} />,
          title: "Bắt đầu ngay!",
          subtitle: "Tạo tài khoản để trải nghiệm ứng dụng.",
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  skipButton: {
    padding: 10,
    position: "absolute",
    left: 20,
    top: 20,
  },
  skipText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
  },
  nextButton: {
    padding: 10,
    marginRight: 10,
  },
  nextText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
  },
  doneButton: {
    padding: 10,
    marginRight: 10,
  },
  doneText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#007AFF",
    width: 10,
    height: 10,
  },
});

export default OnboardingScreen;
