import React from "react";
import { View } from "react-native";
import { SafeValue } from "@wowsinfo/core";

export interface SpaceProps {
  height?: number;
}

export const Space = ({ height }: SpaceProps) => {
  const h = SafeValue(height, 128);
  return <View style={{ height: h }} />;
};
