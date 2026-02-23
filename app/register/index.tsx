import { Platform, View, KeyboardAvoidingView, ScrollView } from "react-native";
import { RegistroAtleta } from "../../components/forms/RegistroAtleta";
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { useRef } from 'react';

import { AuthBackground } from "@/components/layout/AuthBackground";

export default function Register() {
  const scrollRef = useRef<ScrollView>(null);

  const handleFocusPassword = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <AuthBackground>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 100}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: 60, paddingBottom: 220 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          {/* Ícone */}
          <View className="items-center mb-6 mt-8">
            <View className="w-20 h-20 rounded-full bg-green-primary items-center justify-center">
              <Ionicons name="person" size={32} color="#fff" />
            </View>
          </View>

          {/* Título e Subtítulo */}
          <Text className="text-2xl font-semibold text-center mb-2 text-gray-800">
            Cadastre-se
          </Text>
          <Text className="text-sm text-center text-gray-500 mb-8">
            Faça seu cadastro para começar.
          </Text>

          {/* Formulário */}
          <RegistroAtleta onFocusPassword={handleFocusPassword} />
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}