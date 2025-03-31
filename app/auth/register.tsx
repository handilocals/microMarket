import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      Alert.alert(
        "Registration Successful",
        "Please check your email for verification instructions.",
        [{ text: "OK", onPress: () => router.replace("/auth/login") }],
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <TouchableOpacity
        onPress={() => router.back()}
        className="p-2 rounded-full w-10 h-10 flex items-center justify-center mb-6"
      >
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>

      <Text className="text-3xl font-bold mb-8">Create Account</Text>

      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-gray-600 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-gray-50"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View>
          <Text className="text-gray-600 mb-2">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-gray-50"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View>
          <Text className="text-gray-600 mb-2">Confirm Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-gray-50"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        className={`rounded-lg p-4 ${loading ? "bg-blue-300" : "bg-blue-500"}`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold">Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/auth/login")}
        className="mt-4"
      >
        <Text className="text-center text-blue-500">
          Already have an account? Sign in
        </Text>
      </TouchableOpacity>
    </View>
  );
}
