import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Success!", "Account created successfully!");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Sign Up Failed", error.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign Up</Text>
            <TextInput 
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail} 
                style={{ width: "80%", borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
            />
            <TextInput 
                placeholder="Password" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
                style={{ width: "80%", borderBottomWidth: 1, marginBottom: 20, padding: 5 }}
            />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Already have an account? Login" onPress={() => navigation.navigate("Login")} />
        </View>
    );
};

export default SignUpScreen;

