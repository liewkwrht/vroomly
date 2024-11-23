import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../constants/styles"; // Adjust the path as needed
import imageMap from "../constants/imageMap"; // Import your image mapping

const CarCard = ({ car, onRent }) => { // Accept onRent as a prop
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
                    source={imageMap[car.image]} // Get the image path from the mapping
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

            {/* Rent Button */}
            <TouchableOpacity style={styles.rentbutton} onPress={() => onRent(car)}> {/* Pass car data */}
                <Text style={styles.whitebuttonText}>Rent</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CarCard;
