import { useToast, Toast } from '@/components/ui/toast';
import { View, TouchableOpacity, Text } from 'react-native';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react-native';

export const useToastNotification = () => {
    const toast = useToast();

    const getToastStyles = (action: "success" | "error" | "warning" | "info") => {
        switch (action) {
            case 'success': return { icon: CheckCircle, color: '#10B981', border: 'border-green-500', bgLighter: 'bg-green-50' };
            case 'error': return { icon: AlertCircle, color: '#EF4444', border: 'border-red-500', bgLighter: 'bg-red-50' };
            case 'warning': return { icon: AlertTriangle, color: '#F59E0B', border: 'border-yellow-500', bgLighter: 'bg-yellow-50' };
            case 'info': return { icon: Info, color: '#3B82F6', border: 'border-blue-500', bgLighter: 'bg-blue-50' };
            default: return { icon: Info, color: '#6B7280', border: 'border-gray-500', bgLighter: 'bg-gray-50' };
        }
    };

    const showToast = (
        description?: string,
        action: "success" | "error" | "warning" | "info" = "success"
    ) => {
        if (!toast || typeof toast.show !== 'function') {
            console.warn("Toast context not found");
            return;
        }

        const style = getToastStyles(action);
        const Icon = style.icon;

        toast.show({
            placement: "top",
            render: ({ id }) => {
                const toastId = "toast-" + id;
                return (
                    <Toast
                        nativeID={toastId}
                        className={`bg-white rounded-2xl border-l-4 ${style.border} px-4 py-3 flex-row items-center w-[90vw] max-w-[400px] mt-10`}
                        style={{ elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, backgroundColor: '#ffffff' }}
                    >
                        <View className={`p-2 rounded-full mr-3 ${style.bgLighter}`}>
                            <Icon size={20} color={style.color} />
                        </View>
                        <Text style={{ flex: 1, color: style.color, fontSize: 14, fontWeight: '500', marginHorizontal: 8 }}>
                            {description}
                        </Text>
                        <TouchableOpacity
                            onPress={() => toast.close(id)}
                            className="p-2 rounded-full active:bg-gray-100"
                        >
                            <X size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    </Toast>
                );
            },
        });
    };

    return { showToast };
};