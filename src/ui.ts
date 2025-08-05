import { Task } from './types.js';

export class TaskUI {
    private taskList: HTMLElement;
    private taskTitle: HTMLInputElement;
    private taskDescription: HTMLTextAreaElement;
    private addTaskBtn: HTMLButtonElement;
    private pendingCount: HTMLElement;
    private deleteModal: any;
    private confirmDeleteBtn: HTMLButtonElement;
    private taskTextToDelete: HTMLElement;
    private currentTaskIdToDelete: string | null = null;
    private pagination: HTMLElement;
    private currentPage: number = 1;
    private tasksPerPage: number = 5;
    private editingTaskId: string | null = null;

    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    private initializeElements(): void {
        this.taskList = document.getElementById('taskList') as HTMLElement;
        this.taskTitle = document.getElementById('taskTitle') as HTMLInputElement;
        this.taskDescription = document.getElementById('taskDescription') as HTMLTextAreaElement;
        this.addTaskBtn = document.getElementById('addTaskBtn') as HTMLButtonElement;
        this.pendingCount = document.getElementById('pendingCount') as HTMLElement;
        this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn') as HTMLButtonElement;
        this.taskTextToDelete = document.getElementById('taskTextToDelete') as HTMLElement;
        this.pagination = document.getElementById('pagination') as HTMLElement;
        
        // Inicializar o modal do Bootstrap
        const modalElement = document.getElementById('deleteConfirmModal') as HTMLElement;
        this.deleteModal = new (window as any).bootstrap.Modal(modalElement);
    }

    private bindEvents(): void {
        this.addTaskBtn.addEventListener('click', () => this.handleAddTask());
        this.taskTitle.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleAddTask();
            }
        });

        // Delegação de eventos para a lista de tarefas
        this.taskList.addEventListener('click', (e) => this.handleTaskListClick(e));
        this.taskList.addEventListener('change', (e) => this.handleTaskListChange(e));
        this.taskList.addEventListener('dblclick', (e) => this.handleTaskListDoubleClick(e));

        // Evento de confirmação de exclusão
        this.confirmDeleteBtn.addEventListener('click', () => this.handleConfirmDelete());

        // Evento de paginação
        this.pagination.addEventListener('click', (e) => this.handlePaginationClick(e));

        // Eventos de teclado para edição
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    private handleAddTask(): void {
        const title = this.taskTitle.value.trim();
        const description = this.taskDescription.value.trim();
        
        if (!title) return;

        const event = new CustomEvent('addTask', { detail: { title, description } });
        document.dispatchEvent(event);
        
        this.taskTitle.value = '';
        this.taskDescription.value = '';
        this.taskTitle.focus();
    }

    private handleTaskListClick(e: Event): void {
        const target = e.target as HTMLElement;
        
        // Verificar se clicou no botão de deletar ou no ícone
        const deleteBtn = target.closest('.delete-btn') as HTMLButtonElement;
        if (deleteBtn) {
            e.preventDefault();
            const taskId = deleteBtn.getAttribute('data-task-id')!;
            const taskTitle = deleteBtn.closest('.task-item')?.querySelector('.task-title')?.textContent || '';
            
            this.showDeleteConfirmation(taskId, taskTitle);
        }
    }

    private handleTaskListDoubleClick(e: Event): void {
        const target = e.target as HTMLElement;
        const taskTitle = target.closest('.task-title') as HTMLElement;
        
        if (taskTitle && !this.editingTaskId) {
            const taskItem = taskTitle.closest('.task-item') as HTMLElement;
            const taskId = taskItem.getAttribute('data-task-id')!;
            const currentTitle = taskTitle.textContent || '';
            const currentDescription = taskItem.querySelector('.task-description')?.textContent || '';
            
            this.startEditing(taskId, currentTitle, currentDescription, taskTitle);
        }
    }

    private startEditing(taskId: string, currentTitle: string, currentDescription: string, titleElement: HTMLElement): void {
        this.editingTaskId = taskId;
        
        const taskItem = titleElement.closest('.task-item') as HTMLElement;
        const descriptionElement = taskItem.querySelector('.task-description') as HTMLElement;
        
        // Criar container de edição
        const editContainer = document.createElement('div');
        editContainer.className = 'edit-container';
        editContainer.style.cssText = `
            flex: 1;
            margin-right: 0.5rem;
        `;

        // Criar input de título
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.className = 'edit-title-input';
        titleInput.value = currentTitle;
        titleInput.style.cssText = `
            width: 100%;
            font-size: 1rem;
            border: 2px solid #ff69b4;
            border-radius: 6px;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            outline: none;
            background: #fff;
            color: #333;
            font-weight: 500;
        `;

        // Criar textarea de descrição
        const descriptionTextarea = document.createElement('textarea');
        descriptionTextarea.className = 'edit-description-input';
        descriptionTextarea.value = currentDescription;
        descriptionTextarea.rows = 2;
        descriptionTextarea.style.cssText = `
            width: 100%;
            font-size: 0.875rem;
            border: 2px solid #ffb6c1;
            border-radius: 6px;
            padding: 0.5rem;
            outline: none;
            background: #fff;
            color: #666;
            resize: vertical;
        `;

        editContainer.appendChild(titleInput);
        editContainer.appendChild(descriptionTextarea);

        // Substituir os elementos pelo container de edição
        titleElement.style.display = 'none';
        if (descriptionElement) descriptionElement.style.display = 'none';
        titleElement.parentNode?.insertBefore(editContainer, titleElement);
        
        // Focar no input de título
        titleInput.focus();
        titleInput.select();

        // Eventos do container de edição
        const handleSave = () => {
            const newTitle = titleInput.value.trim();
            const newDescription = descriptionTextarea.value.trim();
            
            if (newTitle && (newTitle !== currentTitle || newDescription !== currentDescription)) {
                const event = new CustomEvent('editTask', { 
                    detail: { taskId, title: newTitle, description: newDescription } 
                });
                document.dispatchEvent(event);
            }
            this.stopEditing();
        };

        const handleCancel = () => {
            this.stopEditing();
        };

        titleInput.addEventListener('blur', handleSave);
        titleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
            }
        });

        descriptionTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
            }
        });
    }

    private stopEditing(): void {
        const editContainer = this.taskList.querySelector('.edit-container') as HTMLElement;
        const hiddenTitle = this.taskList.querySelector('.task-title[style*="display: none"]') as HTMLElement;
        const hiddenDescription = this.taskList.querySelector('.task-description[style*="display: none"]') as HTMLElement;
        
        if (editContainer) {
            editContainer.remove();
        }
        
        if (hiddenTitle) {
            hiddenTitle.style.display = '';
        }
        
        if (hiddenDescription) {
            hiddenDescription.style.display = '';
        }
        
        this.editingTaskId = null;
    }

    private handleKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Escape' && this.editingTaskId) {
            this.stopEditing();
        }
    }

    private handleTaskListChange(e: Event): void {
        const target = e.target as HTMLInputElement;
        
        if (target.classList.contains('task-checkbox')) {
            const taskId = target.getAttribute('data-task-id')!;
            const completed = target.checked;
            
            const event = new CustomEvent('toggleTask', { 
                detail: { taskId, completed } 
            });
            document.dispatchEvent(event);
        }
    }

    private handlePaginationClick(e: Event): void {
        const target = e.target as HTMLElement;
        const pageLink = target.closest('.page-link') as HTMLAnchorElement;
        
        if (pageLink && !pageLink.parentElement?.classList.contains('disabled')) {
            e.preventDefault();
            const page = parseInt(pageLink.getAttribute('data-page') || '1');
            this.currentPage = page;
            
            const event = new CustomEvent('pageChange', { 
                detail: { page } 
            });
            document.dispatchEvent(event);
        }
    }

    private showDeleteConfirmation(taskId: string, taskTitle: string): void {
        this.currentTaskIdToDelete = taskId;
        this.taskTextToDelete.textContent = `"${taskTitle}"`;
        this.deleteModal.show();
    }

    private handleConfirmDelete(): void {
        if (this.currentTaskIdToDelete) {
            const event = new CustomEvent('deleteTask', { 
                detail: { taskId: this.currentTaskIdToDelete } 
            });
            document.dispatchEvent(event);
            
            this.deleteModal.hide();
            this.currentTaskIdToDelete = null;
        }
    }

    renderTasks(tasks: Task[]): void {
        if (tasks.length === 0) {
            this.taskList.innerHTML = `
                <div class="empty-state">
                    <h3><i class="bi bi-list-check"></i> Nenhuma tarefa encontrada</h3>
                    <p>Adicione uma nova tarefa para começar!</p>
                </div>
            `;
            this.pagination.innerHTML = '';
            return;
        }

        // Calcular paginação
        const totalPages = Math.ceil(tasks.length / this.tasksPerPage);
        const startIndex = (this.currentPage - 1) * this.tasksPerPage;
        const endIndex = startIndex + this.tasksPerPage;
        const currentTasks = tasks.slice(startIndex, endIndex);

        // Renderizar tarefas da página atual
        this.taskList.innerHTML = currentTasks.map(task => this.createTaskElement(task)).join('');
        
        // Renderizar paginação
        this.renderPagination(totalPages);
    }

    private renderPagination(totalPages: number): void {
        if (totalPages <= 1) {
            this.pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Botão Anterior
        const prevDisabled = this.currentPage === 1 ? 'disabled' : '';
        paginationHTML += `
            <li class="page-item ${prevDisabled}">
                <a class="page-link" href="#" data-page="${this.currentPage - 1}" aria-label="Anterior">
                    <i class="bi bi-chevron-left"></i>
                </a>
            </li>
        `;

        // Páginas numeradas
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const active = i === this.currentPage ? 'active' : '';
            paginationHTML += `
                <li class="page-item ${active}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        // Botão Próximo
        const nextDisabled = this.currentPage === totalPages ? 'disabled' : '';
        paginationHTML += `
            <li class="page-item ${nextDisabled}">
                <a class="page-link" href="#" data-page="${this.currentPage + 1}" aria-label="Próximo">
                    <i class="bi bi-chevron-right"></i>
                </a>
            </li>
        `;

        this.pagination.innerHTML = paginationHTML;
    }

    private createTaskElement(task: Task): string {
        const descriptionHtml = task.description ? `
            <div class="task-description">${this.escapeHtml(task.description)}</div>
        ` : '';
        
        return `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    data-task-id="${task.id}"
                >
                <div class="task-content">
                    <span class="task-title" title="Clique duas vezes para editar">${this.escapeHtml(task.title)}</span>
                    ${descriptionHtml}
                </div>
                <button class="delete-btn" data-task-id="${task.id}" title="Excluir tarefa">
                    <i class="bi bi-trash"></i>
                </button>
            </li>
        `;
    }

    updatePendingCount(count: number): void {
        this.pendingCount.innerHTML = `<i class="bi bi-clock"></i> Tarefas pendentes: ${count}`;
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
} 