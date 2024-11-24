import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '@constants/styles';


const SignupPage = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign up</Text>
            <Text style={styles.content}>Email</Text>
            <TextInput 
                style={styles.textbox} 
                placeholder="Enter your email"
                keyboardType="email-address" 
            />
            <Text style={styles.content}>Password</Text>
            <TextInput 
                style={styles.textbox} 
                placeholder="Enter your password"
                secureTextEntry={true}
            /> 
            <Text style={styles.content}>Driver's License Number</Text>
            <TextInput 
                style={styles.textbox} 
                placeholder="Enter your email"
                keyboardType="email-address" 
            />
            <Text style={styles.content}>Password</Text>
            <TextInput 
                style={styles.textbox} 
                placeholder="Enter your email"
                keyboardType="email-address" 
            />
            <Text style={styles.content}>Confirm Password</Text>
            <TextInput 
                style={styles.textbox} 
                placeholder="Enter your email"
                keyboardType="email-address"
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.bluebutton}
                    onPress={() => navigation.navigate('Browse')}
                >
                    <Text style={styles.whitebuttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
export default SignupPage;
