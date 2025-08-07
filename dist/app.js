import { TaskStorage } from './storage.js';
import { TaskUI } from './ui.js';
export class TodoApp {
    constructor() {
        this.tasks = [];
        this.ui = new TaskUI();
        this.loadTasks();
        this.bindEvents();
        this.render();
    }
    loadTasks() {
        this.tasks = TaskStorage.getAllTasks();
        console.log('Tarefas carregadas:', this.tasks);
    }
    bindEvents() {
        document.addEventListener('addTask', ((e) => {
            console.log('Evento addTask recebido:', e.detail);
            this.addTask(e.detail.title, e.detail.description);
        }));
        document.addEventListener('toggleTask', ((e) => {
            console.log('Evento toggleTask recebido:', e.detail);
            this.toggleTask(e.detail.taskId, e.detail.completed);
        }));
        document.addEventListener('deleteTask', ((e) => {
            console.log('Evento deleteTask recebido:', e.detail);
            this.deleteTask(e.detail.taskId);
        }));
        document.addEventListener('editTask', ((e) => {
            console.log('Evento editTask recebido:', e.detail);
            this.editTask(e.detail.taskId, e.detail.title, e.detail.description);
        }));
        document.addEventListener('pageChange', ((e) => {
            console.log('Evento pageChange recebido:', e.detail);
            this.render();
        }));
    }
    addTask(title, description) {
        if (!title.trim())
            return;
        try {
            const newTask = TaskStorage.addTask(title, description);
            this.tasks.unshift(newTask);
            this.render();
            console.log('Tarefa adicionada no topo:', newTask);
        }
        catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    }
    toggleTask(taskId, completed) {
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
        }
        catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    }
    editTask(taskId, title, description) {
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
        }
        catch (error) {
            console.error('Erro ao editar tarefa:', error);
        }
    }
    deleteTask(taskId) {
        try {
            console.log('Tentando deletar tarefa com ID:', taskId);
            console.log('Tarefas antes da deleção:', this.tasks);
            const deleted = TaskStorage.deleteTask(taskId);
            console.log('Resultado da deleção:', deleted);
            if (deleted) {
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.render();
                console.log('Tarefas após a deleção:', this.tasks);
            }
            else {
                console.log('Tarefa não foi encontrada para deletar');
            }
        }
        catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    }
    getPendingCount() {
        return this.tasks.filter(task => !task.completed).length;
    }
    render() {
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
