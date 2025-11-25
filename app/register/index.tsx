import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { RegistroAtleta } from "../../components/forms/RegistroAtleta";
import { RegistroArena } from "../../components/forms/RegistroArena";

export default function Register() {
  const [accountType, setAccountType] = useState<"atleta" | "arena">("atleta");

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
          Cadastre-se abaixo
        </Text>

        {/* Botões Atleta / Arena */}
        <View className="flex-row mb-4 w-full border-b border-gray-200">
          <Pressable
            className={`flex-1 py-3 border-b-2 ${accountType === "atleta" ? "border-green-primary" : "border-transparent"}`}
            onPress={() => setAccountType("atleta")}
          >
            <Text className={`text-center font-semibold text-base ${accountType === "atleta" ? "text-green-primary" : "text-gray-400"}`}>
              Atleta
            </Text>
          </Pressable>

          <Pressable
            className={`flex-1 py-3 border-b-2 ${accountType === "arena" ? "border-green-primary" : "border-transparent"}`}
            onPress={() => setAccountType("arena")}
          >
            <Text className={`text-center font-semibold text-base ${accountType === "arena" ? "text-green-primary" : "text-gray-400"}`}>
              Arena
            </Text>
          </Pressable>
        </View>

        {/* Formulário */}
        {accountType === "atleta" ? <RegistroAtleta /> : <RegistroArena />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
