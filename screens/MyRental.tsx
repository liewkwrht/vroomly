import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import styles from "../constants/styles";
import colors from "../constants/colors";

interface Rental {
    id: number;
    car_model: string;
    rental_date: string;
}

export default function MyRentals() {
    const navigation = useNavigation();
    const db = useSQLiteContext();
    const [userId, setUserId] = useState<string | null>(null);
    const [rentals, setRentals] = useState<Rental[]>([]);

    // Fetch userId from AsyncStorage
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await AsyncStorage.getItem("userid");
                if (id) {
                    setUserId(id);
                    console.log("Fetched User ID:", id);
                } else {
                    console.error("No User ID found in AsyncStorage.");
                    Alert.alert("Session Expired", "Please log in again.");
                    navigation.navigate("Login" as never);
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
                Alert.alert("Error", "Failed to load user data. Please try again.");
                navigation.navigate("Login" as never);
            }
        };

        fetchUserId();
    }, []);

    // Fetch rentals for the logged-in user
    useEffect(() => {
        if (userId) {
            fetchUserRentals(userId);
        }
    }, [userId]);

    async function fetchUserRentals(userId: string) {
        try {
            const result = await db.getAllAsync<Rental[]>(
                `SELECT rentals.id, cars.model AS car_model, rentals.rental_date 
                 FROM rentals 
                 JOIN cars ON rentals.car_id = cars.id 
                 WHERE rentals.user_id = ?`,
                [userId]
            );

            setRentals(result);
            console.log("Fetched Rentals:", result);
        } catch (error) {
            console.error("Error fetching rentals:", error);
            Alert.alert("Error", "Failed to load your rentals. Please try again.");
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
            <Text style={[styles.title, { marginTop: 20 }]}>My Rentals</Text>

            {rentals.length === 0 ? (
                <Text style={[styles.subtitle, { textAlign: "center", marginTop: 20 }]}>
                    No rentals found.
                </Text>
            ) : (
                <FlatList
                    data={rentals}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.content}>
                                <Text style={styles.bold}>Car Model:</Text> {item.car_model}
                            </Text>
                            <Text style={styles.content}>
                                <Text style={styles.bold}>Rental Date:</Text> {item.rental_date}
                            </Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}
