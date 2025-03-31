import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X, Image as ImageIcon, Send } from "lucide-react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function ComposeScreen() {
  const insets = useSafeAreaInsets();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const MAX_CHARS = 280;

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Post cannot be empty");
      return;
    }

    if (content.length > MAX_CHARS) {
      Alert.alert(
        "Error",
        `Post exceeds maximum character limit of ${MAX_CHARS}`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: user?.id,
          content: content.trim(),
          likes_count: 0,
          dislikes_count: 0,
          comments_count: 0,
          reposts_count: 0,
        })
        .select();

      if (error) throw error;

      Alert.alert("Success", "Post created successfully");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={
            !content.trim() || isSubmitting || content.length > MAX_CHARS
          }
          className={`rounded-full px-4 py-2 ${!content.trim() || isSubmitting || content.length > MAX_CHARS ? "bg-blue-300" : "bg-blue-500"}`}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-semibold">Post</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Compose Area */}
      <View className="flex-1 p-4">
        <TextInput
          className="flex-1 text-base"
          placeholder="What's happening?"
          multiline
          value={content}
          onChangeText={setContent}
          maxLength={MAX_CHARS + 10} // Allow typing a bit more but show error
          autoFocus
        />
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center p-4 border-t border-gray-200">
        <View className="flex-row">
          <TouchableOpacity className="mr-4">
            <ImageIcon size={24} color="#1DA1F2" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          <Text
            className={`mr-2 ${content.length > MAX_CHARS ? "text-red-500" : "text-gray-500"}`}
          >
            {content.length}/{MAX_CHARS}
          </Text>
        </View>
      </View>
    </View>
  );
}
