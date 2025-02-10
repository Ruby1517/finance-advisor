import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../FirebaseConfig";

const BudgetScreen = ({ navigation }) => {
    const [income, setIncome] = useState("");
    const [expense, setExpense] = useState("");
    const user = auth.currentUser; // Get the logged-in user

    const handleSaveBudget = async () => {
        if (!income || !expense) {
            Alert.alert("Error", "Please enter both income and expense.");
            return;
        }
        try {
            await addDoc(collection(db, "budgets"), {
                userId: user.uid,
                income: parseFloat(income),
                expense: parseFloat(expense),
                createdAt: new Date(),
            });
            Alert.alert("Success", "Budget data saved!");
            setIncome("");
            setExpense("");
            navigation.goBack(); // Navigate back to Dashboard
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>💰 Manage Budget</Text>
            <TextInput
                placeholder="Enter Income"
                keyboardType="numeric"
                value={income}
                onChangeText={setIncome}
                style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
            />
            <TextInput
                placeholder="Enter Expense"
                keyboardType="numeric"
                value={expense}
                onChangeText={setExpense}
                style={{ borderBottomWidth: 1, marginBottom: 20, padding: 5 }}
            />
            <Button title="Save Budget" onPress={handleSaveBudget} />
            <Button title="Back to Dashboard" onPress={() => navigation.goBack()} />
        </View>
    );
};

export default BudgetScreen;
