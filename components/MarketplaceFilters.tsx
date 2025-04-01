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
    return `${price.toLocaleString()}`;
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
    <View className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <ScrollView className="p-5">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Filters
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} className="text-gray-700 dark:text-gray-300" />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <View className="mb-6">
          <Text className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Category
          </Text>
          <TouchableOpacity
            className="flex-row justify-between items-center p-3.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text className="text-gray-800 dark:text-gray-200">
              {getCategoryName(localCategory)}
            </Text>
            <ChevronDown
              size={18}
              className="text-gray-500 dark:text-gray-400"
            />
          </TouchableOpacity>

          {showCategoryDropdown && (
            <View className="border border-gray-300 dark:border-gray-700 rounded-lg mt-1 bg-white dark:bg-gray-800 shadow-sm">
              <TouchableOpacity
                className="p-3.5 flex-row justify-between items-center border-b border-gray-100 dark:border-gray-700"
                onPress={() => {
                  setLocalCategory(null);
                  setShowCategoryDropdown(false);
                }}
              >
                <Text className="text-gray-800 dark:text-gray-200">
                  All Categories
                </Text>
                {localCategory === null && (
                  <Check size={18} className="text-primary-500" />
                )}
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className="p-3.5 flex-row justify-between items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  onPress={() => {
                    setLocalCategory(category.id);
                    setShowCategoryDropdown(false);
                  }}
                >
                  <Text className="text-gray-800 dark:text-gray-200">
                    {category.name}
                  </Text>
                  {localCategory === category.id && (
                    <Check size={18} className="text-primary-500" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Price Range Filter */}
        <View className="mb-6">
          <Text className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Price Range
          </Text>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-700 dark:text-gray-300 font-medium">
              {formatPrice(localPriceRange[0])}
            </Text>
            <Text className="text-gray-700 dark:text-gray-300 font-medium">
              {formatPrice(localPriceRange[1])}
            </Text>
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
          <Text className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Distance
          </Text>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-700 dark:text-gray-300 font-medium">
              0 miles
            </Text>
            <Text className="text-gray-700 dark:text-gray-300 font-medium">
              {localDistance} miles
            </Text>
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
          <Text className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Sort By
          </Text>
          <TouchableOpacity
            className="flex-row justify-between items-center p-3.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            onPress={() => setShowSortDropdown(!showSortDropdown)}
          >
            <Text className="text-gray-800 dark:text-gray-200">
              {getSortLabel(localSortOption)}
            </Text>
            <ChevronDown
              size={18}
              className="text-gray-500 dark:text-gray-400"
            />
          </TouchableOpacity>

          {showSortDropdown && (
            <View className="border border-gray-300 dark:border-gray-700 rounded-lg mt-1 bg-white dark:bg-gray-800 shadow-sm">
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className="p-3.5 flex-row justify-between items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  onPress={() => {
                    setLocalSortOption(option.value);
                    setShowSortDropdown(false);
                  }}
                >
                  <Text className="text-gray-800 dark:text-gray-200">
                    {option.label}
                  </Text>
                  {localSortOption === option.value && (
                    <Check size={18} className="text-primary-500" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-5 space-x-3">
          <TouchableOpacity
            className="flex-1 p-3.5 border border-gray-300 dark:border-gray-700 rounded-lg items-center bg-white dark:bg-gray-800"
            onPress={handleReset}
          >
            <Text className="font-semibold text-gray-700 dark:text-gray-300">
              Reset
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 p-3.5 bg-primary-500 dark:bg-primary-600 rounded-lg items-center shadow-sm"
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
