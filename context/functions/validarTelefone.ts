export function validarTelefone(telefone: string): string {
    const telefoneLimpo = telefone.replace(/[^\d]+/g, "");
    const regexTelefone = /^(?:\+55)?(?:\s?\(?[1-9][0-9]\)?\s?)?(?:9[0-9]{4}-?[0-9]{4}|[2-9][0-9]{3}-?[0-9]{4})$/;

    if (!regexTelefone.test(telefoneLimpo)) {
        return "Número de telefone inválido";
    }

    return '';
}