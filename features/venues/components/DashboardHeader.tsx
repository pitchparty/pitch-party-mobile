// src/features/venues/components/DashboardHeader.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";

interface DashboardHeaderProps {
  venueName: string;
  date: Date;
  hasMissingDocuments: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  venueName,
  date,
  hasMissingDocuments,
}) => {

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.container} className="bg-white dark:bg-gray-800">
      <View style={styles.headerContent}>
        <View style={styles.venueInfoContainer}>
          <Text style={styles.venueName} numberOfLines={1} ellipsizeMode="tail" className="dark:text-white">
            {venueName}
          </Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.editButton,
            !hasMissingDocuments ? styles.warningButton : styles.successButton,
          ]}
          onPress={() => router.push("/(manager)/manager-account")}
        >
          {!hasMissingDocuments ? (
            <View style={styles.statusContainer}>
              <Ionicons name="warning-outline" size={22} color="#FFF" />
              <Text style={styles.statusText}>
                Missing documents
              </Text>
            </View>
          ) : (
            <View style={styles.statusContainer}>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="#FFF"
              />
              <Text style={styles.statusText}>
                All set
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  venueInfoContainer: {
    flex: 1,
    marginRight: 12,
  },
  venueName: {
    fontSize: 24,
    fontWeight: "700",
    // color: "#111827",
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  date: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
  editButton: {
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 40,
    maxWidth: '50%',
  },
  warningButton: {
    backgroundColor: "#F59E0B",
  },
  successButton: {
    backgroundColor: "#10B981",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
    flexShrink: 1,
  },
});

export default DashboardHeader;
