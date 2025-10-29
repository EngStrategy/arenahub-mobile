import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { RegistroAtleta } from "../../components/forms/RegistroAtleta";
import { RegistroArena } from "../../components/forms/RegistroArena";

export default function Register() {
  const [accountType, setAccountType] = useState<"atleta" | "arena">("atleta");
  const [isFull, setIsFull] = useState(false);

  return (
    <KeyboardAvoidingView className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView className="flex-1 bg-white px-6 pt-12">
        <Text className="text-center text-gray-600 font-medium text-lg mb-4">
          Cadastre-se abaixo
        </Text>

        {/* Botões Atleta / Arena */}
        <View className="flex-row mb- w-full">
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

        {accountType === "atleta" ? (
          <RegistroAtleta />
        ) : (
          <RegistroArena />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
