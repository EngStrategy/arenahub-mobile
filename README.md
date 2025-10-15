# ArenaHub Mobile 📱

Bem-vindo ao repositório do ArenaHub Mobile! [cite_start]Este é um aplicativo para a gestão e reserva online de espaços esportivos, projetado para conectar atletas a proprietários de arenas de forma simples e eficiente. [cite: 10]

O ArenaHub resolve o problema da ineficiência e da falta de praticidade no processo de reserva de quadras esportivas, que muitas vezes depende de métodos tradicionais. [cite_start]A aplicação centraliza e automatiza o processo de agendamento, oferecendo mais agilidade e organização para todos. [cite: 79, 82]

## ✨ Principais Funcionalidades

O sistema foi desenhado com dois perfis de usuário em mente: as funcionalidades do Atleta e do Proprietário.

### Para Atletas 🏃

* [cite_start]**Busca Inteligente:** Encontre arenas e quadras por localização e tipo de esporte. [cite: 131]
* [cite_start]**Visualização de Disponibilidade:** Veja os calendários das quadras com horários livres e ocupados em tempo real. [cite: 139]
* [cite_start]**Reserva Online:** Agende seu horário com confirmação instantânea. [cite: 137, 143]
* [cite_start]**Jogos Públicos:** Crie partidas abertas para encontrar outros jogadores ou participe de jogos já existentes. [cite: 162, 169]
* [cite_start]**Gestão de Agendamentos:** Visualize e cancele suas reservas futuras. [cite: 145, 154]
* [cite_start]**Avaliações:** Dê notas e feedbacks sobre as quadras após uma partida para ajudar a comunidade. [cite: 188, 191]

### Para Proprietários 🏟️

* [cite_start]**Gestão de Arenas e Quadras:** Cadastre, edite e remova suas arenas e as quadras que as compõem. [cite: 205, 212, 219, 228, 236, 243]
* [cite_start]**Controle de Disponibilidade:** Defina horários de funcionamento e bloqueie datas específicas para manutenção ou eventos. [cite: 254]
* [cite_start]**Dashboard Visual:** Acompanhe o desempenho do seu negócio com relatórios de faturamento e taxa de ocupação. [cite: 261]
* **Painel de Agendamentos:** Visualize todos os agendamentos das suas quadras de forma centralizada.

## 🛠️ Tecnologias Utilizadas

* **React Native:** Estrutura para desenvolvimento de aplicativos móveis nativos.
* **Expo (com Expo Router):** Ecossistema para facilitar o desenvolvimento, build e publicação, com navegação baseada em sistema de arquivos.
* **TypeScript:** Superset do JavaScript que adiciona tipagem estática ao código.
* **Axios:** Cliente HTTP para comunicação com a API backend.
* **Context API:** Para gerenciamento de estado global (como autenticação).

## 📋 Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados na sua máquina:

* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* [Git](https://git-scm.com/)
* [Yarn](https://yarnpkg.com/) (ou `npm`, que já vem com o Node.js)
* **App Expo Go** instalado no seu celular (iOS ou Android) para testar o projeto.

## 🚀 Instalação

**1. Clonar o Repositório**
```bash
git clone <URL_DO_SEU_REPOSITORIO_GIT>
cd arenahub-mobile

```
**2. Instalar dependências**
```bash
# Com Yarn
yarn install

# Ou com NPM
npm install
```
**3. Configurações de ambiente**
* Crie um arquivo chamado .env na raiz do projeto e adicione a URL da sua API.
```bash
# .env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3333/api
```


**4. Iniciar o Servidor de Desenvolvimento**
* Com tudo instalado, inicie o servidor do Expo.
```bash
# Com Yarn
yarn start

# Ou com NPM
npx expo start
```
**4.1 Abrir o celular**
* Após executar o comando acima, um QR Code aparecerá no seu terminal.
* Abra o aplicativo Expo Go no seu celular e escaneie o QR Code para carregar o app.

## 📂 Estrutura do Projeto

O projeto utiliza o Expo Router, onde a estrutura de navegação e telas é definida pela organização de pastas e arquivos dentro de `app/`.

```plaintext
├── app/              # Telas e Navegação (dividida por fluxos)
├── assets/           # Fontes e Imagens
├── components/       # Componentes reutilizáveis
├── constants/        # Cores e temas
├── contexts/         # Estado global (autênticação)
├── services/         # Lógica de comunicação com a API
└── ...
```


