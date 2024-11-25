import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "@constants/styles"; 
import imageMap from "../constants/imageMap";
import colors from "@constants/colors";

const CarCard_Reserved = ({ car }) => { 
    return (
    <View style={[styles.card, { padding: 10 }]}>
      <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
              <Image
                  source={{ uri: car.image }}
                  style={{
                      width: 100,
                      height: 50,
                      borderRadius: 5,
                  }}
                  resizeMode="cover"
              />
          </View>
          <View style={{ marginLeft: 10 }}>
              <Text style={[styles.carTitle, { fontSize: 16 }]}>
                  {car.brand} {car.model}
              </Text>
              <Text style={[styles.carColor, { fontSize: 14 }]}>
                  ({car.color})
              </Text>
              <Text style={[styles.availabilityDate, { fontSize: 12, color: colors.darkGray }]}>
                  Latest available date: {car.next_available_date}
              </Text>
          </View>
      </View>
  </View>
    );
};

export default CarCard_Reserved;
