import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Settings, LogOut } from "lucide-react-native";
import { router } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import PostList from "../components/PostList";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // 'posts' or 'saved'

  useEffect(() => {
    if (user) {
      fetchProfile();
      if (activeTab === "posts") {
        fetchUserPosts();
      } else if (activeTab === "saved") {
        fetchSavedListings();
      }
    }
  }, [user, activeTab]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(
          "*, profiles(username, avatar), post_likes(user_id), post_dislikes(user_id), post_reposts(user_id), post_bookmarks(user_id)",
        )
        .eq("user_id", user?.id)
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
      console.error("Error fetching user posts:", error);
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

  const fetchSavedListings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("marketplace_saved_listings")
        .select(
          "*, marketplace_listings!inner(*, marketplace_categories(name), profiles(username, avatar), marketplace_listing_images(id, image_url))",
        )
        .eq("user_id", user?.id);

      if (error) throw error;

      if (data) {
        const formattedListings = data.map((item) => ({
          id: item.marketplace_listings.id,
          title: item.marketplace_listings.title,
          description: item.marketplace_listings.description,
          price: item.marketplace_listings.price,
          status: item.marketplace_listings.status,
          created_at: item.marketplace_listings.created_at,
          category_id: item.marketplace_listings.category_id,
          category_name:
            item.marketplace_listings.marketplace_categories?.name ||
            "Uncategorized",
          user_id: item.marketplace_listings.user_id,
          username: item.marketplace_listings.profiles?.username || "Anonymous",
          avatar:
            item.marketplace_listings.profiles?.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous",
          images: item.marketplace_listings.marketplace_listing_images || [],
          location: item.marketplace_listings.location || {
            state: "",
            city: "",
            locality: "",
            zipcode: "",
          },
          reference_number: item.marketplace_listings.reference_number || "",
          is_bargainable: item.marketplace_listings.is_bargainable || false,
          is_reserved: item.marketplace_listings.is_reserved || false,
          reserved_for_user_id:
            item.marketplace_listings.reserved_for_user_id || null,
        }));
        setSavedListings(formattedListings);
      }
    } catch (error) {
      console.error("Error fetching saved listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProfile();
    if (activeTab === "posts") {
      await fetchUserPosts();
    } else if (activeTab === "saved") {
      await fetchSavedListings();
    }
    setIsRefreshing(false);
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  if (isLoading && !isRefreshing && !profile) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-xl font-bold">Profile</Text>

        <View className="flex-row">
          <TouchableOpacity className="mr-4">
            <Settings size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut}>
            <LogOut size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Info */}
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center mb-4">
          <ExpoImage
            source={{
              uri:
                profile?.avatar ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous",
            }}
            className="w-20 h-20 rounded-full mr-4"
            contentFit="cover"
          />
          <View>
            <Text className="text-xl font-bold">
              {profile?.username || user?.email?.split("@")[0]}
            </Text>
            <Text className="text-gray-500">{`@${profile?.username?.toLowerCase().replace(/\s/g, "") || user?.email?.split("@")[0]}`}</Text>
          </View>
        </View>

        <Text className="mb-4">{profile?.bio || "No bio yet"}</Text>

        <View className="flex-row">
          <View className="mr-4">
            <Text className="font-bold">0</Text>
            <Text className="text-gray-500">Following</Text>
          </View>
          <View>
            <Text className="font-bold">0</Text>
            <Text className="text-gray-500">Followers</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === "posts" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setActiveTab("posts")}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "posts" ? "text-blue-500" : "text-gray-500"}`}
          >
            Posts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === "saved" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setActiveTab("saved")}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "saved" ? "text-blue-500" : "text-gray-500"}`}
          >
            Saved Items
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      <View className="flex-1">
        {activeTab === "posts" && (
          <PostList
            posts={posts}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
            onPostPress={(postId) => console.log(`Post ${postId} pressed`)}
            onProfilePress={(username) =>
              console.log(`Profile ${username} pressed`)
            }
            onLike={(postId) => console.log(`Post ${postId} liked`)}
            onDislike={(postId) => console.log(`Post ${postId} disliked`)}
            onComment={(postId) => console.log(`Comment on post ${postId}`)}
            onRepost={(postId) => console.log(`Post ${postId} reposted`)}
            onShare={(postId) => console.log(`Post ${postId} shared`)}
            onBookmark={(postId) => console.log(`Post ${postId} bookmarked`)}
            onMorePress={(postId) =>
              console.log(`More options for post ${postId}`)
            }
            onLoadMore={() => console.log("Loading more posts")}
          />
        )}

        {activeTab === "saved" && (
          <ScrollView
            className="flex-1 p-4"
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          >
            {isLoading && savedListings.length === 0 ? (
              <View className="flex-1 justify-center items-center py-10">
                <ActivityIndicator size="large" color="#1DA1F2" />
              </View>
            ) : savedListings.length === 0 ? (
              <View className="flex-1 justify-center items-center py-10">
                <Text className="text-gray-500 text-lg">No saved items</Text>
              </View>
            ) : (
              <View className="flex-1">
                {savedListings.map((listing) => (
                  <TouchableOpacity
                    key={listing.id}
                    className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
                    onPress={() => router.push(`/marketplace/${listing.id}`)}
                  >
                    {/* Image */}
                    <View className="w-full h-48 bg-gray-200">
                      {listing.images && listing.images.length > 0 ? (
                        <ExpoImage
                          source={{ uri: listing.images[0].image_url }}
                          className="w-full h-full"
                          contentFit="cover"
                        />
                      ) : (
                        <View className="w-full h-full justify-center items-center">
                          <Text className="text-gray-500">No Image</Text>
                        </View>
                      )}
                    </View>

                    {/* Content */}
                    <View className="p-3">
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                          <Text className="text-lg font-bold mb-1">
                            {listing.title}
                          </Text>
                          <Text className="text-xs text-gray-500 mb-1">
                            Ref: {listing.reference_number || "N/A"}
                          </Text>
                        </View>
                        {listing.is_reserved && (
                          <View className="bg-amber-500 px-2 py-1 rounded">
                            <Text className="text-white text-xs font-bold">
                              Reserved
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-blue-500 text-xl font-bold mb-2">
                        ${listing.price.toLocaleString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
