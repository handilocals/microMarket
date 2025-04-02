import React, { useState, useEffect } from "react";
import {
  View,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

// Import components
import Header from "../components/Header";
import PostList from "../components/PostList";
import BottomNavigation from "../components/BottomNavigation";
import ComposeButton from "../components/ComposeButton";
import Trending from "../src/components/Trending";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(
          "*, profiles(username, avatar), post_likes(user_id), post_dislikes(user_id), post_reposts(user_id), post_bookmarks(user_id)",
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedPosts = data.map((post) => ({
          id: post.id,
          username: post.profiles?.username || "Anonymous",
          handle: `@${post.profiles?.username?.toLowerCase().replace(/\s/g, "") || "anonymous"}`,
          avatar:
            post.profiles?.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous",
          content: post.content,
          timestamp: formatTimestamp(post.created_at),
          imageUrl: post.image_url,
          likes: post.likes_count || 0,
          dislikes: post.dislikes_count || 0,
          comments: post.comments_count || 0,
          reposts: post.reposts_count || 0,
          isLiked:
            post.post_likes?.some((like: any) => like.user_id === user?.id) ||
            false,
          isDisliked:
            post.post_dislikes?.some(
              (dislike: any) => dislike.user_id === user?.id,
            ) || false,
          isReposted:
            post.post_reposts?.some(
              (repost: any) => repost.user_id === user?.id,
            ) || false,
          isBookmarked:
            post.post_bookmarks?.some(
              (bookmark: any) => bookmark.user_id === user?.id,
            ) || false,
        }));
        setPosts(formattedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPosts();
    setIsRefreshing(false);
  };

  const handlePostPress = (postId: string) => {
    console.log(`Post ${postId} pressed`);
    // Navigate to post detail screen
    // router.push(`/post/${postId}`);
  };

  const handleProfilePress = (username: string) => {
    console.log(`Profile ${username} pressed`);
    // Navigate to profile screen
    // router.push(`/profile/${username}`);
  };

  const handleLike = async (postId: string) => {
    try {
      const isLiked = posts.find((p) => p.id === postId)?.isLiked;

      if (isLiked) {
        // Unlike the post
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user?.id);

        await supabase
          .from("posts")
          .update({ likes_count: supabase.rpc("decrement", { x: 1 }) })
          .eq("id", postId);
      } else {
        // Remove dislike if exists
        const isDisliked = posts.find((p) => p.id === postId)?.isDisliked;
        if (isDisliked) {
          await supabase
            .from("post_dislikes")
            .delete()
            .eq("post_id", postId)
            .eq("user_id", user?.id);

          await supabase
            .from("posts")
            .update({ dislikes_count: supabase.rpc("decrement", { x: 1 }) })
            .eq("id", postId);
        }

        // Like the post
        await supabase
          .from("post_likes")
          .insert({ post_id: postId, user_id: user?.id });

        await supabase
          .from("posts")
          .update({ likes_count: supabase.rpc("increment", { x: 1 }) })
          .eq("id", postId);
      }

      // Refresh posts
      await fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDislike = async (postId: string) => {
    try {
      const isDisliked = posts.find((p) => p.id === postId)?.isDisliked;

      if (isDisliked) {
        // Remove dislike
        await supabase
          .from("post_dislikes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user?.id);

        await supabase
          .from("posts")
          .update({ dislikes_count: supabase.rpc("decrement", { x: 1 }) })
          .eq("id", postId);
      } else {
        // Remove like if exists
        const isLiked = posts.find((p) => p.id === postId)?.isLiked;
        if (isLiked) {
          await supabase
            .from("post_likes")
            .delete()
            .eq("post_id", postId)
            .eq("user_id", user?.id);

          await supabase
            .from("posts")
            .update({ likes_count: supabase.rpc("decrement", { x: 1 }) })
            .eq("id", postId);
        }

        // Dislike the post
        await supabase
          .from("post_dislikes")
          .insert({ post_id: postId, user_id: user?.id });

        await supabase
          .from("posts")
          .update({ dislikes_count: supabase.rpc("increment", { x: 1 }) })
          .eq("id", postId);
      }

      // Refresh posts
      await fetchPosts();
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  const handleComment = (postId: string) => {
    console.log(`Comment on post ${postId}`);
    // Navigate to comment screen
    // router.push(`/post/${postId}/comment`);
  };

  const handleRepost = async (postId: string) => {
    try {
      const isReposted = posts.find((p) => p.id === postId)?.isReposted;

      if (isReposted) {
        // Remove repost
        await supabase
          .from("post_reposts")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user?.id);

        await supabase
          .from("posts")
          .update({ reposts_count: supabase.rpc("decrement", { x: 1 }) })
          .eq("id", postId);
      } else {
        // Repost the post
        await supabase
          .from("post_reposts")
          .insert({ post_id: postId, user_id: user?.id });

        await supabase
          .from("posts")
          .update({ reposts_count: supabase.rpc("increment", { x: 1 }) })
          .eq("id", postId);
      }

      // Refresh posts
      await fetchPosts();
    } catch (error) {
      console.error("Error reposting:", error);
    }
  };

  const handleShare = (postId: string) => {
    console.log(`Post ${postId} shared`);
    // Open share dialog
  };

  const handleBookmark = async (postId: string) => {
    try {
      const isBookmarked = posts.find((p) => p.id === postId)?.isBookmarked;

      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from("post_bookmarks")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user?.id);
      } else {
        // Bookmark the post
        await supabase
          .from("post_bookmarks")
          .insert({ post_id: postId, user_id: user?.id });
      }

      // Refresh posts
      await fetchPosts();
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  const handleMorePress = (postId: string) => {
    console.log(`More options for post ${postId}`);
    // Open post options menu
  };

  const handleLoadMore = () => {
    console.log("Loading more posts");
    // Implement pagination
  };

  const handleComposePress = () => {
    console.log("Compose button pressed");
    // Navigate to compose screen
    router.push("/compose");
  };

  const handleTopicPress = (topic: string) => {
    console.log(`Topic ${topic} pressed`);
    // Navigate to search results for this topic
    // router.push(`/search?q=${encodeURIComponent(topic)}`);
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <Header />

      {/* Content */}
      <View style={styles.content}>
        {/* Main Feed */}
        <View style={styles.feedContainer}>
          <PostList
            posts={posts}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
            onPostPress={handlePostPress}
            onProfilePress={handleProfilePress}
            onLike={handleLike}
            onDislike={handleDislike}
            onComment={handleComment}
            onRepost={handleRepost}
            onShare={handleShare}
            onBookmark={handleBookmark}
            onMorePress={handleMorePress}
            onLoadMore={handleLoadMore}
          />
        </View>

        {/* Sidebar (only visible on larger screens) */}
        <View style={styles.sidebar}>
          <ScrollView style={styles.sidebarScroll}>
            <Trending onTopicPress={handleTopicPress} />
          </ScrollView>
        </View>
      </View>

      {/* Compose Button */}
      <ComposeButton onPress={handleComposePress} />

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  feedContainer: {
    flex: 1,
  },
  sidebar: {
    width: 288,
    paddingLeft: 16,
    paddingRight: 8,
    display: "none", // Hidden by default, would be shown on larger screens with platform-specific code
    "@media (min-width: 768px)": {
      display: "flex", // This won't work with StyleSheet, would need a responsive solution
    },
  },
  sidebarScroll: {
    flex: 1,
  },
});
