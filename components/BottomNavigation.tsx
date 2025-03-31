import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
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
    <BlurView
      intensity={80}
      tint="light"
      className="absolute bottom-0 w-full border-t border-gray-200 bg-white/80"
    >
      <View className="flex-row justify-around items-center h-16 px-2 bg-white/5">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.name;
          const IconComponent = tab.icon;

          return (
            <TouchableOpacity
              key={tab.name}
              className={`flex-1 items-center justify-center py-1 ${isActive ? "border-t-2 border-blue-500" : ""}`}
              onPress={() => handleNavigation(tab.route)}
            >
              <IconComponent
                size={24}
                color={isActive ? "#3b82f6" : "#6b7280"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text
                className={`text-xs mt-1 ${isActive ? "text-blue-500 font-semibold" : "text-gray-500"}`}
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

export default BottomNavigation;
