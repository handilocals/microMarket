import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { X, Check, ChevronDown } from "lucide-react-native";
import Slider from "../components/Slider";

interface MarketplaceFiltersProps {
  categories: { id: string; name: string }[];
  selectedCategory: string | null;
  priceRange: [number, number];
  distanceRadius: number;
  sortOption: string;
  onApplyFilters: (
    category: string | null,
    price: [number, number],
    distance: number,
    sort: string,
  ) => void;
  onClose: () => void;
}

const MarketplaceFilters = ({
  categories,
  selectedCategory,
  priceRange,
  distanceRadius,
  sortOption,
  onApplyFilters,
  onClose,
}: MarketplaceFiltersProps) => {
  const [localCategory, setLocalCategory] = useState<string | null>(
    selectedCategory,
  );
  const [localPriceRange, setLocalPriceRange] =
    useState<[number, number]>(priceRange);
  const [localDistance, setLocalDistance] = useState<number>(distanceRadius);
  const [localSortOption, setLocalSortOption] = useState<string>(sortOption);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    setLocalCategory(selectedCategory);
    setLocalPriceRange(priceRange);
    setLocalDistance(distanceRadius);
    setLocalSortOption(sortOption);
  }, [selectedCategory, priceRange, distanceRadius, sortOption]);

  const handleApply = () => {
    onApplyFilters(
      localCategory,
      localPriceRange,
      localDistance,
      localSortOption,
    );
  };

  const handleReset = () => {
    setLocalCategory(null);
    setLocalPriceRange([0, 10000]);
    setLocalDistance(50);
    setLocalSortOption("newest");
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const sortOptions = [
    { value: "newest", label: "Newly Listed" },
    { value: "price_low_high", label: "Price: Low to High" },
    { value: "price_high_low", label: "Price: High to Low" },
  ];

  const getSortLabel = (value: string) => {
    return (
      sortOptions.find((option) => option.value === value)?.label || "Sort By"
    );
  };

  const getCategoryName = (id: string | null) => {
    if (!id) return "All Categories";
    return categories.find((cat) => cat.id === id)?.name || "All Categories";
  };

  return (
    <View className="bg-white border-b border-gray-200">
      <ScrollView className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold">Filters</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <X size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <View className="mb-6">
          <Text className="text-base font-semibold mb-2">Category</Text>
          <TouchableOpacity
            className="flex-row justify-between items-center p-3 border border-gray-300 rounded-md"
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text>{getCategoryName(localCategory)}</Text>
            <ChevronDown size={20} color="#000" />
          </TouchableOpacity>

          {showCategoryDropdown && (
            <View className="border border-gray-300 rounded-md mt-1 bg-white">
              <TouchableOpacity
                className="p-3 flex-row justify-between items-center"
                onPress={() => {
                  setLocalCategory(null);
                  setShowCategoryDropdown(false);
                }}
              >
                <Text>All Categories</Text>
                {localCategory === null && <Check size={18} color="#1DA1F2" />}
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className="p-3 flex-row justify-between items-center"
                  onPress={() => {
                    setLocalCategory(category.id);
                    setShowCategoryDropdown(false);
                  }}
                >
                  <Text>{category.name}</Text>
                  {localCategory === category.id && (
                    <Check size={18} color="#1DA1F2" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Price Range Filter */}
        <View className="mb-6">
          <Text className="text-base font-semibold mb-2">Price Range</Text>
          <View className="flex-row justify-between mb-2">
            <Text>{formatPrice(localPriceRange[0])}</Text>
            <Text>{formatPrice(localPriceRange[1])}</Text>
          </View>
          <Slider
            minValue={0}
            maxValue={10000}
            step={100}
            values={localPriceRange}
            onValuesChange={(values) =>
              setLocalPriceRange(values as [number, number])
            }
          />
        </View>

        {/* Distance Filter */}
        <View className="mb-6">
          <Text className="text-base font-semibold mb-2">Distance</Text>
          <View className="flex-row justify-between mb-2">
            <Text>0 miles</Text>
            <Text>{localDistance} miles</Text>
          </View>
          <Slider
            minValue={0}
            maxValue={100}
            step={5}
            values={[localDistance]}
            onValuesChange={(values) => setLocalDistance(values[0])}
          />
        </View>

        {/* Sort Options */}
        <View className="mb-6">
          <Text className="text-base font-semibold mb-2">Sort By</Text>
          <TouchableOpacity
            className="flex-row justify-between items-center p-3 border border-gray-300 rounded-md"
            onPress={() => setShowSortDropdown(!showSortDropdown)}
          >
            <Text>{getSortLabel(localSortOption)}</Text>
            <ChevronDown size={20} color="#000" />
          </TouchableOpacity>

          {showSortDropdown && (
            <View className="border border-gray-300 rounded-md mt-1 bg-white">
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className="p-3 flex-row justify-between items-center"
                  onPress={() => {
                    setLocalSortOption(option.value);
                    setShowSortDropdown(false);
                  }}
                >
                  <Text>{option.label}</Text>
                  {localSortOption === option.value && (
                    <Check size={18} color="#1DA1F2" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="flex-1 mr-2 p-3 border border-gray-300 rounded-md items-center"
            onPress={handleReset}
          >
            <Text className="font-semibold">Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 ml-2 p-3 bg-blue-500 rounded-md items-center"
            onPress={handleApply}
          >
            <Text className="font-semibold text-white">Apply</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MarketplaceFilters;
