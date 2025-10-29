export const validateConfirmPassword = (pwd: string, confirmPwd: string) => {
    if (!confirmPwd) {
      return 'Por favor, confirme sua nova senha';
    }
    if (pwd !== confirmPwd) {
      return 'As senhas não coincidem';
    }
    return '';
  };