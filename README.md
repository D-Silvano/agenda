# Sistema de Agendamento Médico

Sistema moderno e responsivo para gestão de agendamentos em clínicas e hospitais, desenvolvido com React, TypeScript, Tailwind CSS e Supabase.

![Banner](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070)

## 🚀 Tecnologias

- **Frontend**: React, TypeScript, Vite
- **Estilização**: Tailwind CSS (Design Premium White/Gold)
- **Backend/Banco de Dados**: Supabase (PostgreSQL)
- **Ícones**: Heroicons

## ✨ Funcionalidades Principais

### 🔐 Autenticação e Segurança
- Login seguro com CPF e senha.
- Controle de acesso baseado em funções (RBAC): **Administrador** e **Profissional de Saúde**.
- Proteção de rotas e persistência de sessão.
- Políticas de segurança (RLS) no banco de dados.

### 📅 Gestão de Agendamentos
- **Cadastro de Pacientes**: Formulário completo com validação de CPF.
- **Agendamento Inteligente**: Seleção de médico, data e horário com verificação de conflitos.
- **Listas de Agendamento**: Visualização clara dos pacientes do dia.
- **Status do Paciente**: Mark como "Atendido", "Adiado" ou "Desistência" com indicadores visuais.

### 👥 Gestão de Usuários (Admin)
- **CRUD Completo**: Criar, listar, editar e excluir usuários.
- **Visualização**: Tabela responsiva com busca e filtros.
- **Proteção**: Impede a exclusão do próprio usuário administrador.

### 🎨 Personalização
- **Banner Personalizável**: Upload de imagem para o cabeçalho com persistência no banco de dados.
- **Interface Premium**: Design limpo e sofisticado com animações suaves.

### 🏥 Gestão de Médicos
- Cadastro de médicos com especialidades, CRM e procedimentos.
- Associação de médicos a agendamentos.

## 🛠️ Configuração do Banco de Dados

O sistema utiliza o Supabase. Para configurar, execute os scripts SQL localizados na pasta `migrations/` no SQL Editor do seu projeto Supabase:

1. `create_app_settings.sql`: Cria tabela para configurações globais (banner).
2. Certifique-se de que as tabelas `profiles`, `patients`, `doctors`, `appointments` e `scheduling_lists` existam com as políticas RLS apropriadas.

## 📦 Como Rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📝 Licença

Este projeto está sob a licença MIT.
