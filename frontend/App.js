import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import DashboardScreen from "./screens/DashboardScreen";
import BudgetScreen from "./screens/BudgetScreen";
import { auth } from "./FirebaseConfig";

const Stack = createStackNavigator();

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return unsubscribe;
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <>
                        <Stack.Screen name="Dashboard" component={DashboardScreen} />
                        <Stack.Screen name="BudgetScreen" component={BudgetScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
