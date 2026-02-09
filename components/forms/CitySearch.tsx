import { useState, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { InputTexto } from '@/components/forms/formInputs/InputTexto';
import { Text } from '@/components/ui/text';
import { getCidadesComArenas } from '@/services/api/endpoints/arena';
import { useDebounce } from '@/hooks/useDebounce';
import { MapPin, Search } from 'lucide-react-native';
import { Cidade } from '@/types/Arena';

interface CitySearchProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export const CitySearch = ({ value, onChangeText, placeholder = "Buscar por cidade..." }: CitySearchProps) => {
    const [suggestions, setSuggestions] = useState<Cidade[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useDebounce(value, 300);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!debouncedSearch || debouncedSearch.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const results = await getCidadesComArenas(debouncedSearch);
                setSuggestions(results);
                if (results.length > 0) setShowSuggestions(true);
                else setShowSuggestions(false);
            } catch (error) {
                console.error("Erro ao buscar cidades:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [debouncedSearch]);

    const handleSelectCity = (city: Cidade) => {
        onChangeText(city.nome);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    return (
        <View className="relative z-50">
            <InputTexto
                value={value}
                onChangeText={(text) => {
                    onChangeText(text);
                    if (text.length === 0) setShowSuggestions(false);
                }}
                placeholder={placeholder}
                onFocus={() => {
                    if (value.length >= 2) setShowSuggestions(true);
                }}
                leftIcon={<Search size={20} color="#9ca3af" />}
            />

            {showSuggestions && suggestions.length > 0 && (
                <View className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 z-50">
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item, index) => `${item.nome}-${item.estado}-${index}`}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="p-3 border-b border-gray-100 flex-row items-center active:bg-gray-50 bg-white"
                                onPress={() => handleSelectCity(item)}
                            >
                                <MapPin size={16} color="#9ca3af" style={{ marginRight: 8 }} />
                                <Text className="text-gray-700">{item.nome} - {item.estado}</Text>
                            </TouchableOpacity>
                        )}
                        ListFooterComponent={loading ? <ActivityIndicator size="small" color="#10b981" className="py-2" /> : null}
                    />
                </View>
            )}
        </View>
    );
};
