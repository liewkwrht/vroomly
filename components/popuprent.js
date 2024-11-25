import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const Popuprents = ({ car, onConfirm, onClose }) => {
    if (!car) return null; // Safeguard for null or undefined car

    return (
        <View style={styles.cardContainer}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Rent the following car?</Text>

            {/* Car Image */}
            <Image source={{ uri: car.image }} style={styles.carImage} />

            {/* Car Info */}
            <Text style={styles.carModel}>{car.brand} {car.model}</Text>
            <Text style={styles.carColor}>({car.color})</Text>

            {/* Rental Date */}
            <Text style={styles.rentalDate}>Rental date: {car.rentalDate}</Text>

            {/* Confirm Button */}
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
        width: 300,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#eee",
        borderRadius: 20,
        padding: 5,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "gray",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    carImage: {
        width: 200,
        height: 100,
        resizeMode: "contain",
        marginBottom: 10,
    },
    carModel: {
        fontSize: 16,
        fontWeight: "bold",
    },
    carColor: {
        fontSize: 14,
        color: "gray",
        marginBottom: 10,
    },
    rentalDate: {
        fontSize: 14,
        marginBottom: 20,
    },
    confirmButton: {
        backgroundColor: "#007bff",
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
    },
    confirmButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Popuprents;
