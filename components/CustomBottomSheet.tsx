import React, { forwardRef, useMemo, useImperativeHandle, useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

export type BottomSheetRef = {
  open: () => void;
  close: () => void;
};

const CustomBottomSheet = forwardRef<BottomSheetRef, { title: string; children: React.ReactNode }>(
  ({ title, children }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%'], []);

    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
    }));

    return (
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose>
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">{title}</Text>
          {children}
        </View>
      </BottomSheet>
    );
  }
);

export default CustomBottomSheet;
