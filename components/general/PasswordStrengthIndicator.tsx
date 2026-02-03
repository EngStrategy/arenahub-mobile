import { View, Text } from "react-native";
export const PasswordStrengthIndicator = ({ password = "" }: { password?: string }) => {
  const evaluatePassword = () => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/\d/.test(password)) score += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  };

  const score = evaluatePassword();
  let color = 'red';
  let text = 'Fraca';
  if (score >= 75) { color = 'green'; text = 'Forte'; }
  else if (score >= 50) { color = 'orange'; text = 'Média'; }

  return (
    <View className="w-full mb-2">
      <Text className="font-medium mb-1">Força da senha: {text}</Text>
      <View className="h-2 w-full rounded bg-gray-300">
        <View style={{ width: `${score}%`, backgroundColor: color, height: '100%', borderRadius: 4 }} />
      </View>
      <View className="mt-2">
        <Text className={password.length >= 8 ? "text-green-600" : ""}>• Pelo menos 8 caracteres</Text>
        <Text className={/\d/.test(password) ? "text-green-600" : ""}>• Pelo menos um número</Text>
        <Text className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? "text-green-600" : ""}>• Letras maiúsculas e minúsculas</Text>
        <Text className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}>• Pelo menos um caractere especial</Text>
      </View>
    </View>
  );
};