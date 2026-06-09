# Diretrizes de Desenvolvimento Frontend — GreenPay Impact

Este documento estabelece as diretrizes técnicas robustas para a construção do frontend da aplicação GreenPay Impact, servindo de guia para agentes de IA e desenvolvedores.

---

## 🛠️ Stack Tecnológica

O projeto frontend deve ser construído estritamente utilizando as tecnologias abaixo:

1. **React 19**
   * Aproveitar as melhorias de performance, a nova API do React Compiler (quando aplicável) e a simplificação do uso de formulários (`useActionState`, `<form action={...}>`).
   * Componentização focada em responsabilidade única (Single Responsibility Principle).

2. **TypeScript**
   * Tipagem estrita de todas as propriedades, retornos de API e estados da aplicação.
   * Evitar o uso de `any`. Definir interfaces e tipos explícitos para requisições e respostas.

3. **Tailwind CSS v4**
   * Utilizar a nova arquitetura do Tailwind v4 (CSS-first). A configuração é feita diretamente no CSS principal através da diretiva `@theme` em vez de um arquivo `tailwind.config.js`.
   * **Exemplo de Configuração CSS-First (Tailwind v4):**
     ```css
     @import "tailwindcss";

     @theme {
       --color-brand-red: #E2001A;
       --color-brand-red-hover: #C30016;
       --color-brand-green: #00A184;
       --color-brand-green-hover: #00846C;
       --color-brand-blue: #0D8AFF;
       
       --font-sans: "Inter", sans-serif;
     }
     ```
   * Utilizar as variáveis CSS personalizadas definidas no design system corporativo da Edenred.

---

## 🧼 Clean Code & Padrões de Projeto

* **Estrutura de Pastas Organizada:**
  * `src/components`: Componentes reutilizáveis e puros (ex: Buttons, Cards, Inputs).
  * `src/hooks`: Custom hooks para encapsular lógica de chamadas da API e controle de estados complexos.
  * `src/services`: Arquivos de serviço para encapsular chamadas de rede (ex: `api.ts` utilizando Axios ou Fetch).
  * `src/types`: Definição de tipos TypeScript compartilhados.
* **Componentes Funcionais:** Utilizar prioritariamente componentes funcionais estruturados de forma limpa e hooks customizados para separação de preocupações (Separation of Concerns).
* **Tratamento de Erros:** Exibir feedbacks claros e amigáveis para o usuário em caso de falha nas requisições.

---

## ✨ Experiência do Usuário (UX) & Design (Edenred Branding)

* **Paleta de Cores (Edenred):**
  * Vermelho Primário: `#E2001A` (Hover: `#C30016`)
  * Verde Accent: `#00A184` (Hover: `#00846C`)
  * Azul Accent: `#0D8AFF` (Hover: `#0070D2`)
  * Teal Accent: `#20C997` (Hover: `#17a2b8`)
* **UX Moderna:** Interações fluidas com transições e micro-animações nas interações de botões, hovers e transições de tela.
* **Responsividade:** Layout responsivo focado na abordagem Mobile-First.

---

## 📡 Comunicação com o Backend (API)

A base URL da API em desenvolvimento local é: `http://localhost:8081`

### 1. Endpoint: Cadastro e Simulação de Empresa
Envia os dados da empresa para cadastrar e processar os cálculos de impacto ambiental baseados em transações físicas e digitais.

* **Método:** `POST`
* **Caminho:** `/api/empresas`
* **Headers:** `Content-Type: application/json`
* **Corpo da Requisição (`CalculoRequest`):**
  ```json
  {
    "nomeEmpresa": "Minha Empresa LTDA",
    "cnpj": "12.345.678/0001-99",
    "email": "contato@empresa.com",
    "transacoes": 150000,
    "percentualMigracao": 75.5
  }
  ```
* **Resposta de Sucesso (`200 OK`):** Retorna os resultados calculados e dados da empresa simulada.

### 2. Endpoint: Listar Histórico de Simulações
Retorna a lista com o histórico de todas as simulações e cálculos processados no sistema.

* **Método:** `GET`
* **Caminho:** `/api/empresas`
* **Resposta de Sucesso (`200 OK`):** Lista de simulações cadastradas.

### 3. Endpoint: Buscar Impacto por ID da Empresa
Busca o resultado detalhado de impacto de carbono e métricas de uma empresa específica cadastrada.

* **Método:** `GET`
* **Caminho:** `/api/empresas/{id}/impacto`
* **Parâmetro de URL:** `id` (Long)
* **Resposta de Sucesso (`200 OK`):** Retorna o impacto detalhado (`CalculoResponse`).

### 4. Endpoint: Gerenciamento de Fatores de Emissão
Usado para gerenciar os fatores de conversão de emissões de CO2 por tipo de transação (Física ou Digital).

* **Cadastrar Fator:** `POST /api/fatores`
  * **Body (`FatorEmissaoRequest`):**
    ```json
    {
      "tipo": "FISICA",
      "valor": 0.0543,
      "fonteMetodologia": "Metodologia GHG Protocol 2026"
    }
    ```
* **Listar Todos os Fatores:** `GET /api/fatores`
* **Listar Fatores Ativos:** `GET /api/fatores/ativos`
