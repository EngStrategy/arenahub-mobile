
import Gradient from '@/assets/icons/Gradient';
import Logo from '@/assets/icons/Logo';
import { Box } from '@/components/ui/box';
import { ModalAvaliarAgendamento } from '@/components/modais/ModalAvaliarAgendamento';
import { ModalAvaliacoes } from '@/components/modais/ModalAvaliacoes';
import { useState } from 'react';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const [openAvaliacao, setOpenAvaliacao] = useState(false);
  const [openAvaliacoes, setOpenAvaliacoes] = useState(false);
  return (
    <Box className="flex-1 bg-background-300 h-[100vh]">
      <Box className="absolute h-[500px] w-[500px] lg:w-[700px] lg:h-[700px]">
        <Gradient />
      </Box>
      {/* <ScrollView
        style={{ height: '100%' }}
        contentContainerStyle={{ flexGrow: 1 }}
      > */}
      <Box className="flex flex-1 items-center mx-5 lg:my-24 lg:mx-32 py-safe">
        <Box className="gap-10 base:flex-col sm:flex-row justify-between sm:w-[80%] md:flex-1">
          <Box className="bg-background-template py-2 px-6 rounded-full items-center flex-column md:flex-row md:self-start">
            <Text className="text-white font-medium">
              Telas feitas:
            </Text>
          </Box>
          <Button
            size="md"
            className="bg-primary-500 px-6 py-2 rounded-full"
            onPress={() => {
              router.push('/(tabs)');
            }}
          >
            <ButtonText>Home</ButtonText>
          </Button>

          <Button
            size="md"
            className="bg-primary-500 px-6 py-2 rounded-full"
            onPress={() => setOpenAvaliacao(true)}>
            <ButtonText>Avaliar Agendamento</ButtonText>
          </Button>

          <ModalAvaliarAgendamento
            isOpen={openAvaliacao}
            onClose={() => setOpenAvaliacao(false)}
            agendamentoId={1}
          />

          <Button
            size="md"
            className="bg-primary-500 px-6 py-2 rounded-full"
            onPress={() => setOpenAvaliacoes(true)}>
            <ButtonText>Ver avaliações</ButtonText>
          </Button>

          <ModalAvaliacoes
            visible={openAvaliacoes}
            onClose={() => setOpenAvaliacoes(false)}
            quadras={[]}
            nomeArena="Arena EngStrategy"
          />

          <Button
            size="md"
            className="bg-primary-500 px-6 py-2 rounded-full"
            onPress={() => {
              router.push('/login');
            }}
          >
            <ButtonText>Login</ButtonText>
          </Button>

          <Button
            size="md"
            className="bg-primary-500 px-6 py-2 rounded-full"
            onPress={() => {
              router.push('/register');
            }}
          >
            <ButtonText>Register</ButtonText>
          </Button>

          <Button
            size="md"
            className="bg-primary-500 px-6 py-2 rounded-full"
            onPress={() => {
              router.push('/alterar-senha');
            }}
          >
            <ButtonText>Alterar senha</ButtonText>
          </Button>

          <Button
            size="md"
            className="bg-primary-500 px-6 py-2 rounded-full"
            onPress={() => {
              router.push('/forgot-password');
            }}
          >
            <ButtonText>Esqueceu sua senha</ButtonText>
          </Button>

          <Button
            size="md"
            className="bg-primary-500 px-6 py-2 rounded-full"
            onPress={() => {
              router.push('/cadastrar-quadra');
            }}
          >
            <ButtonText>Cadastrar Quadra</ButtonText>
          </Button>
        </Box>
        <Box className="flex-1 justify-center items-center h-[20px] w-[300px] lg:h-[160px] lg:w-[400px]">
          <Logo />
        </Box>
      </Box>
      {/* </ScrollView> */}
    </Box>
  );
}
