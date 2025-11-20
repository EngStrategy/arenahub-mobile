import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Text } from '@/components/ui/text';

interface InputTextAreaProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  optional?: boolean;
}

export function InputTextArea({
  label,
  placeholder,
  value,
  onChangeText,
  optional = false,
}: InputTextAreaProps) {
  return (
    <VStack space="xs">
      <HStack className="gap-1 items-center">
        <Text>{label}</Text>
        {optional && <Text className="text-xs">(Opcional)</Text>}
      </HStack>

      <Textarea size="xl" className="border border-gray-300 rounded-lg">
        <TextareaInput
          className="text-base"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
      </Textarea>
    </VStack>
  );
}
