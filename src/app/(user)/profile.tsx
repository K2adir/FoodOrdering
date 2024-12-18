import { supabase } from "@/lib/supabase";
import { View, Text, Button } from "react-native";
import { useState } from "react";
import { Redirect } from "expo-router";

const ProfileScreen = () => {
  const [signedOut, setSignedOut] = useState(false);

  if (signedOut) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  return (
    <View>
      <Text>Profile</Text>
      <Button
        title="Sign out"
        onPress={async () => {
          try {
            // Sign out the user
            await supabase.auth.signOut();
            setSignedOut(true); // Immediately trigger redirect
          } catch (err) {
            console.error("Sign out error:", err.message);
          }
        }}
      />
    </View>
  );
};

export default ProfileScreen;
