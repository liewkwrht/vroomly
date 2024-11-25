import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, SectionList, TouchableOpacity, Modal } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DatePicker from "react-native-modern-datepicker";
import { useSQLiteContext } from "expo-sqlite";
import styles from "@constants/styles";
import colors from '@constants/colors';
import CarCard from "@components/CarCard";
import CarCard_Reserved from '@components/CarCard_Reserved';
import Popuprents from '@components/popuprent';
import { format } from 'date-fns';

interface Car {
    id: number;
    brand: string;
    model: string;
    color: string;
    image: string;
}

interface UnavailableCar {
  id: number;
  brand: string;
  model: string;
  color: string;
  image: string;
  next_available_date: string;
}

interface Rental {
    id?: number;
    user_id: string;
    car_id: number;
    rental_date: string;
}

interface Section {
    title: string;
    color: string;
    count: number;
    data: Car[];
}

export default function Home() {
    const navigation = useNavigation();
    const db = useSQLiteContext();
    
    // State management
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [rentPopupVisible, setRentPopupVisible] = useState(false);
    const [availableCars, setAvailableCars] = useState<Car[]>([]);
    const [reservedCars, setReservedCars] = useState<UnavailableCar[]>([]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    
    // Date handling
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(formattedToday);

    // Prepare sections data
    const sections: Section[] = [
        {
            title: "Cars Available",
            color: colors.green,
            count: availableCars.length,
            data: availableCars
        },
        {
            title: "Cars Reserved",
            color: colors.red,
            count: reservedCars.length,
            data: reservedCars
        }
    ];

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

    const fetchReservedCars = useCallback(async (inputDate: string) => {
      try {
          // Format the input date to ensure consistency
          const date = format(new Date(inputDate), 'yyyy-MM-dd');
  
          // Updated query with explicit date casting
          const result = await db.getAllAsync<UnavailableCar>(`
            SELECT 
                c.*,
                MIN(CASE 
                    WHEN DATE(r.rental_date) >= DATE(?) 
                    AND NOT EXISTS (
                        SELECT 1 
                        FROM rentals r2 
                        WHERE r2.car_id = c.id 
                        AND DATE(r2.rental_date) = DATE(r.rental_date, '+1 day')
                    )
                    THEN DATE(r.rental_date, '+1 day')
                END) AS next_available_date
            FROM cars c
            LEFT JOIN rentals r ON c.id = r.car_id
            GROUP BY c.id
            HAVING c.id IN (
                SELECT car_id 
                FROM rentals 
                WHERE rental_date = ?
            )
          `, [date, date]);
          
    
            setReservedCars(result);
      } catch (error) {
        console.error('Error fetching reserved cars:', error);
      }
    }, [db]);
  

    // Refresh data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (userId) {
                fetchAvailableCars(selectedDate);
                fetchReservedCars(selectedDate);
            }
        }, [userId, selectedDate, fetchAvailableCars, fetchReservedCars])
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
            await fetchReservedCars(selectedDate);
        } catch (error) {
            console.error('Error inserting rental:', error);
        }
    }, [db, selectedDate, fetchAvailableCars, fetchReservedCars]);

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

    const renderSectionHeader = ({ section }: { section: Section }) => (
        <Text style={[styles.subtitle, { color: section.color, textAlign: "center", marginVertical: 10, backgroundColor: colors.lightGray, paddingVertical: 10 }]}>
            {section.count} {section.title}
        </Text>
    );

    const renderItem = ({ item, section }: { item: Car; section: Section }) => (
        section.title === "Cars Available" ? (
            <CarCard car={item} onRent={handleRentCar} />
        ) : (
            <CarCard_Reserved car={item} />
        )
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
            <View style={{
                paddingHorizontal: 20,
                marginTop: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <Text style={[styles.content, styles.topMargin, { marginLeft: 0 }]}>Browse for date:</Text>
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

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                stickySectionHeadersEnabled={false}
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