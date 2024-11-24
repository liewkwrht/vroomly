import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../constants/styles";

const CarCard_MyRental = ({ car, rentalDate, onCancel }) => {
    return (
        <View
            style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                marginVertical: 10,
                padding: 15,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 3,
            }}
        >
            {/* Car Image */}
            <View style={{ alignItems: "center", marginBottom: 10 }}>
                <Image
                    source={{ uri: car.image }}
                    style={{
                        width: "70%",
                        height: 150,
                        borderRadius: 10,
                    }}
                    resizeMode="cover"
                />
            </View>

            {/* Car Info */}
            <Text style={[styles.subtitle, { textAlign: "left", marginBottom: 5 }]}>
                {car.model}
            </Text>
            <Text style={[styles.content, { textAlign: "left", marginBottom: 10 }]}>
                ({car.color})
            </Text>

            {/* Rental Date */}
            <Text style={[styles.content, { textAlign: "left", marginBottom: 10 }]}>
                Rental date: {rentalDate}
            </Text>

            {/* Cancel Button */}
            <TouchableOpacity
                style={styles.rentbutton} // Reuse rentbutton style for consistency
                onPress={() => onCancel(car.id)}
            >
                <Text style={styles.whitebuttonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CarCard_MyRental;
