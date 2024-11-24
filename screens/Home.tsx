import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "@constants/styles";
import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from '@react-navigation/native';
import DatePicker from "react-native-modern-datepicker";
import CarCard from "@components/CarCard";
import { useSQLiteContext } from "expo-sqlite";
import Popuprents from '@components/popuprent';
import colors from '@constants/colors';

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

export default function Home() {
    const navigation = useNavigation();
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [rentPopupVisible, setRentPopupVisible] = useState(false);
    const [data, setData] = useState<Car[]>([]);
    const [open, setOpen] = useState(false);
    
    const db = useSQLiteContext();

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('userid');
            if (id) {
                setUserId(id);
                console.log('Fetched User ID:', id);
            }
        };

        fetchUserId();
    }, []);

    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [date, setDate] = useState(formattedToday);

    useEffect(() => {
        if (userId) {
            db.withTransactionAsync(async () => {
                await getAvailableCars(date);
            });
        }
    }, [userId, date]);

    async function getAvailableCars(selectedDate: string) {
        const result = await db.getAllAsync(`
            SELECT * 
            FROM cars
            WHERE id NOT IN (
                SELECT car_id 
                FROM rentals 
                WHERE rental_date = ?
            )
        `, [selectedDate]);

        setData(result as Car[]);
    }

    function handleOnPress() {
        setOpen(!open);
    }

    function handleChange(selectedDate: string) {
        const formattedDate = selectedDate.replace(/\//g, '-');
        setDate(formattedDate);
        setOpen(false);
    }

    const handleRentCar = (car: Car) => {
        setSelectedCar(car);
        setRentPopupVisible(true);
    };

    async function insertRental(insertrental: Rental) {
        await db.withTransactionAsync(async () => {
            await db.runAsync(
                `INSERT INTO rentals (user_id, car_id, rental_date) VALUES (?, ?, ?)`,
                [
                    insertrental.user_id,
                    insertrental.car_id,
                    insertrental.rental_date,
                ]
            );
        });

        await getAvailableCars(date);
    }
    
    async function handleSaveRent() {
        if (!userId || !selectedCar || !date) return;

        await insertRental({
            user_id: userId,
            car_id: selectedCar.id,
            rental_date: date,
        });

        setRentPopupVisible(false);
        setSelectedCar(null);
    }
    

    return (
        <View style={{ flex: 3, backgroundColor: colors.lightGray }}>
            <View
                style={{
                    paddingHorizontal: 20,
                    marginTop: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text style={[styles.content, { marginLeft: 0 }]}>Browse for date:</Text>
                <TouchableOpacity onPress={handleOnPress} style={[styles.textbox, { width: 150 }]}>
                    <Text style={{ fontSize: 16, color: "#000", textAlign: "center" }}>{date}</Text>
                </TouchableOpacity>

                <Modal animationType="slide" transparent={true} visible={open}>
                    <View style={styles.centeredView}>
                        <View style={styles.carView}>
                            <DatePicker
                                mode="calendar"
                                minimumDate={formattedToday}
                                selected={date}
                                onDateChange={handleChange}
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
                                onPress={handleOnPress}
                                style={[styles.bluebutton, { marginTop: 20 }]}
                            >
                                <Text style={styles.whitebuttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>

            <Text style={[styles.subtitle, { color: colors.green, textAlign: "center", marginVertical: 10 }]}>
                {data.length} Cars Available 
            </Text>
            <FlatList
                data={data}
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
                                rentalDate: date,
                            }}
                            onConfirm={async () => {
                                await handleSaveRent();
                                setRentPopupVisible(false); 
                            }}
                            onClose={() => setRentPopupVisible(false)} 
                        />
                    </View>
                </Modal>
            )}
        </View>
    );
}
