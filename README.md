ArenaHub Mobile 📱
Bem-vindo ao repositório do ArenaHub Mobile! Este é um aplicativo para a gestão e reserva online de espaços esportivos, projetado para conectar atletas a proprietários de arenas de forma simples e eficiente. 

O ArenaHub resolve o problema da ineficiência e da falta de praticidade no processo de reserva de quadras esportivas, que muitas vezes depende de métodos tradicionais como ligações ou atendimento presencial. A aplicação centraliza e automatiza o processo de agendamento, oferecendo mais agilidade e organização para todos. 





✨ Principais Funcionalidades
O sistema foi desenhado com dois perfis de usuário em mente:

Para Atletas 🏃

Busca Inteligente: Encontre arenas e quadras por localização e tipo de esporte. 


Visualização de Disponibilidade: Veja os calendários das quadras com horários livres e ocupados em tempo real. 


Reserva Online: Agende seu horário com confirmação instantânea. 



Jogos Públicos: Crie partidas abertas para encontrar outros jogadores ou participe de jogos já existentes. 



Gestão de Agendamentos: Visualize e cancele suas reservas futuras. 



Avaliações: Dê notas e feedbacks sobre as quadras após uma partida para ajudar a comunidade. 

Para Proprietários 🏟️

Gestão de Arenas e Quadras: Cadastre, edite e remova suas arenas e as quadras que as compõem. 






Controle de Disponibilidade: Defina horários de funcionamento e bloqueie datas específicas para manutenção ou eventos. 


Dashboard Visual: Acompanhe o desempenho do seu negócio com relatórios de faturamento e taxa de ocupação. 

Painel de Agendamentos: Visualize todos os agendamentos das suas quadras de forma centralizada.

🛠️ Tecnologias Utilizadas
React Native: Estrutura para desenvolvimento de aplicativos móveis nativos.

Expo (com Expo Router): Ecossistema para facilitar o desenvolvimento, build e publicação, com navegação baseada em sistema de arquivos.

TypeScript: Superset do JavaScript que adiciona tipagem estática ao código.

Axios: Cliente HTTP para comunicação com a API backend.

Context API: Para gerenciamento de estado global (como autenticação).

📋 Pré-requisitos
Antes de começar, garanta que você tenha os seguintes softwares instalados na sua máquina:

Node.js (versão LTS recomendada)

Git

Yarn (ou npm, que já vem com o Node.js)

App Expo Go instalado no seu celular (iOS ou Android) para testar o projeto.

🚀 Instalação e Execução
Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento localmente.

1. Clonar o Repositório

Bash

git clone <URL_DO_SEU_REPOSITORIO_GIT>
cd arenahub-mobile
2. Instalar as Dependências

Use o gerenciador de pacotes de sua preferência.

Bash

# Com Yarn
yarn install

# Ou com NPM
npm install
3. Configurar Variáveis de Ambiente

As variáveis de ambiente são usadas para armazenar informações sensíveis, como a URL da sua API.

Crie um arquivo chamado .env na raiz do projeto.

Copie o conteúdo do arquivo .env.example (se existir) ou adicione a seguinte variável:

Snippet de código

# .env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3333/api
Importante: Para que seu celular consiga acessar a API que está rodando no seu computador, substitua SEU_IP_LOCAL pelo endereço de IP da sua máquina na sua rede local (ex: 192.168.1.10).

4. Rodar a Aplicação

Com tudo instalado, inicie o servidor de desenvolvimento do Expo.

Bash

# Com Yarn
yarn start

# Ou com NPM
npx expo start
5. Abrir no Celular

Após executar o comando acima, um QR Code aparecerá no seu terminal.

Abra o aplicativo Expo Go no seu celular.

Escaneie o QR Code e o aplicativo ArenaHub será carregado no seu dispositivo para testes.

📂 Estrutura do Projeto
O projeto utiliza o Expo Router, onde a estrutura de navegação e telas é definida pela organização de pastas e arquivos dentro de app/.

├── app/              # Telas e Navegação
├── assets/           # Fontes e Imagens
├── components/       # Componentes reutilizáveis
├── constants/        # Cores e temas
├── contexts/         # Estado global (autenticação)
├── services/         # Lógica de comunicação com a API
└── ...
