// import React, { useState } from "react";
// import { View, Text, TextInput, Button, Alert } from "react-native";
// import { auth } from "../FirebaseConfig";
// import { updateProfile } from "firebase/auth";

// const DashboardScreen = ({ navigation }) => {
//     const user = auth.currentUser;
//     const [name, setName] = useState(user?.displayName || "");

//     const handleUpdateProfile = async () => {
//         try {
//             await updateProfile(user, { displayName: name });
//             Alert.alert("Profile Updated", "Your name has been updated.");
//         } catch (error) {
//             Alert.alert("Error", error.message);
//         }
//     };

//     return (
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//             <Text style={{ fontSize: 24, fontWeight: "bold" }}>Welcome, {user?.displayName || "User"}</Text>
//             <Text>Email: {user?.email}</Text>
//             <TextInput placeholder="Update Name" value={name} onChangeText={setName} style={{ width: "80%", borderBottomWidth: 1, marginBottom: 10, padding: 5 }} />
//             <Button title="Update Name" onPress={handleUpdateProfile} />
//             <Button title="Logout" onPress={() => auth.signOut().then(() => navigation.replace("Login"))} />
//         </View>
//     );
// };

// export default DashboardScreen;

import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, ScrollView } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../FirebaseConfig";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { sendBudgetAlert, requestNotificationPermissions } from "../utils/notification";

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
        <ScrollView style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Dashboard</Text>
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
    );
};

export default DashboardScreen;

