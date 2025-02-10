import React from "react";
import { View, Text } from "react-native";

const FinancialAdvice = ({ income, expenses }) => {
    let advice = "You're managing well! Keep saving.";
    
    if (expenses > income * 0.7) {
        advice = "⚠️ You're spending too much! Try reducing unnecessary expenses.";
    } else if (expenses < income * 0.3) {
        advice = "✅ Great job! Consider investing your extra savings.";
    } else if (income === 0) {
        advice = "❌ No income recorded. Please update your budget.";
    }

    return (
        <View style={{ marginTop: 20, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>💡 Financial Advice</Text>
            <Text>{advice}</Text>
        </View>
    );
};

export default FinancialAdvice;
