import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Request permission for notifications
export async function requestNotificationPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
}

// Send a budget alert notification
export async function sendBudgetAlert(expense, limit) {
    if (expense > limit) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "⚠️ Budget Alert!",
                body: `You've exceeded your budget limit of $${limit}. Consider cutting expenses.`,
            },
            trigger: null,
        });
    }
}

// Set notification handling for foreground notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
