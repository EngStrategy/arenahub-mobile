import React, { useState } from "react";
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon, InfoIcon } from '@/components/ui/icon';
import { View } from "react-native";


interface InputSenhaProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void; // <-- permite lógica customizada
  error?: string | null;
  showStrengthIndicator?: boolean;
  StrengthIndicatorComponent?: React.ReactNode;
}

export const InputSenha = ({
  label,
  placeholder = "Insira sua senha",
  value,
  onChangeText,
  onBlur,
  error,
  showStrengthIndicator = false,
  StrengthIndicatorComponent,
}: InputSenhaProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <VStack space="xs" className="w-full">
      <Text className="text-typography-500">{label}</Text>

      <Input size="xl" className="border border-gray-300 rounded-lg">
        <InputField
          className="text-base"
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (onBlur) onBlur(); // 👈 executa lógica custom passada
          }}
        />
        <InputSlot className="pr-3" onPress={toggleShowPassword}>
          <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} fill="none" />
        </InputSlot>
      </Input>

      {error && <Text className="text-sm text-red-500">{error}</Text>}

      {showStrengthIndicator && isFocused && StrengthIndicatorComponent && (
        <View className="pb-4">{StrengthIndicatorComponent}</View>
      )}
    </VStack>
  );
};