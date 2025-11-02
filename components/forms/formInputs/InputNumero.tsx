import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';

interface InputNumeroProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string | null;
  formatar?: (text: string) => string;
  keyboardType?: "default" | "numeric" | "phone-pad";
  maxLength?: number;
  cleanLength?: number;
  isDisabled?: boolean;
  editable?: boolean;
  onMaxLengthReached?: (formatted: string) => void;
  estilo?: string;
}

export const InputNumero = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  formatar,
  keyboardType = "default",
  maxLength,
  cleanLength,
  isDisabled,
  editable,
  onMaxLengthReached,
  estilo,
}: InputNumeroProps) => {
  const handleChange = (text: string) => {
    const formatted = formatar ? formatar(text) : text;
    onChangeText(formatted);

    if (
      onMaxLengthReached &&
      maxLength &&
      formatted.replace(/\D/g, "").length === cleanLength
    ) {
      onMaxLengthReached(formatted);
    }
  };

  return (
    <VStack space="xs" className="w-full">
      <Text className="text-typography-500">{label}</Text>

      <Input
        size="xl"
        className="border border-gray-300 rounded-lg"
        isDisabled={isDisabled}
      >
        <InputField
          className={estilo ?? "text-base"} 
          type="text"
          placeholder={placeholder}
          value={value}
          onChangeText={handleChange}
          onBlur={onBlur}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={editable}
        />
      </Input>

      {error && <Text className="text-sm text-red-500">{error}</Text>}
    </VStack>
  );
};
