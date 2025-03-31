import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import { Stack, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Plus, X, Camera } from "lucide-react-native";
import { Image as ExpoImage } from "expo-image";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import LocationDropdowns from "../components/LocationDropdowns";

export default function CreateListingScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  const [location, setLocation] = useState({
    state: "",
    city: "",
    locality: "",
    zipcode: "",
  });
  const [isBargainable, setIsBargainable] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsFetchingCategories(true);
      const { data, error } = await supabase
        .from("marketplace_categories")
        .select("id, name");

      if (error) throw error;

      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsFetchingCategories(false);
    }
  };

  const handleAddImage = () => {
    // In a real app, this would open the image picker
    // For this example, we'll add a placeholder image
    if (images.length < 5) {
      const placeholderImage = `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80&random=${Math.random()}`;
      setImages([...images, placeholderImage]);
    } else {
      Alert.alert(
        "Maximum Images",
        "You can only add up to 5 images per listing.",
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleLocationChange = (field: string, value: string) => {
    setLocation({ ...location, [field]: value });
  };

  const handleSubmit = async () => {
    if (!title || !description || !price || !selectedCategory) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);

      // Create the listing
      const { data: listingData, error: listingError } = await supabase
        .from("marketplace_listings")
        .insert({
          title,
          description,
          price: parseFloat(price),
          category_id: selectedCategory,
          user_id: user?.id,
          status: "active",
          location,
          is_bargainable: isBargainable,
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // Upload images
      if (images.length > 0 && listingData) {
        const imagePromises = images.map(async (imageUrl, index) => {
          return supabase.from("marketplace_listing_images").insert({
            listing_id: listingData.id,
            image_url: imageUrl,
            display_order: index,
          });
        });

        await Promise.all(imagePromises);
      }

      Alert.alert("Success", "Your listing has been created successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/marketplace"),
        },
      ]);
    } catch (error) {
      console.error("Error creating listing:", error);
      Alert.alert(
        "Error",
        "There was an error creating your listing. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text className="text-lg font-bold">Create Listing</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Title */}
        <View className="mb-4">
          <Text className="text-base font-semibold mb-2">Title *</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3"
            placeholder="What are you selling?"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Price */}
        <View className="mb-4">
          <Text className="text-base font-semibold mb-2">Price *</Text>
          <View className="flex-row items-center border border-gray-300 rounded-md overflow-hidden">
            <View className="bg-gray-100 p-3">
              <Text className="font-bold">$</Text>
            </View>
            <TextInput
              className="flex-1 p-3"
              placeholder="0.00"
              value={price}
              onChangeText={(text) => {
                // Only allow numbers and decimal point
                const filtered = text.replace(/[^0-9.]/g, "");
                setPrice(filtered);
              }}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Category */}
        <View className="mb-4">
          <Text className="text-base font-semibold mb-2">Category *</Text>
          {isFetchingCategories ? (
            <ActivityIndicator size="small" color="#1DA1F2" />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`mr-2 p-3 rounded-md ${selectedCategory === category.id ? "bg-blue-500" : "bg-gray-200"}`}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text
                    className={`${selectedCategory === category.id ? "text-white" : "text-gray-700"}`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Location */}
        <View className="mb-4">
          <Text className="text-base font-semibold mb-2">Location</Text>
          <LocationDropdowns
            location={location}
            onLocationChange={handleLocationChange}
          />
        </View>

        {/* Images */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-semibold">Images (Max 5)</Text>
            <Text className="text-gray-500 text-sm">{images.length}/5</Text>
          </View>

          <View className="flex-row flex-wrap">
            {images.map((image, index) => (
              <View key={index} className="w-1/3 aspect-square p-1 relative">
                <ExpoImage
                  source={{ uri: image }}
                  className="w-full h-full rounded-md"
                  contentFit="cover"
                />
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
                  onPress={() => handleRemoveImage(index)}
                >
                  <X size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}

            {images.length < 5 && (
              <TouchableOpacity
                className="w-1/3 aspect-square p-1"
                onPress={handleAddImage}
              >
                <View className="w-full h-full border-2 border-dashed border-gray-300 rounded-md justify-center items-center">
                  <Camera size={24} color="#6b7280" />
                  <Text className="text-gray-500 text-sm mt-1">Add Photo</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bargainable Option */}
        <View className="mb-4">
          <Text className="text-base font-semibold mb-2">
            Allow Price Bargaining
          </Text>
          <View className="flex-row items-center">
            <Switch
              value={isBargainable}
              onValueChange={setIsBargainable}
              trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
              thumbColor={isBargainable ? "#3b82f6" : "#f4f4f5"}
            />
            <Text className="ml-2 text-gray-700">
              {isBargainable ? "Buyers can bargain" : "Fixed price"}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-base font-semibold mb-2">Description *</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 h-32"
            placeholder="Describe what you're selling..."
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="w-full p-4 bg-blue-500 rounded-lg items-center"
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-bold">Post Listing</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
