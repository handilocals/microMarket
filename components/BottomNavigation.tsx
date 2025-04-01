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
      intensity={60}
      tint="light"
      className="absolute bottom-0 w-full border-t border-border bg-white/90"
    >
      <View className="flex-row justify-around items-center h-16 px-2 bg-white/5">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.name;
          const IconComponent = tab.icon;

          return (
            <TouchableOpacity
              key={tab.name}
              className={`flex-1 items-center justify-center py-1 ${isActive ? "border-t-2 border-primary-600" : ""}`}
              onPress={() => handleNavigation(tab.route)}
            >
              <IconComponent
                size={22}
                color={isActive ? "#0284c7" : "#64748b"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text
                className={`text-xs mt-1 ${isActive ? "text-primary-600 font-semibold" : "text-secondary-500"}`}
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
