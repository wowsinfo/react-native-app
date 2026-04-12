import React, { type ReactNode } from 'react';
import { Text, View } from 'react-native';

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function HintRow({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) {
  return (
    <View className="flex-row justify-between gap-3">
      <Text className="text-[14px] font-medium leading-5 text-foreground">
        {title}
      </Text>
      <View className="rounded-lg bg-pressed px-2 py-0.5">
        <Text className="text-[16px] text-muted">
          {hint}
        </Text>
      </View>
    </View>
  );
}
