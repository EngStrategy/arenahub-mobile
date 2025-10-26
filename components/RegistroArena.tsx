// components/RegistroAtleta.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
// import { ButtonPrimary } from "@/components/Buttons/ButtonPrimary"; 
// -> No RN, vamos usar TouchableOpacity + Text
// import { createAtleta } from '@/app/api/entities/atleta';
// -> Função que provavelmente chama sua API, ainda não traduzida
// import { formatarTelefone } from "@/context/functions/formatarTelefone";
// -> Função externa, você pode implementar ou comentar
// import { useCapsLock } from "@/context/hooks/useCapsLook";
// -> Hook externo ainda não traduzido

const PasswordStrengthIndicator = ({ password = "" }: { password?: string }) => {
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

export const RegistroArena = ({ className }: { className?: string }) => {
  const [cpfProprietario, setCpfProprietario] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const changeComplete = (value: boolean) => () => {
    setIsCompleted(value);
  }

  const handleRegister = async () => {
    setLoading(true);
    if (senha !== confirmSenha) {
      alert("As senhas não coincidem!");
      setLoading(false);
      return;
    }

    try {
      // TODO: Chamar sua função createAtleta(values)
      // Exemplo: await createAtleta({ cpfProprietario, email, telefone, senha });
      console.log("Registrar usuário:", { cpfProprietario, email, telefone, senha });
      alert("Conta criada com sucesso!");
    } catch (error) {
      alert("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const formatarTelefone = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const formatarCpfProprietario = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  return (
    <ScrollView className={`flex-1 bg-white ${className ?? ""}`}>
      {!isCompleted ? (
        <ScrollView>
          <View className="space-y-4">
            <View className="pt-5 pb-4">
              <Text className="text-sm font-bold mb-1">CPF do Proprietario</Text>
              <TextInput
                placeholder="Insira seu CPF"
                className="border border-gray-300 rounded-lg px-4 py-3"
                value={cpfProprietario}
                onChangeText={(text) => setCpfProprietario(formatarCpfProprietario(text))}
              />
            </View>

            <View className="pb-4">
              <Text className="text-sm font-bold mb-1">Email</Text>
              <TextInput
                placeholder="Insira seu email"
                className="border border-gray-300 rounded-lg px-4 py-3"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View className="pb-4">
              <Text className="text-sm font-bold mb-1">Telefone</Text>
              <TextInput
                placeholder="(99) 99999-9999"
                className="border border-gray-300 rounded-lg px-4 py-3"
                value={telefone}
                onChangeText={(text) => setTelefone(formatarTelefone(text))}
                keyboardType="phone-pad"
              />
            </View>

            <View className="pb-4">
              <Text className="text-sm font-bold mb-1">Senha</Text>
              <TextInput
                placeholder="Insira sua senha"
                className="border border-gray-300 rounded-lg px-4 py-3"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              {isPasswordFocused && (
                <View className="pb-4">
                  <PasswordStrengthIndicator password={senha} />
                </View>
              )}
            </View>

            <View>
              <Text className="text-sm font-bold mb-1">Confirme a Senha</Text>
              <TextInput
                placeholder="Confirme sua senha"
                className="border border-gray-300 rounded-lg px-4 py-3"
                value={confirmSenha}
                onChangeText={setConfirmSenha}
                secureTextEntry
              />
            </View>

          </View>

          <TouchableOpacity
            className="bg-green-primary rounded-lg py-3 mt-4"
            onPress={changeComplete(true)}
            disabled={loading}
          >
            <Text className="text-white text-center font-bold">{loading ? "Carregando..." : "Avançar"}</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (

        // SEGUNDA PARTE DO FORMULÁRIO AQUI

        <ScrollView>
          <View className="space-y-4">
            <View className="pt-5 pb-4">
              <Text className="text-sm font-bold mb-1">CPF do Proprietario</Text>
              <TextInput
                placeholder="Insira seu CPF"
                className="border border-gray-300 rounded-lg px-4 py-3"
                value={cpfProprietario}
                onChangeText={(text) => setCpfProprietario(formatarCpfProprietario(text))}
              />
            </View>

            <View className="pb-4">
              <Text className="text-sm font-bold mb-1">Email</Text>
              <TextInput
                placeholder="Insira seu email"
                className="border border-gray-300 rounded-lg px-4 py-3"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View className="pb-4">
              <Text className="text-sm font-bold mb-1">Telefone</Text>
              <TextInput
                placeholder="(99) 99999-9999"
                className="border border-gray-300 rounded-lg px-4 py-3"
                value={telefone}
                onChangeText={(text) => setTelefone(formatarTelefone(text))}
                keyboardType="phone-pad"
              />
            </View>

            <View className="pb-4">
              <Text className="text-sm font-bold mb-1">Senha</Text>
              <TextInput
                placeholder="Insira sua senha"
                className="border border-gray-300 rounded-lg px-4 py-3"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              {isPasswordFocused && (
                <View className="pb-4">
                  <PasswordStrengthIndicator password={senha} />
                </View>
              )}
            </View>

            <View>
              <Text className="text-sm font-bold mb-1">Confirme a Senha</Text>
              <TextInput
                placeholder="Confirme sua senha"
                className="border border-gray-300 rounded-lg px-4 py-3"
                value={confirmSenha}
                onChangeText={setConfirmSenha}
                secureTextEntry
              />
            </View>

          </View>

          <View className="flex-row gap-5 items-center mt-4">
            <TouchableOpacity
              className="bg-gray-voltar rounded-lg px-4 py-3 mt-4"
              onPress={changeComplete(false)}
              disabled={loading}
            >
              <Text className="text-black text-center font-bold">{loading ? "Carregando..." : "Voltar"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-green-primary rounded-lg px-4 py-3 mt-4"
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white text-center font-bold">{loading ? "Carregando..." : "Cadastrar arena"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      <Text className="text-gray-800 text-sm mt-4">
        Já possui uma conta?{" "}
        <Text className="text-green-primary underline">Entrar</Text>
        {/* No Next.js era Link, aqui você pode usar react-navigation */}
      </Text>
    </ScrollView>
  );
};
