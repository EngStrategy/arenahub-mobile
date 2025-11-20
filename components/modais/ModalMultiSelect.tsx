import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Modal, Pressable, TouchableOpacity } from 'react-native';
import { X, Check } from 'lucide-react-native';

interface Option {
    value: string;
    label: string;
}

interface ModalMultiSelectProps {
    readonly open: boolean;
    readonly title: string;
    readonly options: Option[];
    readonly initialValues: string[];
    readonly onClose: () => void;
    readonly onSave: (selectedValues: string[]) => void;
}

const SimpleCheckbox = ({ isChecked, label, onPress }: { isChecked: boolean; label: string; onPress: () => void; }) => (
    <Pressable
        onPress={onPress}
        className="flex-row items-center p-3 w-full bg-transparent rounded border-0"
        style={{ 
            borderRadius: isChecked ? 12 : 0,
            marginBottom: isChecked ? 4 : 0,
            backgroundColor: isChecked ? '#D1FAE5' : 'transparent',
        }}
    >
        <View
            className={`w-5 h-5 rounded border-2 mr-3 justify-center items-center ${isChecked ? 'bg-green-600 border-green-600' : 'border-gray-400'}`}
        >
            {isChecked && <Check size={14} color="white" />}
        </View>
        <Text className="text-base text-gray-800 flex-1">{label}</Text>
    </Pressable>
);


export function ModalMultiSelect({
    open,
    title,
    options,
    initialValues,
    onClose,
    onSave,
}: ModalMultiSelectProps) {
    const [selectedValues, setSelectedValues] = useState<string[]>(initialValues);

    useEffect(() => {
        setSelectedValues(initialValues);
    }, [initialValues, open]);

    const toggleSelection = (value: string) => {
        setSelectedValues(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    const handleSave = () => {
        onSave(selectedValues);
    };

    const handleCancel = () => {
        setSelectedValues(initialValues);
        onClose();
    }

    const selectedCount = selectedValues.length;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={open}
            onRequestClose={handleCancel}
        >
            <Pressable className="flex-1 bg-black/50 justify-end" onPress={handleCancel}>
                <Pressable
                    className="bg-white rounded-t-xl w-full max-h-[90vh]"
                    onPress={() => { }}
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                        <Text className="text-xl font-bold text-gray-800">{title}</Text>
                        <TouchableOpacity onPress={handleCancel} className="p-2">
                            <X size={24} color='black' />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="max-h-[70vh] w-full">
                        <View className="p-4">
                            {options.map((option) => (
                                <SimpleCheckbox
                                    key={option.value}
                                    label={option.label}
                                    isChecked={selectedValues.includes(option.value)}
                                    onPress={() => toggleSelection(option.value)}
                                />
                            ))}
                        </View>
                    </ScrollView>

                    <View className="flex-row justify-between p-4 border-t border-gray-200">
                        <TouchableOpacity
                            onPress={handleCancel}
                            style={{
                                flex: 1,
                                marginRight: 8,
                                borderWidth: 1,
                                borderColor: 'red',
                                backgroundColor: 'white',
                                padding: 10,
                                alignItems: 'center',
                                borderRadius: 4,
                            }}
                        >
                            <Text style={{ color: 'red' }}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSave}
                            style={{
                                flex: 1,
                                marginLeft: 8,
                                backgroundColor: 'green',
                                padding: 10,
                                alignItems: 'center',
                                borderRadius: 4,
                            }}
                        >
                            <Text style={{ color: 'white' }}>Salvar ({selectedCount})</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}