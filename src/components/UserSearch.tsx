import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Search, X, User } from "lucide-react-native";
import { Image as ExpoImage } from "expo-image";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  bio?: string;
}

interface UserSearchProps {
  onUserSelect?: (userId: string, username: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

const UserSearch = ({
  onUserSelect = () => {},
  onClose = () => {},
  isModal = false,
}: UserSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (searchQuery.length > 0) {
      const delayDebounceFn = setTimeout(() => {
        searchUsers(searchQuery);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async (query: string) => {
    if (!query.trim() || query.length < 2) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar, bio")
        .ilike("username", `%${query}%`)
        .limit(10);

      if (error) throw error;

      if (data) {
        setSearchResults(data);
      }
    } catch (err) {
      console.error("Error searching users:", err);
      setError("Failed to search users");
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleUserSelect = (userId: string, username: string) => {
    onUserSelect(userId, username);
    if (isModal) {
      onClose();
    } else {
      clearSearch();
    }
  };

  const renderUserItem = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity
      className="flex-row items-center py-3 px-2"
      onPress={() => handleUserSelect(item.id, item.username)}
    >
      <ExpoImage
        source={{
          uri:
            item.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous",
        }}
        className="w-10 h-10 rounded-full mr-3"
        contentFit="cover"
      />
      <View className="flex-1">
        <Text className="font-bold text-secondary-800 dark:text-secondary-200">
          {item.username}
        </Text>
        {item.bio && (
          <Text
            className="text-secondary-500 dark:text-secondary-400 text-sm"
            numberOfLines={1}
          >
            {item.bio}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      className={`bg-white dark:bg-gray-900 ${isModal ? "flex-1" : "w-full"}`}
    >
      <View className="flex-row items-center border border-secondary-200 dark:border-secondary-700 rounded-full px-3 py-2 mb-2">
        <Search size={18} className="text-secondary-400 mr-2" />
        <TextInput
          className="flex-1 text-secondary-800 dark:text-secondary-200"
          placeholder="Search users..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <X size={18} className="text-secondary-400" />
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#1DA1F2" />
        </View>
      )}

      {error && (
        <View className="py-4 items-center">
          <Text className="text-error mb-2">{error}</Text>
          <TouchableOpacity
            className="py-2 px-4 bg-primary-50 rounded-full"
            onPress={() => searchUsers(searchQuery)}
          >
            <Text className="text-primary-500">Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading &&
        !error &&
        searchResults.length === 0 &&
        searchQuery.length > 0 && (
          <View className="py-4 items-center">
            <User size={24} className="text-secondary-400 mb-2" />
            <Text className="text-secondary-500 dark:text-secondary-400">
              No users found matching "{searchQuery}"
            </Text>
          </View>
        )}

      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <View className="border-b border-secondary-100 dark:border-secondary-800" />
          )}
        />
      )}
    </View>
  );
};

export default UserSearch;
