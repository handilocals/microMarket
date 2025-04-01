import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { ChevronDown, Search, X } from "lucide-react-native";

interface LocationDropdownsProps {
  location: {
    state: string;
    city: string;
    locality: string;
    zipcode: string;
  };
  onLocationChange: (field: string, value: string) => void;
}

const LocationDropdowns = ({
  location,
  onLocationChange,
}: LocationDropdownsProps) => {
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showLocalityModal, setShowLocalityModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // These would typically come from an API
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [localities, setLocalities] = useState<string[]>([]);

  useEffect(() => {
    // Load states data
    loadStates();
  }, []);

  useEffect(() => {
    // Load cities based on selected state
    if (location.state) {
      loadCities(location.state);
    } else {
      setCities([]);
    }
  }, [location.state]);

  useEffect(() => {
    // Load localities based on selected city
    if (location.city) {
      loadLocalities(location.state, location.city);
    } else {
      setLocalities([]);
    }
  }, [location.city]);

  const loadStates = () => {
    // In a real app, this would be an API call
    // For this example, we'll use a static list of US states
    setStates([
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ]);
  };

  const loadCities = (state: string) => {
    // In a real app, this would be an API call based on the selected state
    // For this example, we'll use a static list based on the state
    const citiesByState: Record<string, string[]> = {
      California: [
        "Los Angeles",
        "San Francisco",
        "San Diego",
        "Sacramento",
        "Oakland",
      ],
      "New York": [
        "New York City",
        "Buffalo",
        "Rochester",
        "Syracuse",
        "Albany",
      ],
      Texas: ["Houston", "Austin", "Dallas", "San Antonio", "Fort Worth"],
      Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee"],
      // Add more states as needed
    };

    setCities(citiesByState[state] || ["City 1", "City 2", "City 3"]); // Fallback for states not in our list
  };

  const loadLocalities = (state: string, city: string) => {
    // In a real app, this would be an API call based on the selected city
    // For this example, we'll use a static list
    const localitiesByCity: Record<string, string[]> = {
      "Los Angeles": [
        "Downtown",
        "Hollywood",
        "Venice",
        "Silver Lake",
        "Echo Park",
      ],
      "San Francisco": [
        "Mission District",
        "SoMa",
        "North Beach",
        "Marina",
        "Castro",
      ],
      "New York City": [
        "Manhattan",
        "Brooklyn",
        "Queens",
        "Bronx",
        "Staten Island",
      ],
      Miami: [
        "Downtown",
        "South Beach",
        "Brickell",
        "Wynwood",
        "Little Havana",
      ],
      // Add more cities as needed
    };

    setLocalities(
      localitiesByCity[city] || ["Locality 1", "Locality 2", "Locality 3"],
    ); // Fallback
  };

  const filteredStates = searchQuery
    ? states.filter((state) =>
        state.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : states;

  const filteredCities = searchQuery
    ? cities.filter((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : cities;

  const filteredLocalities = searchQuery
    ? localities.filter((locality) =>
        locality.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : localities;

  const renderModal = (
    title: string,
    items: string[],
    onSelect: (item: string) => void,
    onClose: () => void,
  ) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-gray-900 rounded-t-xl h-2/3">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {title}
            </Text>
            <TouchableOpacity
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onPress={onClose}
            >
              <X size={22} className="text-gray-700 dark:text-gray-300" />
            </TouchableOpacity>
          </View>

          <View className="p-4">
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 mb-4">
              <Search size={18} className="text-gray-500 dark:text-gray-400" />
              <TextInput
                className="flex-1 p-2 text-gray-800 dark:text-gray-200"
                placeholder={`Search ${title.toLowerCase()}...`}
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity
                  className="p-1 rounded-full"
                  onPress={() => setSearchQuery("")}
                >
                  <X size={16} className="text-gray-500 dark:text-gray-400" />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView className="max-h-96">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onPress={() => {
                      onSelect(item);
                      setSearchQuery("");
                      onClose();
                    }}
                  >
                    <Text className="text-base text-gray-800 dark:text-gray-200">
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="p-4 items-center">
                  <Text className="text-gray-500 dark:text-gray-400">
                    No items found
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="space-y-4">
      {/* State Dropdown */}
      <View>
        <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          State
        </Text>
        <TouchableOpacity
          className="flex-row justify-between items-center p-3.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          onPress={() => {
            setSearchQuery("");
            setShowStateModal(true);
          }}
        >
          <Text className="text-gray-800 dark:text-gray-200">
            {location.state || "Select State"}
          </Text>
          <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
        </TouchableOpacity>
      </View>

      {/* City Dropdown - Only enabled if state is selected */}
      <View>
        <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          City
        </Text>
        <TouchableOpacity
          className={`flex-row justify-between items-center p-3.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 ${!location.state ? "opacity-50" : ""}`}
          onPress={() => {
            if (location.state) {
              setSearchQuery("");
              setShowCityModal(true);
            }
          }}
          disabled={!location.state}
        >
          <Text className="text-gray-800 dark:text-gray-200">
            {location.city || "Select City"}
          </Text>
          <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
        </TouchableOpacity>
      </View>

      {/* Locality Dropdown - Only enabled if city is selected */}
      <View>
        <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          Locality/Neighborhood
        </Text>
        <TouchableOpacity
          className={`flex-row justify-between items-center p-3.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 ${!location.city ? "opacity-50" : ""}`}
          onPress={() => {
            if (location.city) {
              setSearchQuery("");
              setShowLocalityModal(true);
            }
          }}
          disabled={!location.city}
        >
          <Text className="text-gray-800 dark:text-gray-200">
            {location.locality || "Select Locality"}
          </Text>
          <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
        </TouchableOpacity>
      </View>

      {/* Zipcode Input */}
      <View>
        <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          Zipcode
        </Text>
        <TextInput
          className="p-3.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          placeholder="Enter Zipcode"
          placeholderTextColor="#9ca3af"
          value={location.zipcode}
          onChangeText={(text) => onLocationChange("zipcode", text)}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      {/* Modals */}
      {showStateModal &&
        renderModal(
          "Select State",
          filteredStates,
          (state) => {
            onLocationChange("state", state);
            // Reset dependent fields
            onLocationChange("city", "");
            onLocationChange("locality", "");
          },
          () => setShowStateModal(false),
        )}

      {showCityModal &&
        renderModal(
          "Select City",
          filteredCities,
          (city) => {
            onLocationChange("city", city);
            // Reset dependent field
            onLocationChange("locality", "");
          },
          () => setShowCityModal(false),
        )}

      {showLocalityModal &&
        renderModal(
          "Select Locality",
          filteredLocalities,
          (locality) => {
            onLocationChange("locality", locality);
          },
          () => setShowLocalityModal(false),
        )}
    </View>
  );
};

export default LocationDropdowns;
