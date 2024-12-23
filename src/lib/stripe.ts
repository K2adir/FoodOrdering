import { Alert } from "react-native";
import { supabase } from "./supabase";
import {
    initPaymentSheet,
    presentPaymentSheet,
} from "@stripe/stripe-react-native";
const fetchPaymenSheetParams = async (amount: number) => {
    const { data, error } = await supabase.functions.invoke("payment-sheet", {
        body: { amount },
    });
    if (data) return data;

    Alert.alert(`Error: ${error?.message ?? "no data"}`);
    return {};
};

export const initialisePaymentSheet = async (amount: number) => {
    //
    console.log("Initialising payment sheet for amount: ", amount);

    const { paymentIntent, publishableKey } = await fetchPaymenSheetParams(
        amount,
    );

    if (!paymentIntent || !publishableKey) return;

    await initPaymentSheet({
        merchantDisplayName: "SupaStore",
        paymentIntentClientSecret: paymentIntent,
        defaultBillingDetails: {
            name: "Jane Doe",
        },
    });
};

export const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
        Alert.alert(`Error: ${error.message}`);
        return false;
    }
    return true;
};
