import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import BrowseIcon from "@assets/icons/browse_blue.svg"; // Adjusted the path
import CarRentalIcon from "@assets/icons/car_rental.svg";
import PersonIcon from "@assets/icons/person_blue.svg";

// Screens
import Home from "@screens/Home";
import MyRentals from "@screens/MyRentals";
import Profile from "@screens/Profile";

const Tab = createBottomTabNavigator();

export default function MenuButton() {
    return (
        <NavigationContainer>
        <Tab.Navigator
            screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
                // Determine which icon to render based on the route
                if (route.name === "Browse") {
                return <BrowseIcon width={24} height={24} fill={focused ? "blue" : "gray"} />;
                } else if (route.name === "My Rentals") {
                return <CarRentalIcon width={24} height={24} fill={focused ? "blue" : "gray"} />;
                } else if (route.name === "Profile") {
                return <PersonIcon width={24} height={24} fill={focused ? "blue" : "gray"} />;
                }
            },
            tabBarActiveTintColor: "blue",
            tabBarInactiveTintColor: "gray",
            headerShown: false, // Hide the header for each screen
            })}
        >
            <Tab.Screen name="Browse" component={Home} />
            <Tab.Screen name="My Rentals" component={MyRentals} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
        </NavigationContainer>
    );
}
