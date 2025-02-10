import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const MonthlyReport = () => {
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        const fetchMonthlyData = async () => {
            const q = query(collection(db, "budgets"), where("userId", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            
            const groupedData = {};
            querySnapshot.docs.forEach((doc) => {
                const data = doc.data();
                const month = new Date(data.createdAt.seconds * 1000).toLocaleString("default", { month: "long", year: "numeric" });
                
                if (!groupedData[month]) groupedData[month] = { income: 0, expense: 0 };
                groupedData[month].income += data.income;
                groupedData[month].expense += data.expense;
            });

            setMonthlyData(Object.entries(groupedData));
        };

        fetchMonthlyData();
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24 }}>📅 Monthly Report</Text>
            <FlatList
                data={monthlyData}
                keyExtractor={(item) => item[0]}
                renderItem={({ item }) => (
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontSize: 18 }}>{item[0]}</Text>
                        <Text>Income: ${item[1].income}</Text>
                        <Text>Expenses: ${item[1].expense}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default MonthlyReport;
