import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '@constants/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSQLiteContext } from 'expo-sqlite';

export default function LoginPage({ navigation }: any) {
    const db = useSQLiteContext(); 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                Alert.alert("Error", "Please enter both email and password");
                return;
            }

            type User = { id: number; email: string; password: string }; 
            const result: User[] = await db.getAllAsync(
                "SELECT * FROM users WHERE email = ? AND password = ?",
                [email, password]
            );
    
            if (result.length > 0) {
                const userId = result[0].id; 
                await AsyncStorage.setItem('userid', userId.toString());
                console.log(`User ID stored: ${userId}`);
                
                // Clear the form
                setEmail("");
                setPassword("");
                
                // Navigate to MainTabs
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                });
            } else {
                Alert.alert("Invalid credentials", "Please check your email and password.");
            }
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log in</Text>
            <Text style={{ marginBottom: 20 }} />
            <Text style={styles.content}>Email</Text>
            <TextInput 
                style={styles.textbox} 
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.content}>Password</Text>
            <TextInput 
                style={styles.textbox} 
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <Text style={{ marginBottom: 10 }} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.bluebutton}
                    onPress={handleLogin}
                >
                    <Text style={styles.whitebuttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
