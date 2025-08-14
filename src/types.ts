// Interface que define a estrutura de uma tarefa
// Define os tipos de dados que uma tarefa deve ter
export interface Task {
    id: string;        // Identificador único da tarefa
    title: string;     // Título/descrição principal da tarefa
    description: string; // Descrição detalhada (opcional)
    completed: boolean; // Status de conclusão da tarefa
} 
