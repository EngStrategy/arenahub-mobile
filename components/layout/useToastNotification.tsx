import { useToast, Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';
import { VStack } from '../ui/vstack';

export const useToastNotification = () => {
    const toast = useToast();

    const showToast = (
        title?: string,
        description?: string,
        action: "success" | "error" | "warning" | "info" = "success"
    ) => {
        if (!toast || typeof toast.show !== 'function') {
            console.warn("Toast context not found");
            return;
        }
        toast.show({
            placement: "top",
            render: ({ id }) => {
                const toastId = "toast-" + id;
                return (
                    <Toast nativeID={toastId} action={action} variant="solid">
                        <VStack space="xs">
                            {title && <ToastTitle className="text-white font-bold">{title}</ToastTitle>}
                            {description && <ToastDescription className="text-white">{description}</ToastDescription>}
                        </VStack>
                    </Toast>
                );
            },
        });
    };

    return { showToast };
};