import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
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
    <View className="bg-white border-b border-gray-200 p-4">
      {/* Header with avatar and user info */}
      <View className="flex-row mb-2">
        <Pressable onPress={onProfilePress}>
          <ExpoImage
            source={{ uri: avatar }}
            className="w-10 h-10 rounded-full mr-3"
            contentFit="cover"
          />
        </Pressable>

        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <View className="flex-row items-center">
              <Pressable onPress={onProfilePress}>
                <Text className="font-bold text-base">{username}</Text>
              </Pressable>
              <Text className="text-gray-500 ml-1">{handle}</Text>
              <Text className="text-gray-500 ml-1">·</Text>
              <Text className="text-gray-500 ml-1">{timestamp}</Text>
            </View>

            <TouchableOpacity onPress={onMorePress} className="p-1">
              <MoreHorizontal size={18} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Post content */}
      <Pressable onPress={onPostPress}>
        <Text className="text-base mb-2">{content}</Text>

        {imageUrl && (
          <ExpoImage
            source={{ uri: imageUrl }}
            className="w-full h-48 rounded-lg mb-2"
            contentFit="cover"
          />
        )}
      </Pressable>

      {/* Engagement actions */}
      <View className="flex-row justify-between mt-3">
        <TouchableOpacity onPress={onComment} className="flex-row items-center">
          <MessageCircle size={18} color="#6b7280" />
          <Text className="ml-1 text-gray-500">{comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRepost}
          className="flex-row items-center"
        >
          <Repeat2 size={18} color={reposted ? "#10b981" : "#6b7280"} />
          <Text
            className={`ml-1 ${reposted ? "text-green-500" : "text-gray-500"}`}
          >
            {repostsCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLike}
          className="flex-row items-center"
        >
          <Heart
            size={18}
            color={liked ? "#ef4444" : "#6b7280"}
            fill={liked ? "#ef4444" : "none"}
          />
          <Text className={`ml-1 ${liked ? "text-red-500" : "text-gray-500"}`}>
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDislike}
          className="flex-row items-center"
        >
          <ThumbsDown
            size={18}
            color={disliked ? "#3b82f6" : "#6b7280"}
            fill={disliked ? "#3b82f6" : "none"}
          />
          <Text
            className={`ml-1 ${disliked ? "text-blue-500" : "text-gray-500"}`}
          >
            {dislikesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleBookmark}
          className="flex-row items-center"
        >
          <Bookmark
            size={18}
            color={bookmarked ? "#f59e0b" : "#6b7280"}
            fill={bookmarked ? "#f59e0b" : "none"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onShare} className="flex-row items-center">
          <Share size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;
