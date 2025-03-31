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
        <View className="bg-white rounded-t-xl h-2/3">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View className="p-4">
            <View className="flex-row items-center bg-gray-100 rounded-md px-3 mb-4">
              <Search size={20} color="#6b7280" />
              <TextInput
                className="flex-1 p-2"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X size={16} color="#6b7280" />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView className="max-h-96">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    className="p-4 border-b border-gray-100"
                    onPress={() => {
                      onSelect(item);
                      setSearchQuery("");
                      onClose();
                    }}
                  >
                    <Text className="text-base">{item}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="p-4 items-center">
                  <Text className="text-gray-500">No items found</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View>
      {/* State Dropdown */}
      <View className="mb-3">
        <Text className="text-sm text-gray-500 mb-1">State</Text>
        <TouchableOpacity
          className="flex-row justify-between items-center p-3 border border-gray-300 rounded-md"
          onPress={() => {
            setSearchQuery("");
            setShowStateModal(true);
          }}
        >
          <Text>{location.state || "Select State"}</Text>
          <ChevronDown size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* City Dropdown - Only enabled if state is selected */}
      <View className="mb-3">
        <Text className="text-sm text-gray-500 mb-1">City</Text>
        <TouchableOpacity
          className={`flex-row justify-between items-center p-3 border border-gray-300 rounded-md ${!location.state ? "opacity-50" : ""}`}
          onPress={() => {
            if (location.state) {
              setSearchQuery("");
              setShowCityModal(true);
            }
          }}
          disabled={!location.state}
        >
          <Text>{location.city || "Select City"}</Text>
          <ChevronDown size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Locality Dropdown - Only enabled if city is selected */}
      <View className="mb-3">
        <Text className="text-sm text-gray-500 mb-1">
          Locality/Neighborhood
        </Text>
        <TouchableOpacity
          className={`flex-row justify-between items-center p-3 border border-gray-300 rounded-md ${!location.city ? "opacity-50" : ""}`}
          onPress={() => {
            if (location.city) {
              setSearchQuery("");
              setShowLocalityModal(true);
            }
          }}
          disabled={!location.city}
        >
          <Text>{location.locality || "Select Locality"}</Text>
          <ChevronDown size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Zipcode Input */}
      <View className="mb-3">
        <Text className="text-sm text-gray-500 mb-1">Zipcode</Text>
        <TextInput
          className="p-3 border border-gray-300 rounded-md"
          placeholder="Enter Zipcode"
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
