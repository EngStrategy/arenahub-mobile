import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HStack } from '@/components/ui/hstack';

export const StarRating = ({ value, onChange }) => {
  return (
    <HStack space="sm">
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onChange(star)}>
          <Ionicons
            name={star <= value ? "star" : "star-outline"}
            size={32}
            color="#FBBF24" // amarelo
          />
        </Pressable>
      ))}
    </HStack>
  );
};
