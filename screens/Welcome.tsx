import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '@constants/colors';
import styles from '@constants/styles';
import { Image } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

const WelcomePage = ({ navigation }: any) => {

    const db = useSQLiteContext(); 

    const preloadImages = async () => {

      type CarImageURI = { image: string; }; 
      const result: CarImageURI[] = await db.getAllAsync(
          "SELECT image FROM cars"
      );

      const uris = result.map((car) => car.image);

      for (const uri of uris) {
        console.log(`Preloading image: ${uri}`);
      } 

      const cachePromises = uris.map((uri) => Image.prefetch(uri));
      await Promise.all(cachePromises);
    };

    useEffect(() => {
      const loadAssets = async () => {
        await preloadImages();
      };
      loadAssets();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={style.band}>vroomly</Text>
            <Text style={{ marginBottom: 20 }} />
            <Text style={style.quote}>Rent, Ride, Repeat</Text>
            <Text style={{ marginBottom: 40 }} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.bluebutton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.whitebuttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.whitebutton}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={styles.bluebuttonText}>Signup</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    band: {
        fontFamily: "Outfit",
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.primary,
    },
    quote: {
        fontFamily: "Outfit",
        fontSize: 24,
        fontWeight: 'normal',
        color: colors.primary,
    },
});

export default WelcomePage;
