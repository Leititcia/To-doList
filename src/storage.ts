import { Task } from './types.js';

const STORAGE_KEY = 'simple-todo-tasks';

export class TaskStorage {
    private static getTasksFromStorage(): Task[] {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        
        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            return [];
        }
    }

    private static saveTasksToStorage(tasks: Task[]): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error('Erro ao salvar tarefas:', error);
        }
    }

    static getAllTasks(): Task[] {
        return this.getTasksFromStorage();
    }

    static addTask(title: string, description: string): Task {
        const tasks = this.getTasksFromStorage();
        const newTask: Task = {
            id: this.generateId(),
            title: title.trim(),
            description: description.trim(),
            completed: false
        };
        
        tasks.unshift(newTask);
        this.saveTasksToStorage(tasks);
        return newTask;
    }

    static updateTask(id: string, completed: boolean): Task | null {
        const tasks = this.getTasksFromStorage();
        const taskIndex = tasks.findIndex(task => task.id === id);
        
        if (taskIndex === -1) return null;
        
        tasks[taskIndex].completed = completed;
        this.saveTasksToStorage(tasks);
        return tasks[taskIndex];
    }

    static editTask(id: string, title: string, description: string): Task | null {
        const tasks = this.getTasksFromStorage();
        const taskIndex = tasks.findIndex(task => task.id === id);
        
        if (taskIndex === -1) return null;
        
        tasks[taskIndex].title = title.trim();
        tasks[taskIndex].description = description.trim();
        this.saveTasksToStorage(tasks);
        return tasks[taskIndex];
    }

    static deleteTask(id: string): boolean {
        const tasks = this.getTasksFromStorage();
        const filteredTasks = tasks.filter(task => task.id !== id);
        
        if (filteredTasks.length === tasks.length) return false;
        
        this.saveTasksToStorage(filteredTasks);
        return true;
    }

    private static generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
} 