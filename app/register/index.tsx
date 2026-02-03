import React from "react";
import { ScrollView, KeyboardAvoidingView, Platform, Text } from "react-native";
import { RegistroAtleta } from "../../components/forms/RegistroAtleta";

export default function Register() {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white pt-12"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, paddingHorizontal: 24, paddingTop: 12 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <Text className="text-center text-gray-600 font-medium text-lg mb-4">
          Cadastre-se como Atleta
        </Text>

        {/* Formulário */}
        <RegistroAtleta />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
