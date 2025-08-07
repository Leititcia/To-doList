# To-Do List - TypeScript

Aplicação de lista de tarefas desenvolvida em TypeScript puro.

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
```typescript
export class TaskStorage {
    private static STORAGE_KEY = 'todo_tasks';
    
    static getAllTasks(): Task[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    
    static addTask(title: string, description: string): Task {
        const tasks = this.getAllTasks();
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            description,
            completed: false,
            createdAt: new Date()
        };
        tasks.unshift(newTask);
        this.saveTasks(tasks);
        return newTask;
    }
    
    static deleteTask(taskId: string): boolean {
        const tasks = this.getAllTasks();
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        if (filteredTasks.length !== tasks.length) {
            this.saveTasks(filteredTasks);
            return true;
        }
        return false;
    }
}
```

### **3. Classe TaskUI (src/ui.ts):**
Gerencia a interface do usuário e interações:
```typescript
export class TaskUI {
    private taskList!: HTMLElement;
    private currentPage: number = 1;
    private tasksPerPage: number = 5;

    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    renderTasks(tasks: Task[]): void {
        if (tasks.length === 0) {
            this.taskList.innerHTML = `
                <div class="empty-state">
                    <h3><i class="bi bi-list-check"></i> Nenhuma tarefa encontrada</h3>
                </div>
            `;
            return;
        }

        // Paginação
        const startIndex = (this.currentPage - 1) * this.tasksPerPage;
        const endIndex = startIndex + this.tasksPerPage;
        const currentTasks = tasks.slice(startIndex, endIndex);

        this.taskList.innerHTML = currentTasks.map(task => this.createTaskElement(task)).join('');
    }

    private createTaskElement(task: Task): string {
        return `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <span class="task-title">${this.escapeHtml(task.title)}</span>
                    <div class="task-description">${this.escapeHtml(task.description)}</div>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" data-task-id="${task.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="delete-btn" data-task-id="${task.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </li>
        `;
    }
}
```

### **4. Classe TodoApp (src/app.ts):**
Orquestra toda a aplicação e coordena as classes:
```typescript
export class TodoApp {
    private ui: TaskUI;
    private tasks: Task[] = [];

    constructor() {
        this.ui = new TaskUI();
        this.loadTasks();
        this.bindEvents();
        this.render();
    }

    private addTask(title: string, description: string): void {
        if (!title.trim()) return;
        
        const newTask = TaskStorage.addTask(title, description);
        this.tasks.unshift(newTask); // Adiciona no topo
        this.render();
    }

    private deleteTask(taskId: string): void {
        const deleted = TaskStorage.deleteTask(taskId);
        if (deleted) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.render();
        }
    }

    private render(): void {
        this.ui.renderTasks(this.tasks);
        this.ui.updatePendingCount(this.getPendingCount());
    }
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
```typescript
// src/ui.ts - Início da edição inline
private startEditing(taskId: string, currentTitle: string, currentDescription: string): void {
    // Criar campos de edição dinamicamente
    const titleInput = document.createElement('input');
    titleInput.value = currentTitle;
    titleInput.placeholder = 'Título da tarefa';
    
    const descriptionTextarea = document.createElement('textarea');
    descriptionTextarea.value = currentDescription;
    descriptionTextarea.placeholder = 'Descrição da tarefa (opcional)';
    
    // Validação em tempo real
    titleInput.addEventListener('input', () => {
        if (titleInput.value.trim()) {
            titleInput.style.borderColor = '#ff69b4';
        } else {
            titleInput.style.borderColor = '#dc3545';
        }
    });
}
```

#### **📄 Paginação Inteligente:**
```typescript
// src/ui.ts - Sistema de paginação
private renderPagination(totalPages: number): void {
    const startIndex = (this.currentPage - 1) * this.tasksPerPage;
    const endIndex = startIndex + this.tasksPerPage;
    const currentTasks = tasks.slice(startIndex, endIndex);
    
    // Renderizar botões de navegação
    let paginationHTML = '';
    for (let i = startPage; i <= endPage; i++) {
        const active = i === this.currentPage ? 'active' : '';
        paginationHTML += `
            <li class="page-item ${active}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
}
```

#### **⚡ Validação em Tempo Real:**
```typescript
// src/ui.ts - Validação durante edição
const handleSave = async () => {
    const newTitle = titleInput.value.trim();
    
    if (!newTitle) {
        // Destacar campo vazio
        titleInput.style.borderColor = '#dc3545';
        titleInput.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
        titleInput.focus();
        return;
    }
    
    // Feedback visual de loading
    saveBtn.classList.add('loading');
    saveBtn.innerHTML = '<i class="bi bi-hourglass-split"></i>';
    saveBtn.disabled = true;
};
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
```typescript
// src/storage.ts - Gerenciamento de localStorage
export class TaskStorage {
    private static STORAGE_KEY = 'todo_tasks';
    
    static getAllTasks(): Task[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    
    static saveTasks(tasks: Task[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }
    
    static addTask(title: string, description: string): Task {
        const tasks = this.getAllTasks();
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            description,
            completed: false,
            createdAt: new Date()
        };
        
        tasks.unshift(newTask); // Adiciona no topo
        this.saveTasks(tasks);
        return newTask;
    }
}
```

#### **🔄 Sistema de Eventos Personalizados:**
```typescript
// src/app.ts - Comunicação entre componentes
private bindEvents(): void {
    document.addEventListener('addTask', ((e: CustomEvent) => {
        this.addTask(e.detail.title, e.detail.description);
    }) as EventListener);
    
    document.addEventListener('deleteTask', ((e: CustomEvent) => {
        this.deleteTask(e.detail.taskId);
    }) as EventListener);
    
    document.addEventListener('editTask', ((e: CustomEvent) => {
        this.editTask(e.detail.taskId, e.detail.title, e.detail.description);
    }) as EventListener);
}
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
