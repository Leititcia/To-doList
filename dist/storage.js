const STORAGE_KEY = 'simple-todo-tasks';
export class TaskStorage {
    static getTasksFromStorage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored)
            return [];
        try {
            return JSON.parse(stored);
        }
        catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            return [];
        }
    }
    static saveTasksToStorage(tasks) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }
        catch (error) {
            console.error('Erro ao salvar tarefas:', error);
        }
    }
    static getAllTasks() {
        return this.getTasksFromStorage();
    }
    static addTask(title, description) {
        const tasks = this.getTasksFromStorage();
        const newTask = {
            id: this.generateId(),
            title: title.trim(),
            description: description.trim(),
            completed: false
        };
        tasks.unshift(newTask);
        this.saveTasksToStorage(tasks);
        return newTask;
    }
    static updateTask(id, completed) {
        const tasks = this.getTasksFromStorage();
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex === -1)
            return null;
        tasks[taskIndex].completed = completed;
        this.saveTasksToStorage(tasks);
        return tasks[taskIndex];
    }
    static editTask(id, title, description) {
        const tasks = this.getTasksFromStorage();
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex === -1)
            return null;
        tasks[taskIndex].title = title.trim();
        tasks[taskIndex].description = description.trim();
        this.saveTasksToStorage(tasks);
        return tasks[taskIndex];
    }
    static deleteTask(id) {
        const tasks = this.getTasksFromStorage();
        const filteredTasks = tasks.filter(task => task.id !== id);
        if (filteredTasks.length === tasks.length)
            return false;
        this.saveTasksToStorage(filteredTasks);
        return true;
    }
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
