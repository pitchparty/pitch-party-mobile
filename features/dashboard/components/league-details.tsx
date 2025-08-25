import React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import Card from "@/components/Card";
import { colorScheme } from "nativewind";

const LeagueDetails = () => {

  const leagues = [
    {
      id: "700",
      uid: "s:600~l:700",
      name: "English Premier League",
      abbreviation: "Premier League",
      midsizeName: "ENG.1",
      slug: "eng.1",
      season: {
        year: 2024,
        startDate: "2024-06-01T04:00Z",
        endDate: "2025-06-01T03:59Z",
        displayName: "2024-25 English Premier League",
        type: {
          id: "1",
          type: 12654,
          name: "2024-25 English Premier League",
          abbreviation: "2024-25 English Premier League",
        },
      },
      logos: [
        {
          href: "https://a.espncdn.com/i/leaguelogos/soccer/500/23.png",
          width: 500,
          height: 500,
          alt: "",
          rel: ["full", "default"],
          lastUpdated: "2019-05-08T16:07Z",
        },
        {
          href: "https://a.espncdn.com/i/leaguelogos/soccer/500-dark/23.png",
          width: 500,
          height: 500,
          alt: "",
          rel: ["full", "dark"],
          lastUpdated: "2021-08-10T20:43Z",
        },
      ],
    },
  ];

  return (
    <>
      {leagues.map((league) => (
        <Card key={league.id}>
          <View className="flex-row items-center">
            <Image style={styles.logo} source={{ uri: colorScheme.get() === 'dark' ? league.logos[1].href : league.logos[0].href }} />
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {league.name}
              </Text>
              <Text className="text-lg text-gray-600 dark:text-gray-400">
                {league.abbreviation}
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <View>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Season Start
              </Text>
              <Text className="text-base font-medium text-gray-900 dark:text-white">
                {new Date(league.season.startDate).toLocaleDateString()}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Season End
              </Text>
              <Text className="text-base font-medium text-gray-900 dark:text-white">
                {new Date(league.season.endDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Card>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 8
  },
});

export default LeagueDetails;
