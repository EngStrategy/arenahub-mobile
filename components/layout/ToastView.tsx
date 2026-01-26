import { useToast, Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';
import { VStack } from '../ui/vstack';

const toast = useToast();

// Função para disparar os toasts
export const showToast = (title: string, description: string, action: "success" | "error" | "warning" | "info" = "success") => {
    toast.show({
        placement: "top",
        render: ({ id }) => {
            const toastId = "toast-" + id;
            return (
                <Toast nativeID={toastId} action={action} variant="solid">
                    <VStack space="xs">
                        <ToastTitle>{title}</ToastTitle>
                        <ToastDescription>{description}</ToastDescription>
                    </VStack>
                </Toast>
            );
        },
    });
};