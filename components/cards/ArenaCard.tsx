import { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import { Arena } from '@/context/types/Arena';
import { type TipoQuadra } from '@/context/types/Quadra';
import { formatarEsporte } from '@/context/functions/formatters';

interface ArenaCardProps {
    arena: Arena;
    showDescription?: boolean;
    showEsportes?: boolean;
}

export const ArenaCard = ({ arena, showDescription, showEsportes = true }: ArenaCardProps) => {
    const fallbackSrc = 'https://i.imgur.com/4U63rk7.png';
    const [imgSrc, setImgSrc] = useState(arena.urlFoto || fallbackSrc);

    const esportesFormatados = arena.esportes
        ? (arena.esportes as TipoQuadra[]).map(formatarEsporte)
        : [];

    const esportesList = esportesFormatados.join(', ');

    return (
        <View
            // Substitui <Box> e aplica estilos de Card
            className="w-full bg-white p-3 rounded-lg shadow-xl border border-gray-200"
        >
            {/* HStack space="md" className='flex items-stretch' */}
            <View className='flex flex-row items-stretch gap-3'>

                {/* Imagem/Avatar */}
                <Image
                    source={{ uri: imgSrc }}
                    alt={`Foto da ${arena.nome}`}
                    className="w-20 h-20 rounded-lg flex-shrink-0"
                    onError={() => { setImgSrc(fallbackSrc); }}
                />

                {/* Coluna de Conteúdo (VStack className='flex flex-1 justify-between min-w-0') */}
                <View className='flex flex-1 justify-between min-w-0'>

                    {/* Título e Endereço (VStack space="xs") */}
                    <View className='flex flex-col gap-0.5'>

                        {/* Nome da Arena (Heading size="sm") */}
                        <Text
                            className="text-lg font-bold text-gray-800" // Simula Heading size="sm"
                            numberOfLines={1}
                        >
                            {arena.nome}
                        </Text>

                        {/* Endereço (Text size="xs" className="text-gray-500") */}
                        <Text className="text-xs text-gray-500">
                            {arena.endereco.cidade} - {arena.endereco.estado}
                            {'\n'}
                            {arena.endereco.rua}, {arena.endereco.numero} - {arena.endereco.bairro}
                        </Text>

                        {/* Esportes */}
                        {(esportesFormatados.length > 0 && showEsportes) && (
                            <Text className="text-xs text-green-600 font-bold mt-1" numberOfLines={1}>
                                {esportesList}
                            </Text>
                        )}
                    </View>

                    {/* Descrição */}
                    {!!showDescription && !!arena.descricao &&
                        <Text numberOfLines={2} className="my-1 text-sm text-gray-500">
                            {arena.descricao}
                        </Text>
                    }

                    {/* Avaliação (HStack space="xs") */}
                    <View className="flex flex-row items-center mt-1 gap-1">
                        <Star size={14} fill="#facc15" color="#facc15" />
                        <Text className="text-sm font-bold text-gray-800">
                            {arena.notaMedia?.toFixed(1) || 'N/A'}
                        </Text>
                        <Text className="text-xs ml-1 text-gray-500">
                            ({arena.quantidadeAvaliacoes} avaliações)
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ArenaCard;