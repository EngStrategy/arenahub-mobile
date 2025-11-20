import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';

interface InputTextoProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  onBlur?: () => void;
  error?: string;
}

export function InputTexto({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  onBlur,
  error,
}: InputTextoProps) {
  return (
    <VStack space="xs">
      <Text className="text-typography-500">{label}</Text>

      <Input size="xl" className="border border-gray-300 rounded-lg">
        <InputField
          className="text-base"
          type="text"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          onBlur={onBlur}
        />
      </Input>

      {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
    </VStack>
  );
}