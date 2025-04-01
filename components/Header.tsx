import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { Home, Search, Bell, X } from "lucide-react-native";
import UserSearch from "../src/components/UserSearch";
import { router } from "expo-router";

const Header = () => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const handleUserSelect = (userId: string, username: string) => {
    console.log(`Selected user: ${username} (${userId})`);
    // Navigate to user profile
    // router.push(`/profile/${username}`);
    setSearchModalVisible(false);
  };

  return (
    <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <Text className="text-xl font-bold text-primary-500 dark:text-primary-400">
        Home
      </Text>
      <View className="flex-row space-x-4">
        <TouchableOpacity
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          onPress={() => setSearchModalVisible(true)}
        >
          <Search size={20} className="text-gray-700 dark:text-gray-300" />
        </TouchableOpacity>
        <TouchableOpacity className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell size={20} className="text-gray-700 dark:text-gray-300" />
        </TouchableOpacity>
      </View>

      {/* Search Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={searchModalVisible}
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-10 bg-white dark:bg-gray-900 rounded-t-3xl">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
              <Text className="text-xl font-bold text-secondary-800 dark:text-secondary-200">
                Search Users
              </Text>
              <TouchableOpacity
                onPress={() => setSearchModalVisible(false)}
                className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-800"
              >
                <X
                  size={20}
                  className="text-secondary-600 dark:text-secondary-400"
                />
              </TouchableOpacity>
            </View>
            <View className="flex-1 p-4">
              <UserSearch
                onUserSelect={handleUserSelect}
                onClose={() => setSearchModalVisible(false)}
                isModal={true}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Header;
