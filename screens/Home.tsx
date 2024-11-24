import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import styles from "../constants/styles";
import DatePicker from "react-native-modern-datepicker";
import CarCard from "../components/CarCard";
import { useSQLiteContext } from "expo-sqlite";
import Popuprents from '../components/popuprent';
import colors from '../constants/colors';
interface Car {
    id: number;
    model: string;
    color: string;
    image: string;
    imageUrl: string;
}

interface Rental {
    id?: number;
    user_id: string;
    car_id: number;
    rental_date: string;
}

export default function Home() {
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [rentPopupVisible, setRentPopupVisible] = useState(false);
    
    const db = useSQLiteContext();

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('userid');
            setUserId(id);
        };

        fetchUserId();
    }, []);

    const [data, setData] = React.useState<Car[]>([]);
    const [open, setOpen] = React.useState(false);
    
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [date, setDate] = React.useState(formattedToday);

    React.useEffect(() => {
        db.withTransactionAsync(async () => {
            await getAvailableCars(date);
        });
    }, []);

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

        db.withTransactionAsync(async () => {
            await getAvailableCars(formattedDate);
        });
    }

    const handleRentCar = (car: Car) => {
        setSelectedCar(car);
        setRentPopupVisible(true);
    };

    const handleConfirmRent = async () => {
        const rental: Rental = {
            user_id: userId!,
            car_id: selectedCar!.id,
            rental_date: date
        };

        await db.runAsync(`
            INSERT INTO rentals (user_id, car_id, rental_date)
            VALUES (?, ?, ?)
            RETURNING id
        `, [rental.user_id, rental.car_id, rental.rental_date]);

        await getAvailableCars(date);

        setRentPopupVisible(false);
        setSelectedCar(null);
    };

    return (
        <View style={{ flex: 3, backgroundColor: colors.lightGray}}>
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
                        <View style={styles.modelView}>
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

            <Text style={[styles.subtitle, { textAlign: "center", marginVertical: 10 }]}>
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
                                rentalDate: date
                            }}
                            onConfirm={handleConfirmRent}
                        />
                    </View>
                </Modal>
            )}
        </View>
    );
}
