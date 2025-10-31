import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput } from "react-native";
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
        <View className="flex-row mb-4 w-full">
          <TouchableOpacity
            className={`flex-1 py-2 border-b-2 ${accountType === "atleta" ? "border-green-primary" : "border-gray-not-selected"}`}
            onPress={() => setAccountType("atleta")}
          >
            <Text className={`text-center font-semibold ${accountType === "atleta" ? "text-green-primary" : "text-gray-not-selected"}`}>
              Atleta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2 border-b-2 ${accountType === "arena" ? "border-green-primary" : "border-gray-not-selected"}`}
            onPress={() => setAccountType("arena")}
          >
            <Text className={`text-center font-semibold ${accountType === "arena" ? "text-green-primary" : "text-gray-not-selected"}`}>
              Arena
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulário */}
        {accountType === "atleta" ? <RegistroAtleta /> : <RegistroArena />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
