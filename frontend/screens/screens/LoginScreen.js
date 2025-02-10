import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import * as Google from "expo-auth-session/providers/google";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "YOUR_GOOGLE_CLIENT_ID",
    });

    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(() => navigation.replace("Dashboard"))
                .catch((error) => Alert.alert("Google Sign-In Failed", error.message));
        }
    }, [response]);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace("Dashboard");
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24 }}>Login</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ width: "80%", borderBottomWidth: 1, marginBottom: 10, padding: 5 }} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ width: "80%", borderBottomWidth: 1, marginBottom: 20, padding: 5 }} />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
            <Button title="Sign in with Google" onPress={() => promptAsync()} />
        </View>
    );
};

export default LoginScreen;
