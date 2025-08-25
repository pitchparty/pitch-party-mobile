import React from "react";
import { useNavigation } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";

import { useActiveVenues } from "@/features/venues/hooks";
import StatusStateView from "@/components/ui/StatusStateView";
import VenueItem from "@/features/venues/components/VenueItem";

const ViewVenues = () => {
  const navigation = useNavigation();

  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({
      title: "Venues",
    });
  }, [navigation]);

  const { data, isPending, isError, error } = useActiveVenues();

  if (isPending)
    return <StatusStateView status="pending" message="Loading venues..." />;
  if (isError)
    return (
      <StatusStateView
        status="error"
        message="Something went wrong"
        error={error}
      />
    );

  return (
    <FlatList
      className="bg-blue-50 dark:bg-gray-900"
      data={data}
      renderItem={({ item }) => (
        <VenueItem isLoading={isPending} key={item.id} venue={item} />
      )}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.toString()}
      contentContainerStyle={{
        paddingBottom: 20,
        paddingTop: 20,
        paddingHorizontal: 10,
      }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      ListEmptyComponent={
        <StatusStateView
          status="empty"
          message="No venues available"
          description="There are no venues to display at the moment. Please check back later."
        />
      }
    />
  );
};

export default ViewVenues;

const styles = StyleSheet.create({});
