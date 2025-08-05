export class TaskUI {
    constructor() {
        this.currentTaskIdToDelete = null;
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
        this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        this.taskTextToDelete = document.getElementById('taskTextToDelete');
        this.pagination = document.getElementById('pagination');
        // Inicializar o modal do Bootstrap
        const modalElement = document.getElementById('deleteConfirmModal');
        this.deleteModal = new window.bootstrap.Modal(modalElement);
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
        this.taskList.addEventListener('dblclick', (e) => this.handleTaskListDoubleClick(e));
        // Evento de confirmação de exclusão
        this.confirmDeleteBtn.addEventListener('click', () => this.handleConfirmDelete());
        // Evento de paginação
        this.pagination.addEventListener('click', (e) => this.handlePaginationClick(e));
        // Eventos de teclado para edição
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        // Teste: adicionar listener direto para verificar se funciona
        console.log('Eventos vinculados. Testando captura de eventos...');
        this.taskList.addEventListener('dblclick', (e) => {
            console.log('Double click capturado no taskList:', e.target);
        });
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
        // Verificar se clicou no botão de deletar ou no ícone
        const deleteBtn = target.closest('.delete-btn');
        if (deleteBtn) {
            e.preventDefault();
            const taskId = deleteBtn.getAttribute('data-task-id');
            const taskTitle = deleteBtn.closest('.task-item')?.querySelector('.task-title')?.textContent || '';
            this.showDeleteConfirmation(taskId, taskTitle);
        }
    }
    handleTaskListDoubleClick(e) {
        const target = e.target;
        console.log('Double click detectado em:', target);
        console.log('Target classList:', target.classList);
        const taskTitle = target.closest('.task-title');
        const taskDescription = target.closest('.task-description');
        console.log('taskTitle encontrado:', !!taskTitle);
        console.log('taskDescription encontrado:', !!taskDescription);
        // Verificar se clicou em algum elemento editável
        if ((taskTitle || taskDescription) && !this.editingTaskId) {
            const taskItem = (taskTitle || taskDescription)?.closest('.task-item');
            if (!taskItem) {
                console.log('taskItem não encontrado');
                return;
            }
            const taskId = taskItem.getAttribute('data-task-id');
            const currentTitle = taskItem.querySelector('.task-title')?.textContent || '';
            const currentDescription = taskItem.querySelector('.task-description')?.textContent || '';
            console.log('Iniciando edição:', { taskId, currentTitle, currentDescription });
            this.startEditing(taskId, currentTitle, currentDescription, taskItem);
        }
        else {
            console.log('Condições não atendidas:', {
                hasTitle: !!taskTitle,
                hasDescription: !!taskDescription,
                editingTaskId: this.editingTaskId
            });
        }
    }
    startEditing(taskId, currentTitle, currentDescription, taskItem) {
        console.log('startEditing chamado:', { taskId, currentTitle, currentDescription });
        this.editingTaskId = taskId;
        const titleElement = taskItem.querySelector('.task-title');
        const descriptionElement = taskItem.querySelector('.task-description');
        const taskContent = taskItem.querySelector('.task-content');
        console.log('Elementos encontrados:', {
            titleElement: !!titleElement,
            descriptionElement: !!descriptionElement,
            taskContent: !!taskContent
        });
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
        titleInput.placeholder = 'Título da tarefa...';
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
        descriptionTextarea.placeholder = 'Descrição da tarefa (opcional)...';
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
        // Substituir o conteúdo da tarefa pelo container de edição
        if (taskContent) {
            taskContent.style.display = 'none';
            taskContent.parentNode?.insertBefore(editContainer, taskContent);
            console.log('Container de edição inserido');
        }
        else {
            console.error('taskContent não encontrado');
        }
        // Focar no input de título
        titleInput.focus();
        titleInput.select();
        // Eventos do container de edição
        const handleSave = () => {
            const newTitle = titleInput.value.trim();
            const newDescription = descriptionTextarea.value.trim();
            console.log('Salvando edição:', { newTitle, newDescription });
            if (newTitle && (newTitle !== currentTitle || newDescription !== currentDescription)) {
                const event = new CustomEvent('editTask', {
                    detail: { taskId, title: newTitle, description: newDescription }
                });
                document.dispatchEvent(event);
            }
            this.stopEditing();
        };
        const handleCancel = () => {
            console.log('Cancelando edição');
            this.stopEditing();
        };
        // Eventos do input de título
        titleInput.addEventListener('blur', handleSave);
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
        // Eventos do textarea de descrição
        descriptionTextarea.addEventListener('blur', handleSave);
        descriptionTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
            }
        });
    }
    stopEditing() {
        const editContainer = this.taskList.querySelector('.edit-container');
        const hiddenTaskContent = this.taskList.querySelector('.task-content[style*="display: none"]');
        if (editContainer) {
            editContainer.remove();
        }
        if (hiddenTaskContent) {
            hiddenTaskContent.style.display = '';
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
    showDeleteConfirmation(taskId, taskTitle) {
        this.currentTaskIdToDelete = taskId;
        this.taskTextToDelete.textContent = `"${taskTitle}"`;
        this.deleteModal.show();
    }
    handleConfirmDelete() {
        if (this.currentTaskIdToDelete) {
            const event = new CustomEvent('deleteTask', {
                detail: { taskId: this.currentTaskIdToDelete }
            });
            document.dispatchEvent(event);
            this.deleteModal.hide();
            this.currentTaskIdToDelete = null;
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
        // Teste: adicionar botão de teste para edição
        if (currentTasks.length > 0) {
            const testButton = document.createElement('button');
            testButton.textContent = 'Testar Edição';
            testButton.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 1000;
                background: #ff69b4;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
            `;
            testButton.addEventListener('click', () => {
                const firstTask = this.taskList.querySelector('.task-item');
                if (firstTask) {
                    const taskId = firstTask.getAttribute('data-task-id');
                    const currentTitle = firstTask.querySelector('.task-title')?.textContent || '';
                    const currentDescription = firstTask.querySelector('.task-description')?.textContent || '';
                    console.log('Testando edição forçada:', { taskId, currentTitle, currentDescription });
                    this.startEditing(taskId, currentTitle, currentDescription, firstTask);
                }
            });
            document.body.appendChild(testButton);
        }
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
        const descriptionHtml = `
            <div class="task-description" title="Clique duas vezes para editar">${this.escapeHtml(task.description || '')}</div>
        `;
        const html = `
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
        console.log('HTML gerado para tarefa:', task.id, html);
        return html;
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
