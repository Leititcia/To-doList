import { Task } from './types.js';
import { TaskStorage } from './storage.js';
import { TaskUI } from './ui.js';

// Classe principal da aplicação
export class TodoApp {
    private ui: TaskUI;           // Interface do usuário
    private tasks: Task[] = [];   // Lista de tarefas em memória

  
  // Construtor da aplicação, inicializa a interface, carrega tarefas e configura eventos
    constructor() {
        this.ui = new TaskUI();   // Cria instância da interface
        this.loadTasks();         // Carrega tarefas do localStorage
        this.bindEvents();        // Configura listeners de eventos
        this.render();            // Renderiza a interface inicial
    }

    // Carrega todas as tarefas do localStorage para a memória
    private loadTasks(): void {
        this.tasks = TaskStorage.getAllTasks();
        console.log('Tarefas carregadas:', this.tasks);
    }

    // Configura todos os event listeners para comunicação entre componentes
    private bindEvents(): void {
        // Evento para adicionar nova tarefa
        document.addEventListener('addTask', ((e: CustomEvent) => {
            console.log('Evento addTask recebido:', e.detail);
            this.addTask(e.detail.title, e.detail.description);
        }) as EventListener);

        // Evento para alternar status de conclusão
        document.addEventListener('toggleTask', ((e: CustomEvent) => {
            console.log('Evento toggleTask recebido:', e.detail);
            this.toggleTask(e.detail.taskId, e.detail.completed);
        }) as EventListener);

        // Evento para deletar tarefa
        document.addEventListener('deleteTask', ((e: CustomEvent) => {
            console.log('Evento deleteTask recebido:', e.detail);
            this.deleteTask(e.detail.taskId);
        }) as EventListener);

        // Evento para editar tarefa
        document.addEventListener('editTask', ((e: CustomEvent) => {
            console.log('Evento editTask recebido:', e.detail);
            this.editTask(e.detail.taskId, e.detail.title, e.detail.description);
        }) as EventListener);

        // Evento para mudança de página
        document.addEventListener('pageChange', ((e: CustomEvent) => {
            console.log('Evento pageChange recebido:', e.detail);
            this.render();
        }) as EventListener);
    }

    // Adiciona uma nova tarefa à lista
    private addTask(title: string, description: string): void {
        if (!title.trim()) return; // Valida se o título não está vazio

        try {
            const newTask = TaskStorage.addTask(title, description);
            this.tasks.unshift(newTask); // Adiciona no início da lista
            this.render();               // Atualiza a interface
            console.log('Tarefa adicionada no topo:', newTask);
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    }

    // Alterna o status de conclusão de uma tarefa
    private toggleTask(taskId: string, completed: boolean): void {
        try {
            const updatedTask = TaskStorage.updateTask(taskId, completed);
            if (updatedTask) {
                // Atualiza a tarefa na lista em memória
                const taskIndex = this.tasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    this.tasks[taskIndex] = updatedTask;
                }
                this.render(); // Atualiza a interface
                console.log('Tarefa atualizada:', updatedTask);
            }
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    }

    // Edita uma tarefa existente
    private editTask(taskId: string, title: string, description: string): void {
        try {
            const updatedTask = TaskStorage.editTask(taskId, title, description);
            if (updatedTask) {
                // Atualiza a tarefa na lista em memória
                const taskIndex = this.tasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    this.tasks[taskIndex] = updatedTask;
                }
                this.render(); // Atualiza a interface
                console.log('Tarefa editada:', updatedTask);
            }
        } catch (error) {
            console.error('Erro ao editar tarefa:', error);
        }
    }

    // Remove uma tarefa da lista
    private deleteTask(taskId: string): void {
        try {
            console.log('Tentando deletar tarefa com ID:', taskId);
            console.log('Tarefas antes da deleção:', this.tasks);
            
            const deleted = TaskStorage.deleteTask(taskId);
            console.log('Resultado da deleção:', deleted);
            
            if (deleted) {
                // Remove a tarefa da lista em memória
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.render(); // Atualiza a interface
                console.log('Tarefas após a deleção:', this.tasks);
            } else {
                console.log('Tarefa não foi encontrada para deletar');
            }
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    }

    // Calcula o número de tarefas pendentes (não concluídas)
    private getPendingCount(): number {
        return this.tasks.filter(task => !task.completed).length;
    }

    // Renderiza toda a interface da aplicação
    private render(): void {
        this.ui.renderTasks(this.tasks);           // Renderiza lista de tarefas
        this.ui.updatePendingCount(this.getPendingCount()); // Atualiza contador
        console.log('Interface renderizada com', this.tasks.length, 'tarefas');
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Aplicação inicializada');
    new TodoApp(); // Cria nova instância da aplicação
}); 
