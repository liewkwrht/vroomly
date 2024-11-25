import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '@screens/Home';
import MyRental from '@screens/MyRental';
import ProfilePage from '@screens/Profile';
import colors from '@constants/colors';

const Tab = createBottomTabNavigator();

type TabBarIconProps = {
    focused: boolean;
    color: string;
    size: number;
    };

    const MainTabs = () => (
    <Tab.Navigator
        screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.darkGray,
        tabBarStyle: {
            backgroundColor: colors.white,
        }
        }}
    >
        <Tab.Screen
        name="Browse"
        component={Home}
        options={{
            tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="car-outline" size={size} color={color} />
            ),
        }}
        />
        <Tab.Screen
        name="My Rentals"
        component={MyRental}
        options={{
            tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="key-outline" size={size} color={color} />
            ),
        }}
        />
        <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
            tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="person-outline" size={size} color={color} />
            ),
        }}
        />
    </Tab.Navigator>
);

export default MainTabs;