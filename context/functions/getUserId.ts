import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserId = async () => {
    const userDataString = await AsyncStorage.getItem('userData');
    if (!userDataString) throw new Error('Usuário não encontrado');
    const userData = JSON.parse(userDataString);
    return userData.id;
  };