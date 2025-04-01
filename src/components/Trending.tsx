import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { TrendingUp, Hash } from "lucide-react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

interface TrendingTopic {
  id: string;
  name: string;
  post_count: number;
}

interface TrendingProps {
  onTopicPress?: (topic: string) => void;
}

const Trending = ({ onTopicPress = () => {} }: TrendingProps) => {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTrendingTopics();
    }
  }, [user]);

  const fetchTrendingTopics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch trending hashtags from posts
      const { data, error } = await supabase
        .from("hashtags")
        .select("id, name, post_count")
        .order("post_count", { ascending: false })
        .limit(5);

      if (error) throw error;

      if (data) {
        setTrendingTopics(data);
      } else {
        // Fallback data if no trending topics are available
        setTrendingTopics([
          { id: "1", name: "NewProduct", post_count: 245 },
          { id: "2", name: "Marketplace", post_count: 189 },
          { id: "3", name: "TechNews", post_count: 156 },
          { id: "4", name: "Design", post_count: 132 },
          { id: "5", name: "Startup", post_count: 98 },
        ]);
      }
    } catch (err) {
      console.error("Error fetching trending topics:", err);
      setError("Failed to load trending topics");
      // Set fallback data
      setTrendingTopics([
        { id: "1", name: "NewProduct", post_count: 245 },
        { id: "2", name: "Marketplace", post_count: 189 },
        { id: "3", name: "TechNews", post_count: 156 },
        { id: "4", name: "Design", post_count: 132 },
        { id: "5", name: "Startup", post_count: 98 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTrendingTopic = ({ item }: { item: TrendingTopic }) => (
    <TouchableOpacity
      className="py-3 px-1"
      onPress={() => onTopicPress(item.name)}
    >
      <View className="flex-row items-center">
        <Hash size={16} className="text-primary-500 mr-2" />
        <Text className="text-secondary-800 font-medium">{item.name}</Text>
      </View>
      <Text className="text-secondary-500 text-sm ml-6">
        {item.post_count} {item.post_count === 1 ? "post" : "posts"}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <TrendingUp size={18} className="text-primary-500 mr-2" />
          <Text className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
            Trending Topics
          </Text>
        </View>
        <ActivityIndicator size="small" color="#1DA1F2" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <TrendingUp size={18} className="text-primary-500 mr-2" />
          <Text className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
            Trending Topics
          </Text>
        </View>
        <Text className="text-error">{error}</Text>
        <TouchableOpacity
          className="mt-2 py-2 px-4 bg-primary-50 rounded-full self-start"
          onPress={fetchTrendingTopics}
        >
          <Text className="text-primary-500">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4">
      <View className="flex-row items-center mb-3">
        <TrendingUp size={18} className="text-primary-500 mr-2" />
        <Text className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
          Trending Topics
        </Text>
      </View>
      <FlatList
        data={trendingTopics}
        renderItem={renderTrendingTopic}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => (
          <View className="border-b border-secondary-100 dark:border-secondary-800" />
        )}
      />
      <TouchableOpacity className="mt-2 self-end">
        <Text className="text-primary-500">See more</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Trending;
