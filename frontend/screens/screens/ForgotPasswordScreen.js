import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../FirebaseConfig";

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Success", "Password reset link sent to your email.");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24 }}>Reset Password</Text>
            <TextInput placeholder="Enter your email" value={email} onChangeText={setEmail} style={{ width: "80%", borderBottomWidth: 1, marginBottom: 10, padding: 5 }} />
            <Button title="Send Reset Link" onPress={handlePasswordReset} />
            <Button title="Back to Login" onPress={() => navigation.navigate("Login")} />
        </View>
    );
};

export default ForgotPasswordScreen;
