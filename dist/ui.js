export class TaskUI {
    constructor() {
        this.currentPage = 1;
        this.tasksPerPage = 5;
        this.editingTaskId = null;
        this.initializeElements();
        this.bindEvents();
    }
    initializeElements() {
        this.taskList = document.getElementById('taskList');
        this.taskTitle = document.getElementById('taskTitle');
        this.taskDescription = document.getElementById('taskDescription');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.pendingCount = document.getElementById('pendingCount');
        this.pagination = document.getElementById('pagination');
    }
    bindEvents() {
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
        // Evento de paginação
        this.pagination.addEventListener('click', (e) => this.handlePaginationClick(e));
        // Eventos de teclado para edição
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    handleAddTask() {
        const title = this.taskTitle.value.trim();
        const description = this.taskDescription.value.trim();
        if (!title)
            return;
        const event = new CustomEvent('addTask', { detail: { title, description } });
        document.dispatchEvent(event);
        this.taskTitle.value = '';
        this.taskDescription.value = '';
        this.taskTitle.focus();
    }
    handleTaskListClick(e) {
        const target = e.target;
        // Verificar se clicou no botão de editar
        const editBtn = target.closest('.edit-btn');
        if (editBtn) {
            e.preventDefault();
            const taskId = editBtn.getAttribute('data-task-id');
            const taskItem = editBtn.closest('.task-item');
            const taskTitle = taskItem.querySelector('.task-title');
            const currentTitle = taskTitle.textContent || '';
            const currentDescription = taskItem.querySelector('.task-description')?.textContent || '';
            this.startEditing(taskId, currentTitle, currentDescription, taskTitle);
            return;
        }
        // Verificar se clicou no botão de deletar ou no ícone
        const deleteBtn = target.closest('.delete-btn');
        if (deleteBtn) {
            e.preventDefault();
            const taskId = deleteBtn.getAttribute('data-task-id');
            // Deletar diretamente sem confirmação
            const event = new CustomEvent('deleteTask', {
                detail: { taskId }
            });
            document.dispatchEvent(event);
        }
    }
    startEditing(taskId, currentTitle, currentDescription, titleElement) {
        this.editingTaskId = taskId;
        const taskItem = titleElement.closest('.task-item');
        const descriptionElement = taskItem.querySelector('.task-description');
        // Adicionar classe de edição ao item
        taskItem.classList.add('editing');
        // Criar container de edição
        const editContainer = document.createElement('div');
        editContainer.className = 'edit-container';
        // Criar input de título
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.className = 'edit-title-input';
        titleInput.value = currentTitle;
        titleInput.placeholder = 'Título da tarefa';
        // Criar textarea de descrição
        const descriptionTextarea = document.createElement('textarea');
        descriptionTextarea.className = 'edit-description-input';
        descriptionTextarea.value = currentDescription;
        descriptionTextarea.placeholder = 'Descrição da tarefa (opcional)';
        descriptionTextarea.rows = 3;
        // Criar container de botões
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'edit-buttons';
        buttonContainer.style.cssText = `
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
        `;
        // Botão Salvar
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-save';
        saveBtn.innerHTML = '<i class="bi bi-check-circle"></i>';
        saveBtn.setAttribute('type', 'button');
        saveBtn.title = 'Salvar';
        // Botão Cancelar
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-cancel';
        cancelBtn.innerHTML = '<i class="bi bi-x-circle"></i>';
        cancelBtn.setAttribute('type', 'button');
        cancelBtn.title = 'Cancelar';
        buttonContainer.appendChild(saveBtn);
        buttonContainer.appendChild(cancelBtn);
        editContainer.appendChild(titleInput);
        editContainer.appendChild(descriptionTextarea);
        editContainer.appendChild(buttonContainer);
        // Substituir o conteúdo da tarefa pelo container de edição
        const taskContent = taskItem.querySelector('.task-content');
        if (taskContent) {
            taskContent.style.display = 'none';
            taskItem.insertBefore(editContainer, taskContent);
        }
        // Focar no input de título
        titleInput.focus();
        titleInput.select();
        // Eventos do container de edição
        const handleSave = async () => {
            const newTitle = titleInput.value.trim();
            const newDescription = descriptionTextarea.value.trim();
            if (!newTitle) {
                // Destacar o campo de título se estiver vazio
                titleInput.style.borderColor = '#dc3545';
                titleInput.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
                titleInput.focus();
                return;
            }
            // Adicionar estado de loading
            saveBtn.classList.add('loading');
            saveBtn.innerHTML = '<i class="bi bi-hourglass-split"></i>';
            saveBtn.disabled = true;
            // Simular delay para feedback visual
            await new Promise(resolve => setTimeout(resolve, 500));
            if (newTitle) {
                const event = new CustomEvent('editTask', {
                    detail: { taskId, title: newTitle, description: newDescription }
                });
                document.dispatchEvent(event);
            }
            this.stopEditing();
        };
        const handleCancel = () => {
            // Adicionar efeito de fade out antes de cancelar
            editContainer.style.opacity = '0.5';
            editContainer.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.stopEditing();
            }, 150);
        };
        // Eventos dos botões
        saveBtn.addEventListener('click', handleSave);
        cancelBtn.addEventListener('click', handleCancel);
        // Eventos de teclado
        titleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
            }
            else if (e.key === 'Escape') {
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
        // Eventos de input para validação em tempo real
        titleInput.addEventListener('input', () => {
            if (titleInput.value.trim()) {
                titleInput.style.borderColor = '#ff69b4';
                titleInput.style.boxShadow = '0 0 0 0.2rem rgba(255, 105, 180, 0.25)';
            }
        });
    }
    stopEditing() {
        const editContainer = this.taskList.querySelector('.edit-container');
        const taskItem = this.taskList.querySelector('.task-item.editing');
        if (editContainer) {
            editContainer.remove();
        }
        if (taskItem) {
            taskItem.classList.remove('editing');
            const taskContent = taskItem.querySelector('.task-content');
            if (taskContent) {
                taskContent.style.display = '';
            }
        }
        this.editingTaskId = null;
    }
    handleKeyDown(e) {
        if (e.key === 'Escape' && this.editingTaskId) {
            this.stopEditing();
        }
    }
    handleTaskListChange(e) {
        const target = e.target;
        if (target.classList.contains('task-checkbox')) {
            const taskId = target.getAttribute('data-task-id');
            const completed = target.checked;
            const event = new CustomEvent('toggleTask', {
                detail: { taskId, completed }
            });
            document.dispatchEvent(event);
        }
    }
    handlePaginationClick(e) {
        const target = e.target;
        const pageLink = target.closest('.page-link');
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
    renderTasks(tasks) {
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
    renderPagination(totalPages) {
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
    createTaskElement(task) {
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
                    <span class="task-title">${this.escapeHtml(task.title)}</span>
                    ${descriptionHtml}
                </div>
                <div class="task-actions">
                    <button class="edit-btn" data-task-id="${task.id}" title="Editar tarefa">
                        <i class="bi bi-pencil"></i>
                    </button>
                <button class="delete-btn" data-task-id="${task.id}" title="Excluir tarefa">
                    <i class="bi bi-trash"></i>
                </button>
                </div>
            </li>
        `;
    }
    updatePendingCount(count) {
        this.pendingCount.innerHTML = `<i class="bi bi-clock"></i> Tarefas pendentes: ${count}`;
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
