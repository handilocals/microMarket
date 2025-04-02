import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Home, ShoppingBag, Bell, User } from "lucide-react-native";
import { BlurView } from "expo-blur";

interface BottomNavigationProps {
  activeTab?: string;
}

const BottomNavigation = ({ activeTab = "home" }: BottomNavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = activeTab || pathname.split("/")[1] || "home";

  const tabs = [
    {
      name: "home",
      icon: Home,
      label: "Home",
      route: "/",
    },
    {
      name: "marketplace",
      icon: ShoppingBag,
      label: "Market",
      route: "/marketplace",
    },
    {
      name: "notifications",
      icon: Bell,
      label: "Notifications",
      route: "/notifications",
    },
    {
      name: "profile",
      icon: User,
      label: "Profile",
      route: "/profile",
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <BlurView intensity={60} tint="light" style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.name;
          const IconComponent = tab.icon;

          return (
            <TouchableOpacity
              key={tab.name}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => handleNavigation(tab.route)}
            >
              <IconComponent
                size={22}
                color={isActive ? "#0284c7" : "#64748b"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text
                style={[styles.tabLabel, isActive && styles.activeTabLabel]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 64,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: "#0284C7",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#64748B",
  },
  activeTabLabel: {
    color: "#0284C7",
    fontWeight: "600",
  },
});

export default BottomNavigation;
