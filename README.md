# 🌿 Endered Green Dashboard

> Dashboard de Impacto Ambiental — Plataforma de Cartões Digitais

Aplicação Spring Boot que exibe em tempo real o impacto ambiental positivo gerado pela substituição de cartões físicos PVC por cartões digitais, incluindo mapa de calor interativo e sistema de solicitação de cartões.

---

## 🚀 Como Executar

### Pré-requisitos
- **Java 21+** ([Download](https://adoptium.net/))
- **Maven 3.8+** ([Download](https://maven.apache.org/download.cgi))

### Passos

```bash
# 1. Entre na pasta do projeto
cd endered-dashboard

# 2. Instale as dependências e execute
mvn spring-boot:run

# 3. Abra no navegador
# http://localhost:8080
```

> Na primeira execução, dados de demonstração são carregados automaticamente com 33 cartões digitais em cidades brasileiras.

---

## 🗂️ Estrutura do Projeto

```
endered-dashboard/
├── src/main/java/com/endered/dashboard/
│   ├── EnderedDashboardApplication.java     # Ponto de entrada
│   ├── config/
│   │   └── DataSeeder.java                 # Dados demo iniciais
│   ├── controller/
│   │   ├── DashboardController.java        # API REST (/api/*)
│   │   └── WebController.java             # Rotas web (/, /solicitar)
│   ├── model/
│   │   ├── DigitalCard.java               # Entidade JPA - Cartão Digital
│   │   ├── ImpactoAmbiental.java          # Cálculos ambientais
│   │   └── HeatMapPoint.java             # Ponto do mapa de calor
│   ├── repository/
│   │   └── DigitalCardRepository.java    # JPA Repository + queries
│   └── service/
│       └── DashboardService.java         # Lógica de negócio
│
├── src/main/resources/
│   ├── templates/
│   │   ├── dashboard.html                # Dashboard principal (Thymeleaf)
│   │   └── solicitar.html               # Formulário de solicitação
│   └── application.properties           # Configurações
│
└── pom.xml                              # Dependências Maven
```

---

## 📡 API REST

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/dashboard` | Todos os dados do dashboard (impacto + mapa + gráficos) |
| `GET` | `/api/impacto` | Métricas ambientais calculadas |
| `GET` | `/api/heatmap` | Pontos do mapa de calor por cidade |
| `GET` | `/api/cartoes` | Lista todos os cartões cadastrados |
| `POST` | `/api/cartoes` | Solicitar novo cartão digital |

### Exemplo — Solicitar Cartão (POST `/api/cartoes`)

```json
{
  "nomeCompleto": "Maria Silva",
  "email": "maria@email.com",
  "cpfCnpj": "123.456.789-00",
  "telefone": "(11) 91234-5678",
  "cidade": "São Paulo",
  "estado": "SP",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "tipoCartao": "CARTAO_BENEFICIOS"
}
```

### Tipos de Cartão
- `CARTAO_BENEFICIOS`
- `CARTAO_PRESENTE`
- `CARTAO_FIDELIDADE`
- `CARTAO_CORPORATIVO`

---

## 🌍 Cálculo do Impacto Ambiental

Os cálculos são baseados em estudos de ciclo de vida (LCA) de cartões PVC:

| Indicador | Por Cartão Físico Evitado |
|-----------|--------------------------|
| CO₂ | 150g não emitidos |
| Plástico PVC | 5g não gerados |
| Água | 1,5L economizados |
| Energia | 0,08 kWh poupados |
| Equivalência em árvores | CO₂ ÷ 21,7 kg/ano por árvore |

---

## 🗺️ Funcionalidades

### Dashboard Principal (`/`)
- **6 métricas ambientais** com contadores animados
- **Mapa de calor interativo** (Leaflet.js + heat layer) mostrando concentração de digitalização por cidade
- **Gráfico de barras** — solicitações mensais
- **Gráfico donut** — distribuição por tipo de cartão
- **Tabela** — últimas 10 solicitações com status
- Auto-refresh a cada 30 segundos

### Solicitação de Cartão (`/solicitar`)
- Formulário validado com máscaras automáticas (CPF, telefone)
- Seleção de cidade com coordenadas automáticas
- Aprovação instantânea
- Feedback visual de impacto individual após cadastro

---

## 🛠️ Tecnologias

| Categoria | Tecnologia |
|-----------|-----------|
| Backend | Spring Boot 3.2, Spring Data JPA, Bean Validation |
| Banco de Dados | H2 In-Memory (dev) — troque por PostgreSQL em produção |
| Template Engine | Thymeleaf |
| Mapa | Leaflet.js + Leaflet.heat |
| Gráficos | Chart.js 4.4 |
| Fontes | Syne + DM Sans (Google Fonts) |

---

## 🔧 Migrar para PostgreSQL (Produção)

No `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/endereddb
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

No `pom.xml`, adicione:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

## 🖥️ Console H2 (Desenvolvimento)

Acesse `http://localhost:8080/h2-console`

- **JDBC URL:** `jdbc:h2:mem:endereddb`
- **User:** `sa`
- **Password:** *(vazio)*

---

## 📸 Páginas

- **`/`** — Dashboard com métricas, mapa de calor e gráficos
- **`/solicitar`** — Formulário de solicitação de cartão digital
- **`/api/dashboard`** — Endpoint JSON com todos os dados

---

## Histórias do Usuário

https://docs.google.com/document/d/1f34Oak4A2xPoKNDfj0yPCjTfBOlPhg7t7sWSJyowI3w/edit?tab=t.0

## Protótipo Lo-Fi
[link para o Figma](https://www.figma.com/board/lZy6lebsYlZyLumOq8trZp/FigJam-Projetos-3?node-id=0-1&t=QaWe2uT1S32XltJd-1)

## Screencast
link para o vídeo no YouTube

---

## 👥 Equipe

### 💼 Negócios
- André (**afg@cesar.school**)
- Danilo (**dmd@cesar.school**)
- Júlia (**jmc3@cesar.school**)

### 💻 Tech
- Caio (**cme@cesar.school**)
- Kaiki (**knsg@cesar.school**)
- Xulio (**jssn@cesar.school**)

### 📈 Gestão
- Venâncio (**avvn@cesar.school**)
- Victor (**vlns@cesar.school**)


*Endered — Tecnologia a favor do planeta.* 🌱
