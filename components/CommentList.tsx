import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Send } from "lucide-react-native";
import CommentCard from "./CommentCard";

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

interface CommentListProps {
  postId?: string;
  comments?: Comment[];
  isLoading?: boolean;
  onAddComment?: (postId: string, content: string) => void;
  onLike?: (commentId: string) => void;
  onDislike?: (commentId: string) => void;
  onProfilePress?: (username: string) => void;
  onMorePress?: (commentId: string) => void;
}

const CommentList = ({
  postId = "1",
  comments = [
    {
      id: "1",
      username: "Jane Smith",
      handle: "@janesmith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      content: "Great post! I really enjoyed reading this.",
      timestamp: "1h ago",
      likes: 5,
      dislikes: 1,
      isLiked: false,
      isDisliked: false,
    },
    {
      id: "2",
      username: "Alex Johnson",
      handle: "@alexj",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      content: "I agree with Jane, this is really insightful!",
      timestamp: "45m ago",
      likes: 3,
      dislikes: 0,
      isLiked: true,
      isDisliked: false,
    },
    {
      id: "3",
      username: "Sam Wilson",
      handle: "@samwilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
      content: "I have a different perspective on this...",
      timestamp: "30m ago",
      likes: 2,
      dislikes: 2,
      isLiked: false,
      isDisliked: false,
    },
  ],
  isLoading = false,
  onAddComment = () => {},
  onLike = () => {},
  onDislike = () => {},
  onProfilePress = () => {},
  onMorePress = () => {},
}: CommentListProps) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    onAddComment(postId, newComment.trim());
    setNewComment("");
    // In a real app, you would set isSubmitting to false when the submission is complete
    // This is simulated here with a timeout
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  const renderItem = ({ item }: { item: Comment }) => (
    <CommentCard
      id={item.id}
      username={item.username}
      handle={item.handle}
      avatar={item.avatar}
      content={item.content}
      timestamp={item.timestamp}
      likes={item.likes}
      dislikes={item.dislikes}
      isLiked={item.isLiked}
      isDisliked={item.isDisliked}
      onLike={() => onLike(item.id)}
      onDislike={() => onDislike(item.id)}
      onProfilePress={() => onProfilePress(item.username)}
      onMorePress={() => onMorePress(item.id)}
    />
  );

  const renderEmptyList = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No comments yet</Text>
        <Text style={styles.emptySubtext}>Be the first to comment</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#1DA1F2" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>

      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyList}
        ListFooterComponent={renderFooter}
        style={styles.list}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#94A3B8"
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !newComment.trim() && styles.disabledButton,
          ]}
          onPress={handleSubmitComment}
          disabled={!newComment.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Send size={18} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 4,
  },
  loadingContainer: {
    padding: 16,
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "#1E293B",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#0EA5E9",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#94A3B8",
  },
});

export default CommentList;
