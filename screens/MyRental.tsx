import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import CarCard_MyRental from "@components/CarCard_MyRental";
import styles from "@constants/styles";
import colors from "@constants/colors";

interface Car {
    id: number;
    brand: string;
    model: string;
    color: string;
    image: string;
    rental_date: string; 
}

  export default function MyRental() {
    const navigation = useNavigation();
    const [userId, setUserId] = useState<string | null>(null);
    const [rentedCars, setRentedCars] = useState<Car[]>([]);
    const db = useSQLiteContext();

    useFocusEffect(
        React.useCallback(() => {
            const fetchUserData = async () => {
                try {
                    const id = await AsyncStorage.getItem("userid");
                    if (id) {
                        setUserId(id);
                        console.log("Fetched User ID:", id);
                        fetchRentedCars(id);
                    } else {
                        console.error("No User ID found in AsyncStorage.");
                        navigation.navigate("Login" as never);
                    }
                } catch (error) {
                    console.error("Error fetching user ID:", error);
                    Alert.alert("Error", "Failed to load user data. Please try again.");
                    navigation.navigate("Login" as never);
                }
            };

            fetchUserData();
        }, [])
    );

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const id = await AsyncStorage.getItem("userid");
            if (id) {
            setUserId(id);
            console.log("Fetched User ID:", id);
            fetchRentedCars(id);
            } else {
            console.error("No User ID found in AsyncStorage.");
            navigation.navigate("Login" as never);
            }
        } catch (error) {
            console.error("Error fetching user ID:", error);
            Alert.alert("Error", "Failed to load user data. Please try again.");
            navigation.navigate("Login" as never);
        }
        };

        fetchUserData();
    }, []);

    const fetchRentedCars = async (user_id: string) => {
        try {
        const result = await db.getAllAsync(
            `
            SELECT c.*, r.rental_date
            FROM cars c
            JOIN rentals r ON c.id = r.car_id
            WHERE r.user_id = ?
        `,
            [user_id]
        );
        setRentedCars(result as Car[]);
        } catch (error) {
        console.error("Error fetching rented cars:", error);
        Alert.alert("Error", "Failed to load your rented cars.");
        }
    };

    const handleCancelRental = async (carId: number, rentalDate: string) => {
        Alert.alert(
        "Cancel Rental",
        "Are you sure you want to cancel this rental?",
        [
            { text: "No", style: "cancel" },
            {
            text: "Yes",
            onPress: async () => {
                try {
                await db.runAsync(
                    "DELETE FROM rentals WHERE car_id = ? AND rental_date = ?",
                    [carId, rentalDate]
                );
                console.log(`Rental for car ID ${carId} canceled.`);
                // Refresh the rented cars list
                if (userId) await fetchRentedCars(userId);
                } catch (error) {
                console.error("Error canceling rental:", error);
                Alert.alert("Error", "Failed to cancel the rental.");
                }
            },
            },
        ]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
        <Text style={[styles.subtitle, styles.topMargin2, { textAlign: "center", marginVertical: 10 }]}>
            {rentedCars.length} Rentals
        </Text>
        <FlatList<Car>
            data={rentedCars}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }: { item: Car }) => (
            <CarCard_MyRental
          car={item}
          rentalDate={item.rental_date}
          onCancel={(carId: number) => handleCancelRental(carId, item.rental_date)}
            />
            )}
        />
        </View>
    );
    }
