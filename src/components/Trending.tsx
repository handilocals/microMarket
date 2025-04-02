import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
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
      style={styles.topicItem}
      onPress={() => onTopicPress(item.name)}
    >
      <View style={styles.topicHeader}>
        <Hash size={16} color="#0EA5E9" style={styles.hashIcon} />
        <Text style={styles.topicName}>{item.name}</Text>
      </View>
      <Text style={styles.postCount}>
        {item.post_count} {item.post_count === 1 ? "post" : "posts"}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TrendingUp size={18} color="#0EA5E9" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Trending Topics</Text>
        </View>
        <ActivityIndicator size="small" color="#1DA1F2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TrendingUp size={18} color="#0EA5E9" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Trending Topics</Text>
        </View>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchTrendingTopics}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={18} color="#0EA5E9" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Trending Topics</Text>
      </View>
      <FlatList
        data={trendingTopics}
        renderItem={renderTrendingTopic}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <TouchableOpacity style={styles.seeMoreButton}>
        <Text style={styles.seeMoreText}>See more</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  topicItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  topicHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  hashIcon: {
    marginRight: 8,
  },
  topicName: {
    color: "#1E293B",
    fontWeight: "500",
  },
  postCount: {
    color: "#64748B",
    fontSize: 14,
    marginLeft: 24,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  seeMoreButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  seeMoreText: {
    color: "#0EA5E9",
  },
  errorText: {
    color: "#EF4444",
  },
  retryButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 9999,
    alignSelf: "flex-start",
  },
  retryButtonText: {
    color: "#0EA5E9",
  },
});

export default Trending;
