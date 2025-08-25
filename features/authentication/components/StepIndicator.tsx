import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, Text } from "react-native";

export interface PagesProp {
  key: string;
  title: string;
  icon: string;
}

const StepIndicator: React.FC<{
  PAGES: PagesProp[];
  currentPage: number;
  handlePageChange: (page: number) => void;
}> = ({ currentPage, handlePageChange, PAGES }) => {
  return (
    <View className="my-4">
      <View className="flex-row justify-between items-center relative ">
        <View className="absolute h-0.5 bg-gray-200 w-3/5 top-5" />
        {PAGES.map((page, index) => {
          const isClickable = !(index === 0 && currentPage > 0);
          return (
            <View key={page.key} className="items-center mx-4 z-10">
              <View>
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center
                  ${
                    currentPage === index
                      ? "bg-blue-600"
                      : currentPage > index
                      ? "bg-green-500"
                      : "bg-gray-200"
                  } ${!isClickable ? "opacity-60" : ""}`}
                >
                  {currentPage > index ? (
                    <Ionicons name="checkmark" size={20} color="white" />
                  ) : (
                    <View className="items-center justify-center">
                      <Ionicons
                        name={
                          PAGES[index].icon as keyof typeof Ionicons.glyphMap
                        }
                        size={18}
                        color="white"
                      />
                    </View>
                  )}
                </View>
              </View>

              <Text
                className={`text-xs mt-2 font-medium
                ${
                  currentPage === index
                    ? "text-blue-600"
                    : currentPage > index
                    ? "text-green-500"
                    : "text-gray-500"
                } ${!isClickable ? "opacity-60" : ""}`}
              >
                {page.title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default StepIndicator;
