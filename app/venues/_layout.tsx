import React from 'react'
import { Stack } from 'expo-router';

import { screenOptions } from '@/constants/Colors';

const _layout = () => {
  return (
    <Stack screenOptions={screenOptions}/>
  )
}

export default _layout;