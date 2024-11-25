import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, FlatList, TouchableOpacity, Modal, ListRenderItem } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DatePicker from "react-native-modern-datepicker";
import { useSQLiteContext } from "expo-sqlite";
import styles from "@constants/styles";
import colors from '@constants/colors';
import CarCard from "@components/CarCard";
import Popuprents from '@components/popuprent';

interface Car {
    id: number;
    brand: string;
    model: string;
    color: string;
    image: string;
}

interface Rental {
    id?: number;
    user_id: string;
    car_id: number;
    rental_date: string;
}

interface RentalCar extends Car {
    rentalDate: string;
}

export default function Home() {
    const navigation = useNavigation();
    const db = useSQLiteContext();
    
    // State management
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [rentPopupVisible, setRentPopupVisible] = useState(false);
    const [availableCars, setAvailableCars] = useState<Car[]>([]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    
    // Date handling
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(formattedToday);

    // Fetch user ID on component mount
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await AsyncStorage.getItem('userid');
                if (id) {
                    setUserId(id);
                    console.log('Fetched User ID:', id);
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    // Database operations
    const fetchAvailableCars = useCallback(async (date: string) => {
        try {
            const result = await db.getAllAsync<Car>(`
                SELECT * 
                FROM cars
                WHERE id NOT IN (
                    SELECT car_id 
                    FROM rentals 
                    WHERE rental_date = ?
                )
            `, [date]);
            
            setAvailableCars(result);
        } catch (error) {
            console.error('Error fetching available cars:', error);
        }
    }, [db]);

    // Refresh data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (userId) {
                fetchAvailableCars(selectedDate);
            }
            return () => {
                // Optional cleanup
            };
        }, [userId, selectedDate, fetchAvailableCars])
    );

    const insertRental = useCallback(async (rental: Rental) => {
        try {
            await db.withTransactionAsync(async () => {
                await db.runAsync(
                    `INSERT INTO rentals (user_id, car_id, rental_date) VALUES (?, ?, ?)`,
                    [rental.user_id, rental.car_id, rental.rental_date]
                );
            });
            await fetchAvailableCars(selectedDate);
        } catch (error) {
            console.error('Error inserting rental:', error);
        }
    }, [db, selectedDate, fetchAvailableCars]);

    // Event handlers
    const handleDatePickerToggle = () => setIsDatePickerOpen(!isDatePickerOpen);

    const handleDateChange = (newDate: string) => {
        const formattedDate = newDate.replace(/\//g, '-');
        setSelectedDate(formattedDate);
        setIsDatePickerOpen(false);
    };

    const handleRentCar = (car: Car) => {
        setSelectedCar(car);
        setRentPopupVisible(true);
    };

    const handleSaveRent = async () => {
        if (!userId || !selectedCar || !selectedDate) return;

        await insertRental({
            user_id: userId,
            car_id: selectedCar.id,
            rental_date: selectedDate,
        });

        setRentPopupVisible(false);
        setSelectedCar(null);
    };

    return (
        <View style={{ flex: 3, backgroundColor: colors.lightGray }}>
            <View style={{
                paddingHorizontal: 20,
                marginTop: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <Text style={[styles.content, styles.topMargin , { marginLeft: 0 }]}>Browse for date:</Text>
                <TouchableOpacity onPress={handleDatePickerToggle} style={[styles.whitebutton, { width: 150 }]}>
                    <Text style={{ fontSize: 16, color: "#000", textAlign: "center" }}>{selectedDate}</Text>
                </TouchableOpacity>

                <Modal animationType="slide" transparent={true} visible={isDatePickerOpen}>
                    <View style={styles.centeredView}>
                        <View style={styles.carView}>
                            <DatePicker
                                mode="calendar"
                                minimumDate={formattedToday}
                                selected={selectedDate}
                                onDateChange={handleDateChange}
                                options={{
                                    defaultFont: 'System',
                                    headerFont: 'System',
                                    textHeaderColor: '#000000',
                                    selectedTextColor: '#FFFFFF',
                                    mainColor: '#000000',
                                    textSecondaryColor: '#000000',
                                    borderColor: 'rgba(122, 146, 165, 0.1)',
                                }}
                            />
                            <TouchableOpacity
                                onPress={handleDatePickerToggle}
                                style={[styles.bluebutton, { marginTop: 20 }]}
                            >
                                <Text style={styles.whitebuttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>

            <Text style={[styles.subtitle, { color: colors.green, textAlign: "center", marginVertical: 10 }]}>
                {availableCars.length} Cars Available 
            </Text>
            
            <FlatList
                data={availableCars}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                renderItem={({ item }) => (
                    <CarCard car={item} onRent={handleRentCar} />
                )}
            />

            {selectedCar && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={rentPopupVisible}
                    onRequestClose={() => setRentPopupVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <Popuprents
                            car={{
                                ...selectedCar,
                                rentalDate: selectedDate,
                            }}
                            onConfirm={handleSaveRent}
                            onClose={() => {
                                setRentPopupVisible(false);
                                setSelectedCar(null);
                            }}
                        />
                    </View>
                </Modal>
            )}
        </View>
    );
}