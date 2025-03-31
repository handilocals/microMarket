import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { MapPin } from "lucide-react-native";

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
  distance?: number;
  location?: {
    state: string;
    city: string;
    locality: string;
    zipcode: string;
  };
  reference_number?: string;
  is_bargainable?: boolean;
  is_reserved?: boolean;
  reserved_for_user_id?: string | null;
}

interface MarketplaceListingCardProps {
  listing: Listing;
  onPress: () => void;
}

const MarketplaceListingCard = ({
  listing,
  onPress,
}: MarketplaceListingCardProps) => {
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  const getLocationString = () => {
    if (!listing.location) return "";
    const { city, state } = listing.location;
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return "";
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
      onPress={onPress}
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
            <Text className="text-lg font-bold mb-1">{listing.title}</Text>
            <Text className="text-xs text-gray-500 mb-1">
              Ref: {listing.reference_number || "N/A"}
            </Text>
          </View>
          {listing.is_reserved && (
            <View className="bg-amber-500 px-2 py-1 rounded">
              <Text className="text-white text-xs font-bold">Reserved</Text>
            </View>
          )}
        </View>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-blue-500 text-xl font-bold">
            {formatPrice(listing.price)}
          </Text>
          {listing.is_bargainable && (
            <View className="bg-green-100 px-2 py-1 rounded">
              <Text className="text-green-700 text-xs">Negotiable</Text>
            </View>
          )}
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            <Text className="text-gray-500 text-sm">
              {listing.category_name}
            </Text>
            <Text className="text-gray-500 text-sm mx-1">•</Text>
            <Text className="text-gray-500 text-sm">
              {formatDate(listing.created_at)}
            </Text>
          </View>
        </View>

        {getLocationString() ? (
          <View className="flex-row items-center">
            <MapPin size={14} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-1">
              {getLocationString()}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default MarketplaceListingCard;
