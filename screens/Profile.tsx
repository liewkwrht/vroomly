import { useSQLiteContext } from "expo-sqlite";
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TextInput,
    TouchableOpacity,
    ScrollView
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import WelcomePage from "./Welcome";

interface UserData {
    name: string;
    email: string;
    driver_license_number: string;
}

export default function Profile() {
    const navigation = useNavigation();
    const db = useSQLiteContext();
    const [user, setUser] = useState<UserData>({ 
        name: "", 
        email: "", 
        driver_license_number: "" 
    });
    const [userId, setUserId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<UserData>({
        name: "",
        email: "",
        driver_license_number: ""
    });
    
    useEffect(() => {
        const getUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userid');
                console.log('Retrieved userId from storage:', storedUserId);
                if (storedUserId) {
                    setUserId(storedUserId);
                } else {
                    console.error('No user ID found in storage');
                    Alert.alert('Error', 'Please login again');
                    navigation.navigate('Login' as never);
                }
            } catch (error) {
                console.error('Error getting userId from storage:', error);
                Alert.alert('Error', 'Failed to load user data');
            }
        };

        getUserId();
    }, []);

    // Second useEffect to fetch user data once we have the userId
    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const fetchUserData = async () => {
        try {
            const result = await db.getAllAsync<UserData[]>(
                `SELECT name, email, driver_license_number 
                 FROM users 
                 WHERE id = ?`,
                [userId]
            );

            if (result && result.length > 0) {
                console.log('Fetched user data:', result[0]);
                setUser(result[0]);
                setEditedUser(result[0]); // Initialize edited user with current data
            } else {
                console.error('No user found with ID:', userId);
                Alert.alert('Error', 'User not found');
                await AsyncStorage.removeItem('userid');
                navigation.navigate('Login' as never);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'Failed to load user information');
        }
    };

    const handleStartEdit = () => {
        setIsEditing(true);
        setEditedUser(user);
    };
    const gosignout= () =>{
        navigation.navigate(WelcomePage);
    }

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedUser(user);
    };

    const handleSaveChanges = async () => {
        try {
            // Basic validation
            if (!editedUser.email || !editedUser.name || !editedUser.driver_license_number) {
                Alert.alert('Error', 'All fields are required');
                return;
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(editedUser.email)) {
                Alert.alert('Error', 'Please enter a valid email address');
                return;
            }

            await db.withTransactionAsync(async () => {
                await db.runAsync(
                    `UPDATE users 
                     SET name = ?, email = ?, driver_license_number = ? 
                     WHERE id = ?`,
                    [editedUser.name, editedUser.email, editedUser.driver_license_number, userId]
                );
            });

            setUser(editedUser);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Error updating user data:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>Profile</Text>

                {!isEditing ? (
                    // View Mode
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Name:</Text>
                            <Text style={styles.infoText}>{user.name || 'Loading...'}</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Email:</Text>
                            <Text style={styles.infoText}>{user.email || 'Loading...'}</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Driver License:</Text>
                            <Text style={styles.infoText}>
                                {user.driver_license_number || 'Loading...'}
                            </Text>
                        </View>

                        <TouchableOpacity 
                            style={styles.editButton}
                            onPress={handleStartEdit}
                        >
                            <Text style={styles.buttonText}>Edit Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.Button}
                            onPress={gosignout}
                        >
                            <Text style={styles.buttonText}>Sign Out</Text>
                        </TouchableOpacity>

                    </>
                ) : (
                    // Edit Mode
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Name:</Text>
                            <TextInput
                                style={styles.input}
                                value={editedUser.name}
                                onChangeText={(text) => setEditedUser({...editedUser, name: text})}
                                placeholder="Enter your name"
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Email:</Text>
                            <TextInput
                                style={styles.input}
                                value={editedUser.email}
                                onChangeText={(text) => setEditedUser({...editedUser, email: text})}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Driver License:</Text>
                            <TextInput
                                style={styles.input}
                                value={editedUser.driver_license_number}
                                onChangeText={(text) => setEditedUser({...editedUser, driver_license_number: text})}
                                placeholder="Enter your driver license number"
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style={[styles.button, styles.saveButton]}
                                onPress={handleSaveChanges}
                            >
                                <Text style={styles.buttonText}>Save Changes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleCancelEdit}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: { 
        flex: 1, 
        alignItems: "center", 
        padding: 20,
        backgroundColor: '#fff'
    },
    title: { 
        fontSize: 32, 
        fontWeight: "bold", 
        marginBottom: 20 
    },
    section: { 
        width: "100%", 
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8
    },
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: "bold", 
        marginBottom: 5,
        color: '#333'
    },
    infoText: { 
        fontSize: 16,
        color: '#666'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 8,
        fontSize: 16,
        backgroundColor: '#fff',
        marginTop: 5
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20
    },
    button: {
        padding: 12,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
        marginTop: 20
    },
    saveButton: {
        backgroundColor: '#4CD964',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});