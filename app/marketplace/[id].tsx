import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Modal,
  Alert,
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
  Heart,
  MessageCircle,
  DollarSign,
  Check,
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
  reference_number?: string;
  is_bargainable?: boolean;
  is_reserved?: boolean;
  reserved_for_user_id?: string | null;
}

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showBargainModal, setShowBargainModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [isReserving, setIsReserving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchListing(id as string);
      checkIfFavorited(id as string);
    }
  }, [id]);

  const checkIfFavorited = async (listingId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("marketplace_saved_listings")
        .select("id")
        .eq("listing_id", listingId)
        .eq("user_id", user.id)
        .single();

      if (data) {
        setIsFavorited(true);
      }
    } catch (error) {
      // Not favorited or error
      console.log("Not favorited or error checking favorite status");
    }
  };

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
          reference_number: data.reference_number || "",
          is_bargainable: data.is_bargainable || false,
          is_reserved: data.is_reserved || false,
          reserved_for_user_id: data.reserved_for_user_id || null,
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
    setShowMessageModal(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !listing) {
      return;
    }

    try {
      const { error } = await supabase.from("marketplace_messages").insert({
        listing_id: listing.id,
        sender_id: user.id,
        receiver_id: listing.user_id,
        message: message,
      });

      if (error) throw error;

      Alert.alert("Success", "Message sent successfully!");
      setMessage("");
      setShowMessageModal(false);
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  const handleToggleFavorite = async () => {
    if (!user || !listing) return;

    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from("marketplace_saved_listings")
          .delete()
          .eq("listing_id", listing.id)
          .eq("user_id", user.id);

        if (error) throw error;
        setIsFavorited(false);
      } else {
        // Add to favorites
        const { error } = await supabase
          .from("marketplace_saved_listings")
          .insert({
            listing_id: listing.id,
            user_id: user.id,
          });

        if (error) throw error;
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to update favorites. Please try again.");
    }
  };

  const handleBargain = () => {
    if (!listing?.is_bargainable) return;
    setOfferPrice(listing.price.toString());
    setShowBargainModal(true);
  };

  const handleSubmitOffer = async () => {
    if (!offerPrice.trim() || !user || !listing) {
      return;
    }

    try {
      const offerMessage = `I'd like to make an offer of ${offerPrice} for your item (${listing.reference_number}).`;

      const { error } = await supabase.from("marketplace_messages").insert({
        listing_id: listing.id,
        sender_id: user.id,
        receiver_id: listing.user_id,
        message: offerMessage,
      });

      if (error) throw error;

      Alert.alert("Success", "Your offer has been sent to the seller!");
      setOfferPrice("");
      setShowBargainModal(false);
    } catch (error) {
      console.error("Error sending offer:", error);
      Alert.alert("Error", "Failed to send offer. Please try again.");
    }
  };

  const handleReserveItem = async () => {
    if (!user || !listing || user.id !== listing.user_id) return;

    try {
      setIsReserving(true);

      const { error } = await supabase
        .from("marketplace_listings")
        .update({
          is_reserved: !listing.is_reserved,
          reserved_for_user_id: listing.is_reserved
            ? null
            : listing.reserved_for_user_id,
        })
        .eq("id", listing.id);

      if (error) throw error;

      // Refresh listing data
      fetchListing(listing.id);

      Alert.alert(
        "Success",
        listing.is_reserved
          ? "Item is no longer reserved"
          : "Item has been marked as reserved",
      );
    } catch (error) {
      console.error("Error reserving item:", error);
      Alert.alert(
        "Error",
        "Failed to update reservation status. Please try again.",
      );
    } finally {
      setIsReserving(false);
    }
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
        <View className="flex-row">
          <TouchableOpacity onPress={handleToggleFavorite} className="mr-4">
            <Heart
              size={24}
              color={isFavorited ? "#ef4444" : "#000"}
              fill={isFavorited ? "#ef4444" : "none"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare}>
            <Share size={24} color="#000" />
          </TouchableOpacity>
        </View>
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
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <Text className="text-2xl font-bold">{listing.title}</Text>
              <Text className="text-sm text-gray-500">
                Ref: {listing.reference_number}
              </Text>
            </View>
            {listing.is_reserved && (
              <View className="bg-amber-500 px-3 py-1 rounded-md">
                <Text className="text-white font-bold">Reserved</Text>
              </View>
            )}
          </View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-blue-500 text-2xl font-bold">
              {formatPrice(listing.price)}
            </Text>
            {listing.is_bargainable && (
              <View className="bg-green-100 px-3 py-1 rounded-md">
                <Text className="text-green-700">Price Negotiable</Text>
              </View>
            )}
          </View>

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

      {/* Action Buttons */}
      <View className="p-4 border-t border-gray-200">
        {user?.id === listing.user_id ? (
          /* Seller Actions */
          <TouchableOpacity
            className={`w-full p-4 ${listing.is_reserved ? "bg-amber-500" : "bg-blue-500"} rounded-lg items-center flex-row justify-center`}
            onPress={handleReserveItem}
            disabled={isReserving}
          >
            {isReserving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Check size={20} color="#fff" className="mr-2" />
                <Text className="text-white font-bold">
                  {listing.is_reserved
                    ? "Mark as Available"
                    : "Mark as Reserved"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          /* Buyer Actions */
          <View className="flex-row">
            <TouchableOpacity
              className="flex-1 p-4 bg-blue-500 rounded-lg items-center mr-2 flex-row justify-center"
              onPress={handleContactSeller}
            >
              <MessageCircle size={20} color="#fff" className="mr-2" />
              <Text className="text-white font-bold">Message</Text>
            </TouchableOpacity>

            {listing.is_bargainable && (
              <TouchableOpacity
                className="flex-1 p-4 bg-green-500 rounded-lg items-center ml-2 flex-row justify-center"
                onPress={handleBargain}
              >
                <DollarSign size={20} color="#fff" className="mr-2" />
                <Text className="text-white font-bold">Make Offer</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Message Modal */}
      <Modal
        visible={showMessageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-4">
            <Text className="text-xl font-bold mb-4">Message Seller</Text>
            <Text className="text-gray-500 mb-2">
              About: {listing?.title} (Ref: {listing?.reference_number})
            </Text>

            <TextInput
              className="border border-gray-300 rounded-md p-3 h-32 mb-4"
              placeholder="Write your message here..."
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
            />

            <View className="flex-row">
              <TouchableOpacity
                className="flex-1 p-4 bg-gray-200 rounded-lg items-center mr-2"
                onPress={() => setShowMessageModal(false)}
              >
                <Text className="font-bold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 p-4 bg-blue-500 rounded-lg items-center ml-2"
                onPress={handleSendMessage}
              >
                <Text className="text-white font-bold">Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bargain Modal */}
      <Modal
        visible={showBargainModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBargainModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-4">
            <Text className="text-xl font-bold mb-4">Make an Offer</Text>
            <Text className="text-gray-500 mb-2">
              Item: {listing?.title} (Ref: {listing?.reference_number})
            </Text>
            <Text className="text-gray-500 mb-4">
              Listed Price: {listing ? formatPrice(listing.price) : "$0.00"}
            </Text>

            <View className="flex-row items-center border border-gray-300 rounded-md overflow-hidden mb-4">
              <View className="bg-gray-100 p-3">
                <Text className="font-bold">$</Text>
              </View>
              <TextInput
                className="flex-1 p-3"
                placeholder="0.00"
                value={offerPrice}
                onChangeText={(text) => {
                  // Only allow numbers and decimal point
                  const filtered = text.replace(/[^0-9.]/g, "");
                  setOfferPrice(filtered);
                }}
                keyboardType="decimal-pad"
              />
            </View>

            <View className="flex-row">
              <TouchableOpacity
                className="flex-1 p-4 bg-gray-200 rounded-lg items-center mr-2"
                onPress={() => setShowBargainModal(false)}
              >
                <Text className="font-bold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 p-4 bg-green-500 rounded-lg items-center ml-2"
                onPress={handleSubmitOffer}
              >
                <Text className="text-white font-bold">Submit Offer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
