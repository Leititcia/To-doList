import { Task } from './types.js';
import { TaskStorage } from './storage.js';
import { TaskUI } from './ui.js';

export class TodoApp {
    private ui: TaskUI;
    private tasks: Task[] = [];

    constructor() {
        this.ui = new TaskUI();
        this.loadTasks();
        this.bindEvents();
        this.render();
    }

    private loadTasks(): void {
        this.tasks = TaskStorage.getAllTasks();
        console.log('Tarefas carregadas:', this.tasks);
    }

    private bindEvents(): void {
        document.addEventListener('addTask', ((e: CustomEvent) => {
            console.log('Evento addTask recebido:', e.detail);
            this.addTask(e.detail.title, e.detail.description);
        }) as EventListener);

        document.addEventListener('toggleTask', ((e: CustomEvent) => {
            console.log('Evento toggleTask recebido:', e.detail);
            this.toggleTask(e.detail.taskId, e.detail.completed);
        }) as EventListener);

        document.addEventListener('deleteTask', ((e: CustomEvent) => {
            console.log('Evento deleteTask recebido:', e.detail);
            this.deleteTask(e.detail.taskId);
        }) as EventListener);

        document.addEventListener('editTask', ((e: CustomEvent) => {
            console.log('Evento editTask recebido:', e.detail);
            this.editTask(e.detail.taskId, e.detail.title, e.detail.description);
        }) as EventListener);

        document.addEventListener('pageChange', ((e: CustomEvent) => {
            console.log('Evento pageChange recebido:', e.detail);
            this.render();
        }) as EventListener);
    }

    private addTask(title: string, description: string): void {
        if (!title.trim()) return;

        try {
            const newTask = TaskStorage.addTask(title, description);
            this.tasks.unshift(newTask);
            this.render();
            console.log('Tarefa adicionada no topo:', newTask);
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    }

    private toggleTask(taskId: string, completed: boolean): void {
        try {
            const updatedTask = TaskStorage.updateTask(taskId, completed);
            if (updatedTask) {
                const taskIndex = this.tasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    this.tasks[taskIndex] = updatedTask;
                }
                this.render();
                console.log('Tarefa atualizada:', updatedTask);
            }
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    }

    private editTask(taskId: string, title: string, description: string): void {
        try {
            const updatedTask = TaskStorage.editTask(taskId, title, description);
            if (updatedTask) {
                const taskIndex = this.tasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    this.tasks[taskIndex] = updatedTask;
                }
                this.render();
                console.log('Tarefa editada:', updatedTask);
            }
        } catch (error) {
            console.error('Erro ao editar tarefa:', error);
        }
    }

    private deleteTask(taskId: string): void {
        try {
            console.log('Tentando deletar tarefa com ID:', taskId);
            console.log('Tarefas antes da deleção:', this.tasks);
            
            const deleted = TaskStorage.deleteTask(taskId);
            console.log('Resultado da deleção:', deleted);
            
            if (deleted) {
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.render();
                console.log('Tarefas após a deleção:', this.tasks);
            } else {
                console.log('Tarefa não foi encontrada para deletar');
            }
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    }

    private getPendingCount(): number {
        return this.tasks.filter(task => !task.completed).length;
    }

    private render(): void {
        this.ui.renderTasks(this.tasks);
        this.ui.updatePendingCount(this.getPendingCount());
        console.log('Interface renderizada com', this.tasks.length, 'tarefas');
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Aplicação inicializada');
    new TodoApp();
}); 