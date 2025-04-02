import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import PostCard from "./PostCard";

interface Post {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
  imageUrl?: string;
  likes: number;
  dislikes: number;
  comments: number;
  reposts: number;
  isLiked: boolean;
  isDisliked: boolean;
  isReposted: boolean;
  isBookmarked: boolean;
}

interface PostListProps {
  posts?: Post[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  onPostPress?: (postId: string) => void;
  onProfilePress?: (username: string) => void;
  onLike?: (postId: string) => void;
  onDislike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onMorePress?: (postId: string) => void;
}

const PostList = ({
  posts = [
    {
      id: "1",
      username: "Jane Smith",
      handle: "@janesmith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      content:
        "Just launched my new product on the marketplace! Check it out and let me know what you think. #NewProduct #Marketplace",
      timestamp: "2h ago",
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      likes: 42,
      dislikes: 5,
      comments: 12,
      reposts: 8,
      isLiked: false,
      isDisliked: false,
      isReposted: false,
      isBookmarked: false,
    },
    {
      id: "2",
      username: "Alex Johnson",
      handle: "@alexj",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      content:
        "Working on a new feature for our app. Can't wait to share it with everyone!",
      timestamp: "4h ago",
      likes: 24,
      dislikes: 2,
      comments: 5,
      reposts: 3,
      isLiked: true,
      isDisliked: false,
      isReposted: false,
      isBookmarked: true,
    },
    {
      id: "3",
      username: "Sam Wilson",
      handle: "@samwilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
      content:
        "Just listed my vintage camera collection on the marketplace. Perfect for photography enthusiasts! #Photography #VintageGear",
      timestamp: "6h ago",
      imageUrl:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
      likes: 78,
      dislikes: 1,
      comments: 15,
      reposts: 12,
      isLiked: false,
      isDisliked: false,
      isReposted: true,
      isBookmarked: false,
    },
  ],
  isLoading = false,
  isRefreshing = false,
  onRefresh = () => {},
  onLoadMore = () => {},
  onPostPress = () => {},
  onProfilePress = () => {},
  onLike = () => {},
  onDislike = () => {},
  onComment = () => {},
  onRepost = () => {},
  onShare = () => {},
  onBookmark = () => {},
  onMorePress = () => {},
}: PostListProps) => {
  const [refreshing, setRefreshing] = useState(isRefreshing);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    onRefresh();
    // In a real app, you would set refreshing to false when the refresh is complete
    // This is simulated here with a timeout
    setTimeout(() => setRefreshing(false), 1500);
  }, [onRefresh]);

  const renderItem = ({ item }: { item: Post }) => (
    <PostCard
      id={item.id}
      username={item.username}
      handle={item.handle}
      avatar={item.avatar}
      content={item.content}
      timestamp={item.timestamp}
      imageUrl={item.imageUrl}
      likes={item.likes}
      dislikes={item.dislikes}
      comments={item.comments}
      reposts={item.reposts}
      isLiked={item.isLiked}
      isDisliked={item.isDisliked}
      isReposted={item.isReposted}
      isBookmarked={item.isBookmarked}
      onLike={() => onLike(item.id)}
      onDislike={() => onDislike(item.id)}
      onComment={() => onComment(item.id)}
      onRepost={() => onRepost(item.id)}
      onShare={() => onShare(item.id)}
      onBookmark={() => onBookmark(item.id)}
      onProfilePress={() => onProfilePress(item.username)}
      onPostPress={() => onPostPress(item.id)}
      onMorePress={() => onMorePress(item.id)}
    />
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  };

  const renderEmptyList = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No posts yet</Text>
        <Text style={styles.emptySubtext}>Posts will appear here</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingFooter: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 18,
  },
  emptySubtext: {
    color: "#9CA3AF",
    fontSize: 16,
    marginTop: 8,
  },
});

export default PostList;
