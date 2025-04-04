import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Heart, ThumbsDown, MoreHorizontal } from "lucide-react-native";
import { Image as ExpoImage } from "expo-image";

interface CommentCardProps {
  id?: string;
  username?: string;
  handle?: string;
  avatar?: string;
  content?: string;
  timestamp?: string;
  likes?: number;
  dislikes?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
  onProfilePress?: () => void;
  onMorePress?: () => void;
}

const CommentCard = ({
  username = "John Doe",
  handle = "@johndoe",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  content = "Great post! I really enjoyed reading this.",
  timestamp = "2h ago",
  likes = 5,
  dislikes = 1,
  isLiked = false,
  isDisliked = false,
  onLike = () => {},
  onDislike = () => {},
  onProfilePress = () => {},
  onMorePress = () => {},
}: CommentCardProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [disliked, setDisliked] = useState(isDisliked);
  const [likesCount, setLikesCount] = useState(likes);
  const [dislikesCount, setDislikesCount] = useState(dislikes);

  const handleLike = () => {
    if (disliked) {
      setDisliked(false);
      setDislikesCount(dislikesCount - 1);
    }

    if (liked) {
      setLiked(false);
      setLikesCount(likesCount - 1);
    } else {
      setLiked(true);
      setLikesCount(likesCount + 1);
    }
    onLike();
  };

  const handleDislike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount(likesCount - 1);
    }

    if (disliked) {
      setDisliked(false);
      setDislikesCount(dislikesCount - 1);
    } else {
      setDisliked(true);
      setDislikesCount(dislikesCount + 1);
    }
    onDislike();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onProfilePress}>
          <ExpoImage
            source={{ uri: avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.nameContainer}>
              <TouchableOpacity onPress={onProfilePress}>
                <Text style={styles.username}>{username}</Text>
              </TouchableOpacity>
              <Text style={styles.handle}>{handle}</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.timestamp}>{timestamp}</Text>
            </View>

            <TouchableOpacity onPress={onMorePress} style={styles.moreButton}>
              <MoreHorizontal size={16} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Text style={styles.content}>{content}</Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <Heart
                size={16}
                color={liked ? "#ef4444" : "#64748b"}
                fill={liked ? "#ef4444" : "none"}
              />
              <Text style={[styles.actionText, liked && styles.likedText]}>
                {likesCount}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDislike}
              style={styles.actionButton}
            >
              <ThumbsDown
                size={16}
                color={disliked ? "#3b82f6" : "#64748b"}
                fill={disliked ? "#3b82f6" : "none"}
              />
              <Text
                style={[styles.actionText, disliked && styles.dislikedText]}
              >
                {dislikesCount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  username: {
    fontWeight: "bold",
    color: "#1E293B",
    fontSize: 14,
  },
  handle: {
    color: "#64748B",
    marginLeft: 4,
    fontSize: 12,
  },
  dot: {
    color: "#94A3B8",
    marginLeft: 4,
    fontSize: 12,
  },
  timestamp: {
    color: "#64748B",
    marginLeft: 4,
    fontSize: 12,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    color: "#1E293B",
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 4,
    color: "#64748B",
    fontSize: 12,
  },
  likedText: {
    color: "#EF4444",
  },
  dislikedText: {
    color: "#3B82F6",
  },
});

export default CommentCard;
