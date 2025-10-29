export const validatePassword = (pwd: string) => {
    if (!pwd) {
      return 'Por favor, insira sua nova senha';
    }
    if (pwd.length < 8) {
      return 'A senha deve ter no mínimo 8 caracteres';
    }
    return '';
  };