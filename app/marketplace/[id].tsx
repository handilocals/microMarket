import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Share,
  MapPin,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  created_at: string;
  category_id: string;
  category_name: string;
  user_id: string;
  username: string;
  avatar: string;
  images: { id: string; image_url: string }[];
  location?: {
    state: string;
    city: string;
    locality: string;
    zipcode: string;
  };
}

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchListing(id as string);
    }
  }, [id]);

  const fetchListing = async (listingId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select(
          "*, marketplace_categories(name), profiles(username, avatar), marketplace_listing_images(id, image_url)",
        )
        .eq("id", listingId)
        .single();

      if (error) throw error;

      if (data) {
        setListing({
          id: data.id,
          title: data.title,
          description: data.description,
          price: data.price,
          status: data.status,
          created_at: data.created_at,
          category_id: data.category_id,
          category_name: data.marketplace_categories?.name || "Uncategorized",
          user_id: data.user_id,
          username: data.profiles?.username || "Anonymous",
          avatar:
            data.profiles?.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous",
          images: data.marketplace_listing_images || [],
          location: data.location || {
            state: "",
            city: "",
            locality: "",
            zipcode: "",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getLocationString = () => {
    if (!listing?.location) return "";
    const { city, state, locality, zipcode } = listing.location;
    let locationParts = [];
    if (locality) locationParts.push(locality);
    if (city) locationParts.push(city);
    if (state) locationParts.push(state);
    if (zipcode) locationParts.push(zipcode);
    return locationParts.join(", ");
  };

  const handleShare = () => {
    console.log("Share listing", listing?.id);
    // Implement share functionality
  };

  const handleContactSeller = () => {
    console.log("Contact seller", listing?.user_id);
    // Implement contact seller functionality
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (listing?.images && currentImageIndex < listing.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg text-gray-500">Listing not found</Text>
        <TouchableOpacity
          className="mt-4 p-3 bg-blue-500 rounded-md"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Limit to maximum 5 images
  const displayImages = listing.images.slice(0, 5);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Custom Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Share size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Image Gallery */}
        <View className="relative w-full h-72 bg-gray-200">
          {displayImages.length > 0 ? (
            <>
              <ExpoImage
                source={{ uri: displayImages[currentImageIndex].image_url }}
                className="w-full h-full"
                contentFit="cover"
              />

              {/* Image Navigation */}
              {displayImages.length > 1 && (
                <View className="absolute bottom-4 w-full flex-row justify-center">
                  {displayImages.map((_, index) => (
                    <View
                      key={index}
                      className={`h-2 w-2 rounded-full mx-1 ${index === currentImageIndex ? "bg-blue-500" : "bg-gray-300"}`}
                    />
                  ))}
                </View>
              )}

              {/* Left/Right Navigation Buttons */}
              {currentImageIndex > 0 && (
                <TouchableOpacity
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2"
                  onPress={handlePreviousImage}
                >
                  <ChevronLeft size={24} color="#000" />
                </TouchableOpacity>
              )}

              {displayImages.length > 1 &&
                currentImageIndex < displayImages.length - 1 && (
                  <TouchableOpacity
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2"
                    onPress={handleNextImage}
                  >
                    <ChevronRight size={24} color="#000" />
                  </TouchableOpacity>
                )}

              {/* Image Counter */}
              <View className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-md">
                <Text className="text-white text-xs">
                  {currentImageIndex + 1}/{displayImages.length}
                </Text>
              </View>
            </>
          ) : (
            <View className="w-full h-full justify-center items-center">
              <Text className="text-gray-500">No Images Available</Text>
            </View>
          )}
        </View>

        {/* Listing Details */}
        <View className="p-4">
          <Text className="text-2xl font-bold mb-2">{listing.title}</Text>
          <Text className="text-blue-500 text-2xl font-bold mb-4">
            {formatPrice(listing.price)}
          </Text>

          {/* Category and Date */}
          <View className="flex-row mb-4">
            <View className="flex-row items-center mr-4">
              <Tag size={16} color="#6b7280" />
              <Text className="text-gray-500 ml-1">
                {listing.category_name}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Calendar size={16} color="#6b7280" />
              <Text className="text-gray-500 ml-1">
                {formatDate(listing.created_at)}
              </Text>
            </View>
          </View>

          {/* Location */}
          {getLocationString() && (
            <View className="flex-row items-center mb-4">
              <MapPin size={16} color="#6b7280" />
              <Text className="text-gray-500 ml-1">{getLocationString()}</Text>
            </View>
          )}

          {/* Seller Info */}
          <View className="flex-row items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <ExpoImage
              source={{ uri: listing.avatar }}
              className="w-10 h-10 rounded-full mr-3"
              contentFit="cover"
            />
            <View>
              <Text className="font-semibold">{listing.username}</Text>
              <Text className="text-gray-500 text-sm">Seller</Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2">Description</Text>
            <Text className="text-gray-700">{listing.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Contact Button */}
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="w-full p-4 bg-blue-500 rounded-lg items-center"
          onPress={handleContactSeller}
        >
          <Text className="text-white font-bold">Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
