// src/components/BookingList.tsx
import React from "react";
import { FlatList, FlatListProps} from "react-native";

import { BookingItem } from "../types";
import StatusStateView from "@/components/ui/StatusStateView";

interface BookingListProps extends FlatListProps<BookingItem>{
  data: BookingItem[];
  renderItem: ({ item }: { item: BookingItem }) => JSX.Element;
  ListEmptyComponent?: JSX.Element;
}

export const BookingList = ({ data, renderItem, ListEmptyComponent, ...props }: BookingListProps) => {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      ListEmptyComponent={ListEmptyComponent || (
        <StatusStateView
          status="empty"
          message="No bookings found."
          description={`You haven't made any bookings yet.\nUse the search bar to find a venue, or adjust your filter using the filter button on the top right corner.`}
        />
      )}
      {...props}
    />
  );
};