import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
    container: {
        flex: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,  // Using color from constants
    },
    title: {
        fontFamily: 'Outfit',
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.darkGray, // Using color from constants
    },
    subtitle: {
        fontFamily: 'Outfit',
        fontSize: 24,
        color: colors.darkGray,     // Using color from constants
    },
    content: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: colors.darkGray, 
        alignSelf: 'flex-start', 
        marginLeft: 50,
        marginBottom: 8          
    },
    buttonContainer: {
        fontFamily: "Outfit",
        flexDirection: 'column',  
        justifyContent: 'center',
        alignItems: 'center',
    },
    bluebutton: {
        fontFamily: "Outfit",
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 1,
        borderRadius: 30,
        marginVertical: 10, 
        width: 158,
        height: 41,
        justifyContent: 'center',
        alignItems: 'center',
    },
    whitebutton: {
        fontFamily: "Outfit",
        backgroundColor: colors.white, // White background
        borderColor: colors.primary,  // Blue border
        borderWidth: 2,               // Border thickness
        paddingVertical: 10,
        paddingHorizontal: 1,
        borderRadius: 30,             // Rounded corners
        marginVertical: 10, 
        width: 158,
        height: 41,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bluebuttonText: {
        color: colors.primary,        // Blue text
        fontSize: 16,
        fontWeight: 'bold',
    },
    whitebuttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    rentbutton: {
        fontFamily: "Outfit",
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        justifyContent: "center", // Center text vertically
        alignItems: "center", // Center text horizontally
    },
    
    textbox: {
        backgroundColor: colors.white, 
        paddingVertical: 12, 
        paddingHorizontal: 15, 
        borderRadius: 5, 
        width: 280, 
        height: 41, 
        marginBottom: 20, 
        fontSize: 16, 
        color: colors.darkGray, 
        borderWidth: 1,
        borderColor: colors.darkGray,
    },
    textbox: {
        backgroundColor: colors.lightGray, 
        paddingVertical: 12, 
        paddingHorizontal: 15, 
        borderRadius: 5, 
        width: 280, 
        height: 41, 
        marginBottom: 20, 
        fontSize: 16, 
        color: colors.darkGray, 
        borderWidth: 1,
        borderColor: colors.darkGray,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modelView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '90%',
        padding: 35,
        alignItems: 'center', // Fixed typo "certer" to "center"
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    }
    
});

export default styles;
