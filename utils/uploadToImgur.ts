/**
 * Faz upload de uma imagem para o Imgur
 * @param uri - URI local da imagem
 * @returns URL pública da imagem no Imgur
 */
export const uploadToImgur = async (uri: string): Promise<string> => {
    const IMGUR_CLIENT_ID = process.env.EXPO_PUBLIC_IMGUR_CLIENT_ID;
    
    if (!IMGUR_CLIENT_ID) {
        throw new Error('IMGUR_CLIENT_ID não configurado');
    }

    const formData = new FormData();
    const filename = uri.split('/').pop() || 'upload.jpg';
    
    formData.append('image', {
        uri,
        name: filename,
        type: 'image/jpeg',
    } as any);

    const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
        body: formData,
    });

    const resData = await response.json();
    
    if (!response.ok || !resData.success) {
        throw new Error(resData?.data?.error || 'Erro ao fazer upload para o Imgur.');
    }

    return resData.data.link;
};