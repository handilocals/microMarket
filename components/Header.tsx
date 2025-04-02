import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
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
    <View style={styles.header}>
      <Text style={styles.title}>Home</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setSearchModalVisible(true)}
        >
          <Search size={20} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* Search Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={searchModalVisible}
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Users</Text>
              <TouchableOpacity
                onPress={() => setSearchModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
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

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0EA5E9",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 9999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flex: 1,
    marginTop: 40,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    padding: 8,
    borderRadius: 9999,
    backgroundColor: "#F3F4F6",
  },
  modalBody: {
    flex: 1,
    padding: 16,
  },
});

export default Header;
