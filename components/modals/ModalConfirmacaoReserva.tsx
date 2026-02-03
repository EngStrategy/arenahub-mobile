import { useState, useMemo } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { format, addMonths, startOfDay, addWeeks, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Switch } from '@/components/ui/switch';
import { Icon, CloseIcon, AddIcon, RemoveIcon, CheckCircleIcon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { Button, ButtonText, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
import { Quadra, HorariosDisponiveis } from '@/types/Quadra';
import { createAgendamento } from '@/services/api/endpoints/atletaAgendamento';
import { formatarEsporte } from '@/utils/formatters';
import { useToastNotification } from '@/components/layout/useToastNotification';

interface Props {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly quadra: Quadra;
  readonly data: Date;
  readonly slotsSelecionados: HorariosDisponiveis[];
  readonly onSuccess: () => void;
}

export function ModalConfirmacaoReserva({ visible, onClose, quadra, data, slotsSelecionados, onSuccess }: Props) {
  const { showToast } = useToastNotification();
  const [loading, setLoading] = useState(false);
  const [esporte, setEsporte] = useState(quadra.tipoQuadra[0]);
  const [isFixo, setIsFixo] = useState(false);
  const [isPublico, setIsPublico] = useState(false);
  const [periodoFixo, setPeriodoFixo] = useState<"UM_MES" | "TRES_MESES" | "SEIS_MESES">("UM_MES");
  const [faltandoGente, setFaltandoGente] = useState(1);

  const slotsOrdenados = useMemo(() => {
    return [...slotsSelecionados].sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio));
  }, [slotsSelecionados]);

  const total = useMemo(() => {
    const valorBaseSessao = slotsSelecionados.reduce((acc, curr) => acc + curr.valor, 0);
    if (!isFixo) return valorBaseSessao;

    const dataInicio = startOfDay(data);
    let mesesParaAdicionar: number;
    switch (periodoFixo) {
      case "UM_MES": mesesParaAdicionar = 1; break;
      case "TRES_MESES": mesesParaAdicionar = 3; break;
      case "SEIS_MESES": mesesParaAdicionar = 6; break;
      default: mesesParaAdicionar = 1;
    }

    const dataLimite = addMonths(dataInicio, mesesParaAdicionar);

    let totalAgendamentos = 1;
    let dataAtualParaSimulacao = addWeeks(dataInicio, 1);

    while (!isAfter(dataAtualParaSimulacao, dataLimite)) {
      totalAgendamentos++;
      dataAtualParaSimulacao = addWeeks(dataAtualParaSimulacao, 1);
    }

    return valorBaseSessao * totalAgendamentos;
  }, [slotsSelecionados, isFixo, periodoFixo, data]);

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      const payload = {
        quadraId: quadra.id,
        dataAgendamento: format(data, 'yyyy-MM-dd'),
        slotHorarioIds: slotsOrdenados.map(s => s.id),
        esporte,
        isFixo,
        isPublico,
        periodoFixo: isFixo ? periodoFixo : undefined,
        numeroJogadoresNecessarios: isPublico ? faltandoGente : 0,
      };
      await createAgendamento(payload);
      showToast("Sucesso", "Reserva realizada com sucesso!", "success");
      onSuccess();
    } catch (error: any) {
      showToast("Erro", error.response?.data?.message || "Erro na reserva.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={visible} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent className="rounded-t-3xl h-[80%]">
        <ModalHeader className="py-3">
          <Heading size="md">Confirmar Reserva</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>

        <ScrollView showsVerticalScrollIndicator={false}>
          <ModalBody>
            <VStack space="3xl">

              {/* Card da Quadra */}
              <HStack className="bg-background-50 p-2 rounded-2xl border border-outline-100 items-center" space="md">
                <Box className="w-24 h-24 rounded-xl overflow-hidden">
                  <Image
                    source={{ uri: quadra.urlFotoQuadra || 'https://via.placeholder.com/150' }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </Box>
                <VStack className="flex-1" space="xs">
                  <Heading size="xs" numberOfLines={1}>{quadra.nomeQuadra}</Heading>
                  <Text size="xs" className="text-typography-600">
                    {format(data, "EEEE, dd 'de' MMMM", { locale: ptBR }).replace(/^\w/, (c) => c.toUpperCase())}
                  </Text>
                  <Text size="xs" className="font-bold text-green-600">
                    {slotsOrdenados[0]?.horarioInicio} - {slotsOrdenados.at(-1)?.horarioFim}
                  </Text>
                </VStack>
              </HStack>

              {/* Seletor de Esporte */}
              <VStack space="xs">
                <Text size="sm" className="font-bold ml-1">Modalidade</Text>
                <HStack space="xs" className="flex-wrap">
                  {quadra.tipoQuadra.map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => setEsporte(item)}
                      className={`px-3 py-1.5 rounded-full border ${esporte === item ? 'bg-green-50 border-green-500' : 'bg-white border-outline-300'}`}
                    >
                      <Text size="xs" className={`px-2 py-1 ${esporte === item ? 'text-green-600 font-bold' : 'text-typography-600'}`}>
                        {formatarEsporte(item)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </HStack>
              </VStack>

              {/* VStack das Configurações Avançadas */}
              <VStack space="md">

                {/* SEÇÃO HORÁRIO FIXO */}
                <View>
                  <HStack
                    className={`justify-between items-center bg-background-50 p-3 border border-outline-100 ${isFixo ? 'rounded-t-xl' : 'rounded-xl'
                      }`}
                  >
                    <VStack className="flex-1 pl-2">
                      <Text size="sm" className="font-bold">Horário Fixo</Text>
                      <Text size="xs">Repetir semanalmente</Text>
                    </VStack>
                    <Switch
                      value={isFixo}
                      onValueChange={(v) => { setIsFixo(v); if (v) setIsPublico(false); }}
                      trackColor={{ false: '#d1d5db', true: '#10b981' }}
                      thumbColor="white"
                    />
                  </HStack>

                  {isFixo && (
                    <HStack
                      space="xs"
                      className="px-2 py-3 bg-background-50 border-x border-b border-outline-100 rounded-b-xl"
                    >
                      {[
                        { id: 'UM_MES', label: '1 Mês' },
                        { id: 'TRES_MESES', label: '3 Meses' },
                        { id: 'SEIS_MESES', label: '6 Meses' }
                      ].map((p) => (
                        <Button
                          key={p.id}
                          onPress={() => setPeriodoFixo(p.id as any)}
                          variant={periodoFixo === p.id ? 'solid' : 'outline'}
                          className={`flex-1 h-9 rounded-lg ${periodoFixo === p.id ? 'bg-green-600 border-green-600' : 'border-outline-300'}`}
                        >
                          <ButtonText size="xs" className={periodoFixo === p.id ? 'text-white' : 'text-typography-600'}>
                            {p.label}
                          </ButtonText>
                        </Button>
                      ))}
                    </HStack>
                  )}
                </View>

                {/* SEÇÃO JOGO ABERTO */}
                <View>
                  <HStack
                    className={`justify-between items-center bg-background-50 p-3 border border-outline-100 ${isPublico ? 'rounded-t-xl' : 'rounded-xl'
                      }`}
                  >
                    <VStack className="flex-1 pl-2">
                      <Text size="sm" className="font-bold">Jogo Aberto</Text>
                      <Text size="xs">Convidar outros atletas</Text>
                    </VStack>
                    <Switch
                      value={isPublico}
                      onValueChange={(v) => { setIsPublico(v); if (v) setIsFixo(false); }}
                      trackColor={{ false: '#d1d5db', true: '#10b981' }}
                      thumbColor="white"
                    />
                  </HStack>

                  {isPublico && (
                    <HStack
                      className="justify-between items-center bg-background-50 px-3 py-3 border-x border-b border-outline-100 rounded-b-xl"
                    >
                      <Text size="xs" className='pl-2 text-typography-500'>Vagas em aberto</Text>
                      <HStack space="md" className="items-center">
                        <TouchableOpacity
                          onPress={() => setFaltandoGente(Math.max(1, faltandoGente - 1))}
                          className="p-2 bg-background-200 rounded-md"
                        >
                          <Icon as={RemoveIcon} size="xs" />
                        </TouchableOpacity>
                        <Text size="sm" className="font-bold w-5 text-center">{faltandoGente}</Text>
                        <TouchableOpacity
                          onPress={() => setFaltandoGente(Math.min(21, faltandoGente + 1))}
                          className="p-2 bg-background-200 rounded-md"
                        >
                          <Icon as={AddIcon} size="xs" />
                        </TouchableOpacity>
                      </HStack>
                    </HStack>
                  )}
                </View>

              </VStack>
            </VStack>
          </ModalBody>
        </ScrollView>

        <ModalFooter className="flex-col p-4 border-t border-outline-100">
          <HStack className="w-full justify-between items-center mb-3">
            <VStack>
              <Text size="xs" className="uppercase font-bold text-typography-400">Total</Text>
              <Heading size="lg" className="text-green-600">
                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Heading>
            </VStack>
          </HStack>

          <Button
            onPress={handleConfirmar}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-green-600"
          >
            {loading ? <ButtonSpinner color="white" /> : (
              <>
                <ButtonIcon as={CheckCircleIcon} className="text-white mr-2" />
                <ButtonText className="font-bold text-white">Pagar na Arena</ButtonText>
              </>
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}