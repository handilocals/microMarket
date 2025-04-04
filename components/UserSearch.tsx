import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import { Search, X, User } from "lucide-react-native";
import { Image as ExpoImage } from "expo-image";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

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
      style={styles.userItem}
      onPress={() => handleUserSelect(item.id, item.username)}
    >
      <ExpoImage
        source={{
          uri:
            item.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous",
        }}
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        {item.bio && (
          <Text style={styles.userBio} numberOfLines={1}>
            {item.bio}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        isModal ? styles.modalContainer : styles.fullWidth,
      ]}
    >
      <View style={styles.searchBar}>
        <Search size={18} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <X size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#1DA1F2" />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => searchUsers(searchQuery)}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading &&
        !error &&
        searchResults.length === 0 &&
        searchQuery.length > 0 && (
          <View style={styles.noResultsContainer}>
            <User size={24} color="#94a3b8" style={styles.noResultsIcon} />
            <Text style={styles.noResultsText}>
              No users found matching "{searchQuery}"
            </Text>
          </View>
        )}

      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  modalContainer: {
    flex: 1,
  },
  fullWidth: {
    width: "100%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#1E293B",
  },
  loadingContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  errorContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 8,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 9999,
  },
  retryButtonText: {
    color: "#3B82F6",
  },
  noResultsContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  noResultsIcon: {
    marginBottom: 8,
  },
  noResultsText: {
    color: "#64748B",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    color: "#1E293B",
  },
  userBio: {
    color: "#64748B",
    fontSize: 14,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
});

export default UserSearch;
