// app/quadras/[arenaId].tsx
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

// Services & Types
import { getArenaById } from '@/services/api/entities/arena';
import { Arena } from '@/context/types/Arena';
import { getQuadrasByArena, getHorariosDisponiveisPorQuadra } from '@/services/api/entities/quadra';
import { Quadra, HorariosDisponiveis } from '@/context/types/Quadra';
import { ArenaCard } from '@/components/cards/ArenaCard';

// Utils
import { addDuration, subDuration, getDuracaoEmMinutos } from '@/utils/time';
import { formatarEsporte, formatarMaterial } from '@/constants/Quadra';

// --- COMPONENTES INTERNOS ---

// Componente QuadraCard
const QuadraCard = ({ 
  quadra, 
  slots, 
  loading = false, 
  onSlotPress,
  selectedSlots = [] 
}: {
  quadra: Quadra;
  slots: HorariosDisponiveis[];
  loading?: boolean;
  onSlotPress: (quadra: Quadra, slot: HorariosDisponiveis) => void;
  selectedSlots?: string[];
}) => {
  
  const fallbackSrc = require('@/assets/images/imagem-default.png');
  
  const manha = slots.filter(h => parseInt(h.horarioInicio.split(':')[0]) < 12);
  const tarde = slots.filter(h => parseInt(h.horarioInicio.split(':')[0]) >= 12 && parseInt(h.horarioInicio.split(':')[0]) < 18);
  const noite = slots.filter(h => parseInt(h.horarioInicio.split(':')[0]) >= 18);
  const temHorarios = slots.length > 0;

  // Cálculo de Vizinhos Válidos
  const duration = getDuracaoEmMinutos(quadra.duracaoReserva);
  const currentQuadraSelection = selectedSlots
    .filter(s => s.startsWith(`${quadra.id}|`))
    .map(s => s.split('|')[1])
    .sort();

  let validNext: string | null = null;
  let validPrev: string | null = null;

  if (currentQuadraSelection.length > 0) {
    const firstTime = currentQuadraSelection[0];
    const lastTime = currentQuadraSelection[currentQuadraSelection.length - 1];
    validPrev = subDuration(firstTime, duration);
    validNext = addDuration(lastTime, duration);
  }

  const getSlotStatus = (slot: HorariosDisponiveis) => {
    const slotId = `${quadra.id}|${slot.horarioInicio}`;
    const isSelected = selectedSlots.includes(slotId);

    // 1. Se o slot está indisponível na API -> DESABILITADO
    if (slot.statusDisponibilidade !== 'DISPONIVEL') {
      return 'disabled';
    }

    // 2. Se o slot está selecionado -> SELECIONADO
    if (isSelected) {
      return 'selected';
    }

    // 3. Se não há nenhuma seleção -> NORMAL (todos livres)
    if (selectedSlots.length === 0) {
      return 'normal';
    }

    // 4. Se há seleção em outra quadra -> DESABILITADO
    const selectionInAnotherQuadra = selectedSlots.some(s => !s.startsWith(`${quadra.id}|`));
    if (selectionInAnotherQuadra) {
      return 'disabled';
    }

    // 5. Se é um vizinho válido (consecutivo) -> NORMAL
    if (slot.horarioInicio === validNext || slot.horarioInicio === validPrev) {
      return 'normal';
    }

    // 6. Qualquer outro caso -> DESABILITADO
    return 'disabled';
  };

  const renderTimeGroup = (label: string, groupSlots: HorariosDisponiveis[]) => {
    if (groupSlots.length === 0) return null;
    return (
      <View>
        <Text className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">{label}</Text>
        <View className="flex-row flex-wrap gap-2">
          {groupSlots.map((slot) => {
            const status = getSlotStatus(slot);
            
            // Definir propriedades baseadas no estado
            const isDisabled = status === 'disabled';
            const isSelected = status === 'selected';

            // Definir classes base para cada estado
            const baseClasses = `
              flex-grow basis-[30%] max-w-[32%] 
              border border-gray-200 rounded-lg py-2 px-1 items-center justify-center mb-2
            `;
            
            const stateClasses = 
              isDisabled ? 'bg-gray-200 border-gray-300' :
              isSelected ? 'bg-green-100 border-green-500' :
              'bg-white border-gray-300';

            return (
              <Pressable
                key={slot.id}
                onPress={() => onSlotPress(quadra, slot)}
                disabled={isDisabled}
                style={({ pressed }) => ({
                  opacity: pressed && !isDisabled && !isSelected ? 0.7 : 1,
                })}
                className={`${baseClasses} ${stateClasses}`}
              >
                <Text 
                  className={`text-xs text-center font-bold ${
                    isSelected ? 'text-green-700' : 
                    isDisabled ? 'text-gray-400' : 
                    'text-gray-800'
                  }`} 
                  numberOfLines={1}
                >
                  {slot.horarioInicio} às {slot.horarioFim}
                </Text>
                <Text 
                  className={`text-[10px] mt-0.5 font-medium ${
                    isSelected ? 'text-green-600' : 
                    isDisabled ? 'text-gray-400' : 
                    'text-gray-600'
                  }`}
                >
                  R$ {slot.valor.toFixed(0)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-2">
      <View className="flex-row gap-3 mb-4 border-b border-gray-100 pb-3">
        <Image 
          source={quadra.urlFotoQuadra ? { uri: quadra.urlFotoQuadra } : fallbackSrc} 
          className="w-24 h-24 rounded-lg bg-gray-100"
          resizeMode="cover"
        />
        <View className="flex-1 justify-center">
          <Text className="text-lg font-bold text-gray-900">{quadra.nomeQuadra}</Text>
          <Text className="text-green-600 font-bold text-sm mt-0.5">
            {quadra.tipoQuadra.map(formatarEsporte).join(', ')}
          </Text>
          {quadra.materiaisFornecidos.length > 0 && (
             <Text className="text-gray-500 text-sm mt-1">
               <Text className="font-bold">Inclui:</Text> {quadra.materiaisFornecidos.map(formatarMaterial).join(', ')}
             </Text>
          )}
        </View>
      </View>

      {loading ? (
        <View className="py-6 items-center">
          <ActivityIndicator size="small" color="#10b981" />
        </View>
      ) : !temHorarios ? (
        <View className="bg-gray-50 py-3 rounded-lg items-center border border-dashed border-gray-300">
          <Text className="text-gray-400 text-sm">Sem horários para esta data</Text>
        </View>
      ) : (
        <View className="gap-5">
          {renderTimeGroup("Manhã", manha)}
          {renderTimeGroup("Tarde", tarde)}
          {renderTimeGroup("Noite", noite)}
        </View>
      )}
    </View>
  );
};

// --- TELA PRINCIPAL ---

export default function QuadrasScreen() {
  const { arenaId } = useLocalSearchParams<{ arenaId: string }>();
  const router = useRouter();

  const [arena, setArena] = useState<Arena | null>(null);
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [horarios, setHorarios] = useState<Record<number, HorariosDisponiveis[]>>({});
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  const dates = useMemo(() => Array.from({ length: 30 }, (_, i) => addDays(new Date(), i)), []);

  // 1. Busca Inicial
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        if (!arenaId) return;
        const [arenaData, quadrasData] = await Promise.all([
          getArenaById(arenaId),
          getQuadrasByArena(arenaId)
        ]);
        setArena(arenaData);
        setQuadras(quadrasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [arenaId]);

  // 2. Busca Horários
  useEffect(() => {
    const fetchHorarios = async () => {
      if (quadras.length === 0) return;
      setSelectedSlots([]); 
      try {
        setLoadingHorarios(true);
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const promises = quadras.map(q => getHorariosDisponiveisPorQuadra(q.id, dateStr));
        const results = await Promise.all(promises);
        const novosHorarios: Record<number, HorariosDisponiveis[]> = {};
        quadras.forEach((q, index) => {
          novosHorarios[q.id] = results[index];
        });
        setHorarios(novosHorarios);
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
      } finally {
        setLoadingHorarios(false);
      }
    };
    fetchHorarios();
  }, [selectedDate, quadras]);

  // 3. Lógica de Seleção
  const handleSlotPress = (quadra: Quadra, slot: HorariosDisponiveis) => {
    const slotId = `${quadra.id}|${slot.horarioInicio}`;
    const isSelected = selectedSlots.includes(slotId);
    const duration = getDuracaoEmMinutos(quadra.duracaoReserva);

    if (selectedSlots.length > 0) {
      const firstSelected = selectedSlots[0];
      const currentQuadraId = firstSelected.split('|')[0];
      if (currentQuadraId !== String(quadra.id)) {
        setSelectedSlots([slotId]);
        return;
      }
    }

    const sortedSlots = [...selectedSlots].sort((a, b) => {
       const timeA = a.split('|')[1];
       const timeB = b.split('|')[1];
       return timeA.localeCompare(timeB);
    });

    if (isSelected) {
      if (slotId === sortedSlots[0]) {
        setSelectedSlots([]);
        return;
      }
      if (slotId === sortedSlots[sortedSlots.length - 1]) {
        setSelectedSlots(prev => prev.filter(id => id !== slotId));
        return;
      }
      const indexClicked = sortedSlots.indexOf(slotId);
      const newSelection = sortedSlots.slice(0, indexClicked); 
      setSelectedSlots(newSelection);
    } else {
      if (selectedSlots.length === 0) {
        setSelectedSlots([slotId]);
      } else {
        const firstSlotTime = sortedSlots[0].split('|')[1];
        const lastSlotTime = sortedSlots[sortedSlots.length - 1].split('|')[1];
        const prevTime = subDuration(firstSlotTime, duration);
        const nextTime = addDuration(lastSlotTime, duration);

        if (slot.horarioInicio === nextTime) {
          setSelectedSlots(prev => [...prev, slotId]);
        } else if (slot.horarioInicio === prevTime) {
          setSelectedSlots(prev => [...prev, slotId]);
        }
      }
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 bg-white z-10">
        <Pressable onPress={() => router.back()} className="mr-4 p-1">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </Pressable>
        <Text className="text-lg font-bold text-gray-800 flex-1" numberOfLines={1}>
          {arena?.nome || "Detalhes da Arena"}
        </Text>
      </View>

      <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
        {arena && (
          <View className="px-4 pt-4 pb-2">
            <ArenaCard 
              arena={arena as any} 
              showDescription={true} 
              showEsportes={false} 
            />
          </View>
        )}

        <View className="bg-white py-4 px-7 mb-2 border-y border-gray-100">
          <Text className="text-center text-base font-bold text-gray-800 mb-3 capitalize">
            {format(selectedDate, "MMMM yyyy", { locale: ptBR })}
          </Text>
          <View className="flex-row items-center">
            {/* Seta Esquerda */}
            <View className="pl-3 pr-2">
              <Ionicons name="chevron-back" size={20} color="#9ca3af" />
            </View>
            
            {/* Calendário */}
            <FlatList
              horizontal
              data={dates}
              keyExtractor={(item) => item.toISOString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
              className="flex-1"
              renderItem={({ item }) => {
                const isSelected = isSameDay(item, selectedDate);
                const dayNumber = format(item, "dd");
                const dayName = format(item, "EEE", { locale: ptBR }).charAt(0).toUpperCase() + 
                               format(item, "EEE", { locale: ptBR }).slice(1, 3).toLowerCase();
                
                return (
                  <Pressable
                    onPress={() => setSelectedDate(item)}
                    className={`items-center justify-center rounded-lg w-[50px] h-[50px] ${
                      isSelected ? 'bg-green-500' : 'bg-gray-100'
                    }`}
                  >
                    <Text className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {dayNumber}
                    </Text>
                    <Text className={`text-[10px] font-semibold ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                      {dayName}
                    </Text>
                  </Pressable>
                );
              }}
            />
            
            {/* Seta Direita */}
            <View className="pr-3 pl-2">
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </View>
        </View>

        <View className="px-4 pb-10">
          {quadras.length === 0 && !loadingHorarios ? (
            <View className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 items-center">
              <Ionicons name="basketball-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-800 font-bold text-lg mt-4 text-center">
                Nenhuma quadra cadastrada
              </Text>
              <Text className="text-gray-500 text-sm mt-2 text-center">
                Esta arena ainda não possui quadras disponíveis para reserva.
              </Text>
            </View>
          ) : (
            quadras.map((quadra) => (
              <QuadraCard
                key={quadra.id}
                quadra={quadra}
                slots={horarios[quadra.id] || []}
                loading={loadingHorarios}
                onSlotPress={handleSlotPress}
                selectedSlots={selectedSlots}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}