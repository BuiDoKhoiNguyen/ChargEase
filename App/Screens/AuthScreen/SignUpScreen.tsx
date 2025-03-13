import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Platform, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../Utils/Colors';
import { auth, db } from '../../Utils/FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage } from '../../Utils/FirebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';

const SignUpScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `avatars/${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSignUp = async () => {
    if (loading) return;
    if (!email || !password || !fullName || !gender || !dob) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = null;
      if (avatar) {
        photoURL = await uploadImage(avatar);
      }

      await updateProfile(user, {
        displayName: fullName,
        photoURL: photoURL
      });

      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        phoneNumber,
        gender,
        dateOfBirth: dob,
        photoURL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      Alert.alert(
        'Success',
        'Account created successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
    setDob(currentDate.toLocaleDateString());
  };

  return (
    <TouchableWithoutFeedback onPress={() => { setShowPicker(false); Keyboard.dismiss(); }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={{ alignSelf: 'flex-start', marginTop: 60 }}>
            <Feather name='arrow-left' size={24} color='black' onPress={() => navigation.goBack()} />
          </View>
          <Text style={styles.title}>Complete your profile 📋</Text>
          <Text style={styles.subtitle}>
            Don't worry, only you can see your personal data. No one else will be able to see it.
          </Text>

          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Image
              source={avatar ? { uri: avatar } : require('../../../assets/images/avt-placeholder.png')}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
              <FontAwesome name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={gender} itemStyle={{ fontSize: 16, fontWeight: 'semibold' }} onValueChange={(itemValue) => setGender(itemValue)}>
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>

          <Text style={styles.label}>Date of Birth</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="MM/DD/YYYY"
              value={dob}
              editable={false}
            />
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <MaterialIcons name="calendar-today" size={24} color="#999" style={styles.icon} />
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter Password"
              secureTextEntry={!passwordVisible}
              textContentType='none'
              value={password}
              onChangeText={setPassword}
            />
            <Feather
              name={passwordVisible ? "eye" : "eye-off"}
              size={24}
              color="#999"
              style={styles.icon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Confirm Password"
              textContentType='none'
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Feather
              name={confirmPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color="#999"
              style={styles.icon}
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  avatarContainer: {
    marginTop: 20,
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#34D399',
    borderRadius: 12,
    padding: 5,
  },
  label: {
    width: '100%',
    textAlign: 'left',
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  },
  textInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 5,
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 5,
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingRight: 15,
  },
  icon: {
    marginLeft: 10,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;