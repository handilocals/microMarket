import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";

// Import components
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import ComposeButton from "../components/ComposeButton";
import MarketplaceFilters from "../components/MarketplaceFilters";
import MarketplaceListingCard from "../components/MarketplaceListingCard";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

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
}

export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const { user } = useAuth();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [distanceRadius, setDistanceRadius] = useState<number>(50);
  const [sortOption, setSortOption] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchListings();
    }
  }, [user, selectedCategory, sortOption]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("marketplace_categories")
        .select("id, name");

      if (error) throw error;

      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchListings = async () => {
    try {
      setIsLoading(true);

      let query = supabase
        .from("marketplace_listings")
        .select(
          "*, marketplace_categories(name), profiles(username, avatar), marketplace_listing_images(id, image_url)",
        )
        .eq("status", "active");

      // Apply category filter if selected
      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      // Apply price range filter
      query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);

      // Apply sorting
      switch (sortOption) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "price_low_high":
          query = query.order("price", { ascending: true });
          break;
        case "price_high_low":
          query = query.order("price", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        // Format the listings data
        const formattedListings = data.map((listing) => ({
          id: listing.id,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          status: listing.status,
          created_at: listing.created_at,
          category_id: listing.category_id,
          category_name:
            listing.marketplace_categories?.name || "Uncategorized",
          user_id: listing.user_id,
          username: listing.profiles?.username || "Anonymous",
          avatar:
            listing.profiles?.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous",
          images: listing.marketplace_listing_images || [],
          location: listing.location || {
            state: "",
            city: "",
            locality: "",
            zipcode: "",
          },
        }));

        // Filter by distance if user location is available
        // This is a simplified version - in a real app, you would calculate actual distances
        // based on user's current location and the listing's location
        const filteredByDistance = formattedListings;

        setListings(filteredByDistance);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (
    category: string | null,
    price: [number, number],
    distance: number,
    sort: string,
  ) => {
    setSelectedCategory(category);
    setPriceRange(price);
    setDistanceRadius(distance);
    setSortOption(sort);
    setShowFilters(false);
    fetchListings();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleComposePress = () => {
    // Navigate to create listing screen
    router.push("/create-listing");
  };

  if (isLoading && listings.length === 0) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack.Screen options={{ title: "Marketplace" }} />

      {/* Header */}
      <Header
        title="Marketplace"
        onFilterPress={toggleFilters}
        showFilterIcon
      />

      {/* Filters */}
      {showFilters && (
        <MarketplaceFilters
          categories={categories}
          selectedCategory={selectedCategory}
          priceRange={priceRange}
          distanceRadius={distanceRadius}
          sortOption={sortOption}
          onApplyFilters={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Listings */}
      <ScrollView className="flex-1 p-4">
        {listings.length === 0 ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500 text-lg">No listings found</Text>
          </View>
        ) : (
          <View className="flex-1">
            {listings.map((listing) => (
              <MarketplaceListingCard
                key={listing.id}
                listing={listing}
                onPress={() => router.push(`/marketplace/${listing.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Compose Button - for creating new listings */}
      <ComposeButton onPress={handleComposePress} />

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="marketplace" />
    </View>
  );
}
