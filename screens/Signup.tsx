import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '@constants/styles';
import { useSQLiteContext } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

// interface User {
//   email: string;
//   name: string;
//   license: string;
//   password: string;
// }

const SignupPage = ({ navigation }: any) => {
    const db = useSQLiteContext(); 
    const [email, setEmail] = useState(""); 
    const [name, setName] = useState("");
    const [license, setLicense] = useState("");
    const [password, setPassword] = useState(""); 
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleSignup() {
      if (password !== confirmPassword) {
        Alert.alert("Password do not match!", "Please try again.");
      }
      else {
        const result =await db.runAsync(
          `INSERT INTO users (
            email,
            password,
            name,
            driver_license_number
          ) VALUES (?, ?, ?, ?)`,
          [
            email,
            password,
            name,
            license
          ]
        )
        // console.log(result.lastInsertRowId, result.changes);
        await AsyncStorage.setItem('userid', result.lastInsertRowId.toString());
        navigation.dispatch(
          CommonActions.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }]
          })
        )
      }
    }
  

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign up</Text>
            <Text style={styles.content}>Email</Text>
            <TextInput 
                style={styles.textbox} 
                keyboardType="email-address" 
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.content}>Full Name</Text>
            <TextInput 
                style={styles.textbox} 
                value={name}
                onChangeText={setName}
            /> 
            <Text style={styles.content}>Driver's License Number</Text>
            <TextInput 
                style={styles.textbox} 
                value={license}
                onChangeText={setLicense}
            />
            <Text style={styles.content}>Password</Text>
            <TextInput 
                style={styles.textbox} 
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <Text style={styles.content}>Confirm Password</Text>
            <TextInput 
                style={styles.textbox}
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.bluebutton}
                    onPress={handleSignup}
                >
                    <Text style={styles.whitebuttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
export default SignupPage;
