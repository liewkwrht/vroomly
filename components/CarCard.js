import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../constants/styles"; 

const CarCard = ({ car, onRent }) => { 
    return (
        <View
            style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                marginVertical: 10,
                paddingLeft: 15,
                paddingRight: 15,
                paddingBottom: 15,
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
                    source={{uri: car.image}}
                    style={{
                      width: "80%",
                      height: 140,
                    }}
                    resizeMode="cover"
                />
            </View>

            {/* Car Info */}
            <Text style={[styles.subtitle, { textAlign: "left", marginBottom: 5, fontWeight: 700 }]}>
                {car.brand} {car.model}
            </Text>
            <Text style={[styles.content2, { textAlign: "left", marginBottom: 10 }]}>
                ({car.color})
            </Text>

            {/* Rent Button */}
            <TouchableOpacity style={styles.rentbutton} onPress={() => onRent(car)}>
                <Text style={styles.whitebuttonText}>Rent</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CarCard;
