import { useEffect, useState } from 'react';
import { ScrollView, Image, TouchableOpacity, View, Linking, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ChevronLeft, MapPin, Phone, Clock, Star, Navigation } from 'lucide-react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { ModalAvaliacoes } from '@/components/modals/ModalAvaliacoes';

import { getArenaById } from '@/services/api/endpoints/arena';
import { Arena } from '@/types/Arena';

export default function ArenaDetalhesScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [arena, setArena] = useState<Arena | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalAvaliacoesVisible, setModalAvaliacoesVisible] = useState(false);

    useEffect(() => {
        async function loadArena() {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getArenaById(id);

                setArena(data);
            } catch (error) {
                console.error("Erro ao carregar arena:", error);
            } finally {
                setLoading(false);
            }
        }
        loadArena();
    }, [id]);

    const openInMaps = () => {
        if (!arena?.endereco?.latitude || !arena?.endereco?.longitude) return;
        const { latitude, longitude } = arena.endereco;
        const label = arena.nome;

        const url = Platform.select({
            ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
            android: `geo:0,0?q=${latitude},${longitude}(${label})`
        });

        if (url) Linking.openURL(url);
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#16a34a" />
                <Text className="mt-4 text-gray-500">Carregando detalhes...</Text>
            </View>
        );
    }

    if (!arena) {
        return (
            <View className="flex-1 justify-center items-center p-5">
                <Text className="text-gray-500 text-center">Arena não encontrada ou erro de conexão.</Text>
                <Button className="mt-4" onPress={() => router.back()}>
                    <ButtonText>Voltar</ButtonText>
                </Button>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Icons Overlay */}
            <HStack
                className="px-5 items-center justify-between absolute left-0 right-0 z-20"
                style={{ top: insets.top + 10 }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="bg-white p-2.5 rounded-xl border-0 backdrop-blur-md"
                >
                    <ChevronLeft size={24} color="#3b3b3bff" />
                </TouchableOpacity>
            </HStack>

            <ScrollView showsVerticalScrollIndicator={false} className="bg-gray-50 flex-1">
                <Box className="relative w-full h-[520px] rounded-b-[30px] overflow-hidden">
                    <Image
                        source={{ uri: arena.urlFoto }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />

                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.4)']}
                        className="absolute bottom-0 left-0 right-0 h-64"
                    />

                    {/* Blur Info Card */}
                    <BlurView
                        intensity={90}
                        tint="light"
                        className="absolute bottom-0 left-0 right-0 overflow-hidden"
                        style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
                    >
                        <VStack className="px-6 py-6 pb-8" space="sm">
                            <HStack className="justify-between items-start">
                                <VStack className="flex-1 mr-4">
                                    <Heading size="xl" className="text-gray-900 font-bold">{arena.nome}</Heading>
                                </VStack>

                                <TouchableOpacity
                                    onPress={() => setModalAvaliacoesVisible(true)}
                                    activeOpacity={0.7}
                                >
                                    <VStack space="xs" className="items-center bg-yellow-50 px-3 py-1 rounded-xl shadow-sm border border-yellow-600">
                                        <HStack space="xs" className="items-center">
                                            <Star size={16} fill="#EAB308" color="#EAB308" />
                                            <Text className="text-gray-900 font-bold">{arena.notaMedia?.toFixed(1) || "0.0"}</Text>
                                        </HStack>
                                    </VStack>
                                </TouchableOpacity>
                            </HStack>

                            <HStack className="items-center justify-between">
                                <HStack space="xs" className="items-center">
                                    <MapPin size={16} color="#4B5563" />
                                    <Text className="text-gray-600 text-sm font-medium">
                                        {arena.endereco.cidade}, {arena.endereco.estado}
                                    </Text>
                                </HStack>
                            </HStack>
                        </VStack>
                    </BlurView>
                </Box>

                <VStack className="px-5 py-6 bg-gray-50" space="xl">

                    <VStack space="sm">
                        <Heading size="sm">Sobre a Arena</Heading>
                        <Text className="text-gray-600 leading-6 text-sm">
                            {arena.descricao || "Nenhuma descrição disponível."}
                        </Text>
                    </VStack>

                    {/* Mapa */}
                    <VStack space="sm">
                        <Heading size="sm">Localização</Heading>
                        <Text size="xs" className="text-gray-500 mb-2">
                            {arena.endereco.rua}, {arena.endereco.numero} - {arena.endereco.bairro}
                        </Text>

                        {arena.endereco.latitude && arena.endereco.longitude ? (
                            <Box className="h-48 w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                <MapView
                                    style={{ width: '100%', height: '100%' }}
                                    className="w-full h-full"
                                    onMapReady={() => console.log("✅ Mapa carregado com sucesso")}
                                    onMapLoaded={() => console.log("✅ Tiles do mapa renderizadas")}
                                    initialRegion={{
                                        latitude: arena.endereco.latitude,
                                        longitude: arena.endereco.longitude,
                                        latitudeDelta: 0.005,
                                        longitudeDelta: 0.005,
                                    }}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: arena.endereco.latitude,
                                            longitude: arena.endereco.longitude
                                        }}
                                        title={arena.nome}
                                    />
                                </MapView>
                                <TouchableOpacity
                                    onPress={openInMaps}
                                    activeOpacity={0.8}
                                    className="absolute bottom-3 right-3 bg-blue-600 flex-row items-center px-4 py-2 rounded-full shadow-lg"
                                >
                                    <Navigation size={16} color="white" />
                                    <Text className="text-white font-bold ml-2 text-xs">Como chegar</Text>
                                </TouchableOpacity>
                            </Box>
                        ) : (
                            <Box className="h-40 bg-gray-50 items-center justify-center rounded-2xl border border-dashed border-gray-300">
                                <Text className="text-gray-400 italic">Coordenadas não cadastradas.</Text>
                            </Box>
                        )}
                    </VStack>

                    {/* Informações Adicionais */}
                    <VStack className="bg-gray-50 p-4 rounded-2xl border border-gray-100" space="md">
                        <HStack space="md" className="items-center">
                            <Box className="bg-green-100 p-2 rounded-lg">
                                <Clock size={18} color="#16a34a" />
                            </Box>
                            <VStack>
                                <Text size="xs" className="font-bold uppercase text-gray-500 tracking-wider">Cancelamento</Text>
                                <Text size="sm" className="text-gray-700">Até {arena.horasCancelarAgendamento}h de antecedência</Text>
                            </VStack>
                        </HStack>

                        <HStack space="md" className="items-center">
                            <Box className="bg-green-100 p-2 rounded-lg">
                                <Phone size={18} color="#16a34a" />
                            </Box>
                            <VStack>
                                <Text size="xs" className="font-bold uppercase text-gray-500 tracking-wider">Contato</Text>
                                <Text size="sm" className="text-gray-700">{arena.telefone}</Text>
                            </VStack>
                        </HStack>
                    </VStack>

                    <View className="h-4" />
                </VStack>
            </ScrollView>

            {/* Footer */}
            <Box className="px-4 py-4 pt-4 pb-8 border-t border-gray-100 bg-white shadow-top z-20">
                <Button
                    onPress={() => router.push({
                        pathname: "/quadras/[arenaId]",
                        params: { arenaId: arena.id }
                    })}
                    className="w-full bg-green-600 h-14 rounded-2xl active:bg-green-700"
                >
                    <ButtonText className="font-bold text-lg">Ver Quadras e Horários</ButtonText>
                </Button>
            </Box>

            {/* Modal de Avaliações */}
            {arena && (
                <ModalAvaliacoes
                    visible={modalAvaliacoesVisible}
                    onClose={() => setModalAvaliacoesVisible(false)}
                    quadras={arena?.quadras || []}
                    nomeArena={arena?.nome || ''}
                />
            )}
        </View>
    );
}