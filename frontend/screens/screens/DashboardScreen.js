
import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, ScrollView, StyleSheet } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { sendBudgetAlert, requestNotificationPermissions } from "../utils/notification";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

const DashboardScreen = ({ navigation }) => {
    const [budgetData, setBudgetData] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(db, "budgets"), where("userId", "==", auth.currentUser.uid));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                setBudgetData(data);

                // Calculate total income & expenses
                let incomeSum = 0;
                let expenseSum = 0;
                data.forEach(item => {
                    incomeSum += item.income;
                    expenseSum += item.expense;
                });

                setTotalIncome(incomeSum);
                setTotalExpense(expenseSum);
            } catch (error) {
                Alert.alert("Error", error.message);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const checkSpending = async () => {
            await requestNotificationPermissions();
            sendBudgetAlert(totalExpense, totalIncome * 0.7); // Alert if expenses exceed 70% of income
        };
    
        checkSpending();
    }, [totalExpense]);

    // Chart Data
    const chartData = [
        { name: "Income", amount: totalIncome, color: "green", legendFontColor: "#000", legendFontSize: 14 },
        { name: "Expenses", amount: totalExpense, color: "red", legendFontColor: "#000", legendFontSize: 14 }
    ];

    const handleLogout = async () => {
        await auth.signOut(); // Logs the user out
        navigation.replace("Login"); // Redirects to Login Screen
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ flex: 1, padding: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>🏠 Dashboard</Text>
                {budgetData.length > 0 && (
                    <FinancialAdvice income={totalIncome} expenses={totalExpense} />
                )}

                {budgetData.length > 0 ? (
                    <>
                        <PieChart
                            data={chartData}
                            width={screenWidth - 40}
                            height={200}
                            chartConfig={{
                                backgroundColor: "#ffffff",
                                backgroundGradientFrom: "#ffffff",
                                backgroundGradientTo: "#ffffff",
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                strokeWidth: 2,
                            }}
                            accessor="amount"
                            backgroundColor="transparent"
                            paddingLeft="10"
                            absolute
                        />
                    </>
                ) : (
                    <Text>No budget data available.</Text>
                )}

                <Button title="Add Budget" onPress={() => navigation.navigate("BudgetScreen")} />
                <Button title="Back to Home" onPress={handleLogout} color="red" />
            </ScrollView>

        </SafeAreaView>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9", // Light background for better visibility
        paddingTop: 100, // Pushes the page down
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30, // Prevents content from touching the bottom
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    noDataText: {
        fontSize: 16,
        textAlign: "center",
        marginVertical: 20,
    },
});

export default DashboardScreen;

