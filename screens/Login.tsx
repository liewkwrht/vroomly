import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../constants/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSQLiteContext } from 'expo-sqlite';

export default function LoginPage({ navigation }: any) {
    const db = useSQLiteContext(); 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 

    const handleLogin = async () => {
        try {
            // Define the type of result
            type User = { id: number; email: string; password: string }; 
            const result: User[] = await db.getAllAsync(
                "SELECT * FROM users WHERE email = ? AND password = ?",
                [email, password]
            );
    
            if (result.length > 0) {
                const userId = result[0].id; 
                await AsyncStorage.setItem('userid', userId.toString());
                console.log(`User ID stored: ${userId}`);
                
                navigation.navigate('MainTabs');
            } else {
                // Show an alert if the credentials are invalid
                Alert.alert("Wrong E-mail or Password.", "Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Error", "An unexpected error occurred.");
        }
    };
    
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log in</Text>
            <Text style={{ marginBottom: 20 }} />
            <Text style={styles.content}>Email</Text>
            <TextInput 
                style={styles.textbox} 
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email} // Controlled input
                onChangeText={setEmail} // Update email state
            />
            <Text style={styles.content}>Password</Text>
            <TextInput 
                style={styles.textbox} 
                placeholder="Enter your password"
                secureTextEntry={true}
                value={password} // Controlled input
                onChangeText={setPassword} // Update password state
            />
            <Text style={{ marginBottom: 10 }} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.bluebutton}
                    onPress={handleLogin} // Call handleLogin function
                >
                    <Text style={styles.whitebuttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
