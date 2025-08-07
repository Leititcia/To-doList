# To-Do List - TypeScript

Aplicação de lista de tarefas desenvolvida em TypeScript puro.

<img width="530" height="867" alt="Image" src="https://github.com/user-attachments/assets/a473adff-1fb0-4209-83b4-98fd947b094d" />

## Funcionalidades

### **Funcionalidades Básicas:**
- ✅ **Adicionar tarefas** - Título obrigatório, descrição opcional
- ✅ **Marcar como concluída** - Checkbox com visual riscado
- ✅ **Remover tarefas** - Exclusão direta sem confirmação
- ✅ **Contador dinâmico** - Tarefas pendentes atualizadas em tempo real

### **Funcionalidades Avançadas:**
- ✅ **Edição inline** - clique no ícone de editar
- ✅ **Paginação** - 5 tarefas por página
- ✅ **Exclusão direta** - sem confirmação
- ✅ **Novas tarefas no topo** da lista
- ✅ **Persistência local** (localStorage)

## Estrutura do Projeto

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

## Tecnologias Utilizadas

- **TypeScript** - Linguagem principal com tipos explícitos
- **HTML5** - Estrutura da página
- **CSS3** - Estilos e animações
- **Bootstrap 5** - Framework CSS
- **localStorage** - Persistência de dados
- **ES6 Modules** - Sistema de módulos

## Principais Funções e Classes

### **1. Interface Task (src/types.ts):**
```typescript
export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
}
```

### **2. Classe TaskStorage (src/storage.ts):**
Responsável pelo gerenciamento de dados no localStorage:

**Recuperar tarefas:**
```typescript
static getAllTasks(): Task[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}
```

**Adicionar nova tarefa:**
```typescript
static addTask(title: string, description: string): Task {
    const newTask: Task = {
        id: crypto.randomUUID(),
        title, description,
        completed: false,
        createdAt: new Date()
    };
    tasks.unshift(newTask); // Adiciona no topo
    return newTask;
}
```

**Excluir tarefa:**
```typescript
static deleteTask(taskId: string): boolean {
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    this.saveTasks(filteredTasks);
    return true;
}
```

### **3. Classe TaskUI (src/ui.ts):**
Gerencia a interface do usuário e interações:

**Renderizar lista de tarefas:**
```typescript
renderTasks(tasks: Task[]): void {
    const startIndex = (this.currentPage - 1) * this.tasksPerPage;
    const currentTasks = tasks.slice(startIndex, endIndex);
    this.taskList.innerHTML = currentTasks.map(task => this.createTaskElement(task)).join('');
}
```

**Criar elemento de tarefa:**
```typescript
private createTaskElement(task: Task): string {
    return `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-title">${task.title}</span>
            <button class="edit-btn" data-task-id="${task.id}">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="delete-btn" data-task-id="${task.id}">
                <i class="bi bi-trash"></i>
            </button>
        </li>
    `;
}
```

**Atualizar contador:**
```typescript
updatePendingCount(count: number): void {
    this.pendingCount.innerHTML = `Tarefas pendentes: ${count}`;
}
```

### **4. Classe TodoApp (src/app.ts):**
Orquestra toda a aplicação e coordena as classes:

**Adicionar tarefa:**
```typescript
private addTask(title: string, description: string): void {
    if (!title.trim()) return;
    const newTask = TaskStorage.addTask(title, description);
    this.tasks.unshift(newTask); // Adiciona no topo
    this.render();
}
```

**Excluir tarefa:**
```typescript
private deleteTask(taskId: string): void {
    const deleted = TaskStorage.deleteTask(taskId);
    if (deleted) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.render();
    }
}
```

**Renderizar interface:**
```typescript
private render(): void {
    this.ui.renderTasks(this.tasks);
    this.ui.updatePendingCount(this.getPendingCount());
}
```

### **5. Sistema de Eventos Personalizados:**
```typescript
// Eventos customizados para comunicação entre classes
document.dispatchEvent(new CustomEvent('addTask', { 
    detail: { title, description } 
}));

document.dispatchEvent(new CustomEvent('deleteTask', { 
    detail: { taskId } 
}));
```

### **6. Funcionalidades Avançadas:**

#### **🔄 Edição Inline:**
**Criar campos de edição:**
```typescript
const titleInput = document.createElement('input');
titleInput.value = currentTitle;
titleInput.placeholder = 'Título da tarefa';

const descriptionTextarea = document.createElement('textarea');
descriptionTextarea.value = currentDescription;
```

**Validação em tempo real:**
```typescript
titleInput.addEventListener('input', () => {
    if (titleInput.value.trim()) {
        titleInput.style.borderColor = '#ff69b4';
    } else {
        titleInput.style.borderColor = '#dc3545';
    }
});
```

#### **📄 Paginação Inteligente:**
**Calcular páginas:**
```typescript
const startIndex = (this.currentPage - 1) * this.tasksPerPage;
const endIndex = startIndex + this.tasksPerPage;
const currentTasks = tasks.slice(startIndex, endIndex);
```

**Criar botões de navegação:**
```typescript
for (let i = startPage; i <= endPage; i++) {
    const active = i === this.currentPage ? 'active' : '';
    paginationHTML += `
        <li class="page-item ${active}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
    `;
}
```

#### **⚡ Validação em Tempo Real:**
**Verificar campo obrigatório:**
```typescript
if (!newTitle) {
    titleInput.style.borderColor = '#dc3545';
    titleInput.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
    titleInput.focus();
    return;
}
```

**Feedback de loading:**
```typescript
saveBtn.classList.add('loading');
saveBtn.innerHTML = '<i class="bi bi-hourglass-split"></i>';
saveBtn.disabled = true;
```

#### **🎨 Animações e Transições:**
```css
/* styles.css - Animações CSS */
.task-item {
    transition: all 0.3s ease;
}

.task-item.completed {
    opacity: 0.6;
    text-decoration: line-through;
}

.edit-container {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
```

#### **📱 Responsividade Completa:**
```html
<!-- index.html - Layout responsivo -->
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
            <!-- Conteúdo se adapta automaticamente -->
        </div>
    </div>
</div>
```

#### **💾 Persistência Inteligente:**
**Salvar no localStorage:**
```typescript
static saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
}
```

**Recuperar do localStorage:**
```typescript
static getAllTasks(): Task[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}
```

**Criar nova tarefa:**
```typescript
const newTask: Task = {
    id: crypto.randomUUID(),
    title, description,
    completed: false,
    createdAt: new Date()
};
tasks.unshift(newTask); // Adiciona no topo
```

#### **🔄 Sistema de Eventos Personalizados:**
**Escutar eventos:**
```typescript
document.addEventListener('addTask', ((e: CustomEvent) => {
    this.addTask(e.detail.title, e.detail.description);
}) as EventListener);
```

**Disparar eventos:**
```typescript
document.dispatchEvent(new CustomEvent('addTask', { 
    detail: { title, description } 
}));

document.dispatchEvent(new CustomEvent('deleteTask', { 
    detail: { taskId } 
}));
```

## Como executar

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
2. A tarefa é removida imediatamente da lista

### **Navegar entre Páginas:**
1. Use os botões numerados
2. Use "Anterior" e "Próximo"
3. A página atual fica destacada
