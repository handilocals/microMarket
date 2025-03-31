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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign in");
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

      <Text className="text-3xl font-bold mb-8">Welcome back</Text>

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
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className={`rounded-lg p-4 ${loading ? "bg-blue-300" : "bg-blue-500"}`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold">Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/auth/register")}
        className="mt-4"
      >
        <Text className="text-center text-blue-500">
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
