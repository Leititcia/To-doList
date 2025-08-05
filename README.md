# 📝 To-Do List - TypeScript

Aplicação de lista de tarefas desenvolvida em TypeScript puro com manipulação de DOM e transpilação usando `tsc`.

## ✨ Funcionalidades Implementadas

### **Funcionalidades Básicas:**
- ✅ Adicionar novas tarefas
- ✅ Marcar tarefas como concluídas
- ✅ Remover tarefas individuais
- ✅ Contador de tarefas pendentes

### **Funcionalidades Avançadas:**
- ✅ **Edição inline** - duplo clique para editar
- ✅ **Paginação** - 5 tarefas por página
- ✅ **Modal de confirmação** para exclusão
- ✅ **Novas tarefas no topo** da lista
- ✅ **Persistência local** (localStorage)

## 🏗️ Arquitetura Técnica

### **Estrutura do Projeto:**
```
├── src/
│   ├── types.ts      # Interface Task e tipos TypeScript
│   ├── storage.ts    # Classe TaskStorage - gerenciamento localStorage
│   ├── ui.ts         # Classe TaskUI - manipulação DOM
│   └── app.ts        # Classe TodoApp - lógica principal
├── dist/             # Arquivos transpilados (tsc)
├── index.html        # Página principal
├── styles.css        # Estilos CSS
├── package.json      # Configurações e scripts
├── tsconfig.json     # Configuração TypeScript
└── README.md         # Documentação
```

### **Tecnologias Utilizadas:**
- **TypeScript** - Linguagem principal com tipos explícitos
- **HTML5** - Estrutura da página
- **CSS3** - Estilos e animações
- **Bootstrap 5** - Framework CSS
- **localStorage** - Persistência de dados
- **ES6 Modules** - Sistema de módulos

## 🔧 Implementação Técnica

### **1. Tipos Explícitos e Interface:**
```typescript
// src/types.ts
export interface Task {
    id: string;
    text: string;
    completed: boolean;
}
```

### **2. Classes Implementadas:**
- **`TaskUI`** - Manipulação de DOM e eventos
- **`TaskStorage`** - Gerenciamento de dados no localStorage
- **`TodoApp`** - Orquestração da aplicação

### **3. Manipulação de DOM:**
```typescript
// document.getElementById
this.taskList = document.getElementById('taskList') as HTMLElement;

// querySelector
const taskText = deleteBtn.closest('.task-item')?.querySelector('.task-text');

// Criação de elementos
const editInput = document.createElement('input');

// Event listeners
this.taskList.addEventListener('click', (e) => this.handleTaskListClick(e));
```

### **4. Transpilação TypeScript:**
```json
// package.json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

## 🚀 Como executar

### **Pré-requisitos:**
- Node.js (versão 14 ou superior)
- npm

### **Instalação e Execução:**

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Transpilar TypeScript:**
   ```bash
   npm run build
   ```

3. **Iniciar servidor:**
   ```bash
   npm start
   ```

4. **Acessar:** `http://localhost:8080`

### **Scripts Disponíveis:**
- `npm run build` - Transpila TypeScript para JavaScript
- `npm run dev` - Transpilação em modo watch
- `npm start` - Inicia servidor de desenvolvimento

## 🎯 Como usar

### **Adicionar Tarefa:**
1. Digite o texto no campo
2. Pressione Enter ou clique em "Adicionar"
3. A tarefa aparece no topo da lista

### **Editar Tarefa:**
1. **Duplo clique** no texto da tarefa
2. Edite o texto no campo que aparece
3. **Pressione Enter** ou **clique fora** para salvar
4. **Pressione Escape** para cancelar

### **Marcar como Concluída:**
1. Clique na caixa de seleção ao lado da tarefa
2. A tarefa fica riscada e com opacidade reduzida

### **Excluir Tarefa:**
1. Clique no ícone de lixeira
2. Confirme no modal que aparece
3. A tarefa é removida da lista

### **Navegar entre Páginas:**
1. Use os botões numerados
2. Use "Anterior" e "Próximo"
3. A página atual fica destacada

## 📱 Responsividade

- **Desktop:** Layout completo com todas as funcionalidades
- **Tablet:** Adaptação automática dos elementos
- **Mobile:** Layout empilhado e botões maiores
- **Paginação:** Botões menores em telas pequenas

## 🛠️ Desenvolvimento

### **Para contribuir:**
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente suas mudanças
4. Execute `npm run build` para verificar erros
5. Faça commit das mudanças
6. Abra um Pull Request

### **Estrutura de Classes:**
- **`TaskUI`** - Gerencia interface e eventos DOM
- **`TaskStorage`** - Gerencia persistência de dados
- **`TodoApp`** - Orquestra a aplicação

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com TypeScript, manipulação de DOM e transpilação usando `tsc`.** 