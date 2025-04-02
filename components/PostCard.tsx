import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
  ThumbsDown,
} from "lucide-react-native";
import { Image as ExpoImage } from "expo-image";

interface PostCardProps {
  id?: string;
  username?: string;
  handle?: string;
  avatar?: string;
  content?: string;
  timestamp?: string;
  imageUrl?: string;
  likes?: number;
  dislikes?: number;
  comments?: number;
  reposts?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isReposted?: boolean;
  isBookmarked?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
  onComment?: () => void;
  onRepost?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onProfilePress?: () => void;
  onPostPress?: () => void;
  onMorePress?: () => void;
}

const PostCard = ({
  username = "John Doe",
  handle = "@johndoe",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  content = "Just launched my new product on the marketplace! Check it out and let me know what you think. #NewProduct #Marketplace",
  timestamp = "2h ago",
  imageUrl,
  likes = 42,
  dislikes = 5,
  comments = 12,
  reposts = 8,
  isLiked = false,
  isDisliked = false,
  isReposted = false,
  isBookmarked = false,
  onLike = () => {},
  onDislike = () => {},
  onComment = () => {},
  onRepost = () => {},
  onShare = () => {},
  onBookmark = () => {},
  onProfilePress = () => {},
  onPostPress = () => {},
  onMorePress = () => {},
}: PostCardProps) => {
  // Local state to handle interactions without requiring props updates
  const [liked, setLiked] = useState(isLiked);
  const [disliked, setDisliked] = useState(isDisliked);
  const [reposted, setReposted] = useState(isReposted);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [likesCount, setLikesCount] = useState(likes);
  const [dislikesCount, setDislikesCount] = useState(dislikes);
  const [repostsCount, setRepostsCount] = useState(reposts);

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

  const handleRepost = () => {
    if (reposted) {
      setReposted(false);
      setRepostsCount(repostsCount - 1);
    } else {
      setReposted(true);
      setRepostsCount(repostsCount + 1);
    }
    onRepost();
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onBookmark();
  };

  return (
    <View style={styles.card}>
      {/* Header with avatar and user info */}
      <View style={styles.header}>
        <Pressable onPress={onProfilePress}>
          <ExpoImage
            source={{ uri: avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
        </Pressable>

        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.nameContainer}>
              <Pressable onPress={onProfilePress}>
                <Text style={styles.username}>{username}</Text>
              </Pressable>
              <Text style={styles.handle}>{handle}</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.timestamp}>{timestamp}</Text>
            </View>

            <TouchableOpacity onPress={onMorePress} style={styles.moreButton}>
              <MoreHorizontal size={18} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Post content */}
      <Pressable onPress={onPostPress}>
        <Text style={styles.content}>{content}</Text>

        {imageUrl && (
          <ExpoImage
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
        )}
      </Pressable>

      {/* Engagement actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onComment} style={styles.actionButton}>
          <MessageCircle size={18} color="#64748b" />
          <Text style={styles.actionText}>{comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRepost} style={styles.actionButton}>
          <Repeat2 size={18} color={reposted ? "#10b981" : "#64748b"} />
          <Text style={[styles.actionText, reposted && styles.repostedText]}>
            {repostsCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Heart
            size={18}
            color={liked ? "#ef4444" : "#64748b"}
            fill={liked ? "#ef4444" : "none"}
          />
          <Text style={[styles.actionText, liked && styles.likedText]}>
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDislike} style={styles.actionButton}>
          <ThumbsDown
            size={18}
            color={disliked ? "#3b82f6" : "#64748b"}
            fill={disliked ? "#3b82f6" : "none"}
          />
          <Text style={[styles.actionText, disliked && styles.dislikedText]}>
            {dislikesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
          <Bookmark
            size={18}
            color={bookmarked ? "#f59e0b" : "#64748b"}
            fill={bookmarked ? "#f59e0b" : "none"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onShare} style={styles.actionButton}>
          <Share size={18} color="#64748b" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  username: {
    fontWeight: "bold",
    color: "#1E293B",
  },
  handle: {
    color: "#64748B",
    marginLeft: 4,
  },
  dot: {
    color: "#94A3B8",
    marginLeft: 4,
  },
  timestamp: {
    color: "#64748B",
    marginLeft: 4,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    color: "#1E293B",
    marginBottom: 12,
    lineHeight: 20,
  },
  image: {
    width: "100%",
    height: 192,
    borderRadius: 8,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 4,
    color: "#64748B",
  },
  likedText: {
    color: "#EF4444",
  },
  dislikedText: {
    color: "#3B82F6",
  },
  repostedText: {
    color: "#10B981",
  },
});

export default PostCard;
