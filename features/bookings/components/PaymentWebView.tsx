import React, { forwardRef, useCallback } from "react";
import { WebView } from "react-native-webview";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import colors from "tailwindcss/colors";
import { colorScheme } from "nativewind";
import { Text } from "react-native";

interface PaymentWebViewProps {
  paymentUrl: string | null;
  snapPoints: string[];
}

const PaymentWebView = forwardRef<BottomSheetModal, PaymentWebViewProps>(
  ({ paymentUrl, snapPoints }, ref) => {
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      []
    );

    console.log("PaymentWebView rendered with URL:", paymentUrl);

    return (
      <BottomSheetModal
        ref={ref}
        index={1} // Open at 50% height by default
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor:
            colorScheme.get() === "dark" ? colors.gray[800] : colors.blue[50],
        }}
        handleIndicatorStyle={{ display: "none" }} // Hide handle for no-header look
      >
        {paymentUrl ? (
          <WebView source={{ uri: paymentUrl }} style={{ flex: 1 }} />
        ) : (
          <Text>No payment URL available</Text> // Fallback for debugging
        )}
      </BottomSheetModal>
    );
  }
);

export default PaymentWebView;
