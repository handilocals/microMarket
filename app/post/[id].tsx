import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import PostCard from "../../components/PostCard";
import CommentList from "../../components/CommentList";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

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

interface Comment {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
}

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (user && id) {
      fetchPost();
      fetchComments();
    }
  }, [user, id]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(
          "*, profiles(username, avatar), post_likes(user_id), post_dislikes(user_id), post_reposts(user_id), post_bookmarks(user_id)",
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        const formattedPost = {
          id: data.id,
          username: data.profiles?.username || "Anonymous",
          handle: `@${data.profiles?.username?.toLowerCase().replace(/\s/g, "") || "anonymous"}`,
          avatar:
            data.profiles?.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous",
          content: data.content,
          timestamp: formatTimestamp(data.created_at),
          imageUrl: data.image_url,
          likes: data.likes_count || 0,
          dislikes: data.dislikes_count || 0,
          comments: data.comments_count || 0,
          reposts: data.reposts_count || 0,
          isLiked:
            data.post_likes?.some((like: any) => like.user_id === user?.id) ||
            false,
          isDisliked:
            data.post_dislikes?.some(
              (dislike: any) => dislike.user_id === user?.id,
            ) || false,
          isReposted:
            data.post_reposts?.some(
              (repost: any) => repost.user_id === user?.id,
            ) || false,
          isBookmarked:
            data.post_bookmarks?.some(
              (bookmark: any) => bookmark.user_id === user?.id,
            ) || false,
        };
        setPost(formattedPost);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(
          "*, profiles(username, avatar), comment_likes(user_id), comment_dislikes(user_id)",
        )
        .eq("post_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedComments = data.map((comment) => ({
          id: comment.id,
          username: comment.profiles?.username || "Anonymous",
          handle: `@${comment.profiles?.username?.toLowerCase().replace(/\s/g, "") || "anonymous"}`,
          avatar:
            comment.profiles?.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous",
          content: comment.content,
          timestamp: formatTimestamp(comment.created_at),
          likes: comment.likes_count || 0,
          dislikes: comment.dislikes_count || 0,
          isLiked:
            comment.comment_likes?.some(
              (like: any) => like.user_id === user?.id,
            ) || false,
          isDisliked:
            comment.comment_dislikes?.some(
              (dislike: any) => dislike.user_id === user?.id,
            ) || false,
        }));
        setComments(formattedComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
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

  const handleLikePost = async () => {
    if (!post) return;

    try {
      if (post.isLiked) {
        // Unlike the post
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user?.id);

        await supabase
          .from("posts")
          .update({ likes_count: supabase.rpc("decrement", { x: 1 }) })
          .eq("id", post.id);
      } else {
        // Remove dislike if exists
        if (post.isDisliked) {
          await supabase
            .from("post_dislikes")
            .delete()
            .eq("post_id", post.id)
            .eq("user_id", user?.id);

          await supabase
            .from("posts")
            .update({ dislikes_count: supabase.rpc("decrement", { x: 1 }) })
            .eq("id", post.id);
        }

        // Like the post
        await supabase
          .from("post_likes")
          .insert({ post_id: post.id, user_id: user?.id });

        await supabase
          .from("posts")
          .update({ likes_count: supabase.rpc("increment", { x: 1 }) })
          .eq("id", post.id);
      }

      // Refresh post
      fetchPost();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDislikePost = async () => {
    if (!post) return;

    try {
      if (post.isDisliked) {
        // Remove dislike
        await supabase
          .from("post_dislikes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user?.id);

        await supabase
          .from("posts")
          .update({ dislikes_count: supabase.rpc("decrement", { x: 1 }) })
          .eq("id", post.id);
      } else {
        // Remove like if exists
        if (post.isLiked) {
          await supabase
            .from("post_likes")
            .delete()
            .eq("post_id", post.id)
            .eq("user_id", user?.id);

          await supabase
            .from("posts")
            .update({ likes_count: supabase.rpc("decrement", { x: 1 }) })
            .eq("id", post.id);
        }

        // Dislike the post
        await supabase
          .from("post_dislikes")
          .insert({ post_id: post.id, user_id: user?.id });

        await supabase
          .from("posts")
          .update({ dislikes_count: supabase.rpc("increment", { x: 1 }) })
          .eq("id", post.id);
      }

      // Refresh post
      fetchPost();
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;

      if (comment.isLiked) {
        // Unlike the comment
        await supabase
          .from("comment_likes")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", user?.id);

        await supabase
          .from("comments")
          .update({ likes_count: supabase.rpc("decrement", { x: 1 }) })
          .eq("id", commentId);
      } else {
        // Remove dislike if exists
        if (comment.isDisliked) {
          await supabase
            .from("comment_dislikes")
            .delete()
            .eq("comment_id", commentId)
            .eq("user_id", user?.id);

          await supabase
            .from("comments")
            .update({ dislikes_count: supabase.rpc("decrement", { x: 1 }) })
            .eq("id", commentId);
        }

        // Like the comment
        await supabase
          .from("comment_likes")
          .insert({ comment_id: commentId, user_id: user?.id });

        await supabase
          .from("comments")
          .update({ likes_count: supabase.rpc("increment", { x: 1 }) })
          .eq("id", commentId);
      }

      // Refresh comments
      fetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislikeComment = async (commentId: string) => {
    try {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;

      if (comment.isDisliked) {
        // Remove dislike
        await supabase
          .from("comment_dislikes")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", user?.id);

        await supabase
          .from("comments")
          .update({ dislikes_count: supabase.rpc("decrement", { x: 1 }) })
          .eq("id", commentId);
      } else {
        // Remove like if exists
        if (comment.isLiked) {
          await supabase
            .from("comment_likes")
            .delete()
            .eq("comment_id", commentId)
            .eq("user_id", user?.id);

          await supabase
            .from("comments")
            .update({ likes_count: supabase.rpc("decrement", { x: 1 }) })
            .eq("id", commentId);
        }

        // Dislike the comment
        await supabase
          .from("comment_dislikes")
          .insert({ comment_id: commentId, user_id: user?.id });

        await supabase
          .from("comments")
          .update({ dislikes_count: supabase.rpc("increment", { x: 1 }) })
          .eq("id", commentId);
      }

      // Refresh comments
      fetchComments();
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  const handleAddComment = async (postId: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          user_id: user?.id,
          content,
          likes_count: 0,
          dislikes_count: 0,
        })
        .select();

      if (error) throw error;

      // Increment comment count on post
      await supabase
        .from("posts")
        .update({ comments_count: supabase.rpc("increment", { x: 1 }) })
        .eq("id", postId);

      // Refresh comments and post
      fetchComments();
      fetchPost();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleProfilePress = (username: string) => {
    console.log(`Profile ${username} pressed`);
    // Navigate to profile screen
    // router.push(`/profile/${username}`);
  };

  const handleMorePress = (itemId: string) => {
    console.log(`More options for item ${itemId}`);
    // Open options menu
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.errorContainer, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={styles.errorContent}>
          <Text style={styles.errorText}>Post not found</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.errorButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ScrollView style={styles.scrollView}>
          <PostCard
            id={post.id}
            username={post.username}
            handle={post.handle}
            avatar={post.avatar}
            content={post.content}
            timestamp={post.timestamp}
            imageUrl={post.imageUrl}
            likes={post.likes}
            dislikes={post.dislikes}
            comments={post.comments}
            reposts={post.reposts}
            isLiked={post.isLiked}
            isDisliked={post.isDisliked}
            isReposted={post.isReposted}
            isBookmarked={post.isBookmarked}
            onLike={handleLikePost}
            onDislike={handleDislikePost}
            onProfilePress={() => handleProfilePress(post.username)}
            onMorePress={() => handleMorePress(post.id)}
          />
        </ScrollView>

        <View style={styles.commentsContainer}>
          <CommentList
            postId={post.id}
            comments={comments}
            onAddComment={handleAddComment}
            onLike={handleLikeComment}
            onDislike={handleDislikeComment}
            onProfilePress={handleProfilePress}
            onMorePress={handleMorePress}
          />
        </View>
      </View>
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
  errorContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  errorContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: "#0EA5E9",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    padding: 8,
    borderRadius: 9999,
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  scrollView: {
    flex: 0,
    maxHeight: 300, // Adjust as needed
  },
  commentsContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
});
