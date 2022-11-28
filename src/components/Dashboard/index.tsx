import clipboardImg from '../../assets/clipboard.svg';
import styles from './Dashboard.module.css';

import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';
import { Check, PlusCircle, Trash } from 'phosphor-react';
import { v4 as uuidV4 } from 'uuid';

interface Task {
  id: string;
  task: string;
  isComplete: boolean;
}

export function Dashboard() {
  const [tasks, setTasks] = useState([] as Task[]);
  const [newTask, setNewTask] = useState('');

  function handleCreateNewTask(event: FormEvent) {
    event.preventDefault();

    const task = {
      id: uuidV4(),
      task: newTask,
      isComplete: false
    };

    setTasks([...tasks, task]);
    setNewTask('');
  }

  function handleNewTaskChange(event: ChangeEvent<HTMLInputElement>) {
    event.target.setCustomValidity('');

    setNewTask(event.target.value);
  }

  function handleNewTaskInvalid(event: InvalidEvent<HTMLInputElement>) {
    event.target.setCustomValidity('Esse campo é obrigatório');
  }

  function handleCheckTask(id: string) {
    const [taskToUpdate] = tasks.filter(task => task.id === id);

    const updatedTask = {
      ...taskToUpdate,
      isComplete: !taskToUpdate.isComplete
    };
    const indexUpdatedTask = tasks.indexOf(taskToUpdate);

    const updatedTasks = tasks.filter(task => task.id !== id);
    updatedTasks.splice(indexUpdatedTask, 0, updatedTask);

    setTasks(updatedTasks);
  }

  function handleDeleteTask(id: string) {
    const tasksWithoutDeleteOne = tasks.filter(task => task.id !== id);

    setTasks(tasksWithoutDeleteOne);
  }

  const isNewTaskDisabled = newTask.trim().length === 0;

  const createdTasks = tasks.length;
  const completedtasks = tasks.filter(task => task.isComplete).length;

  return (
    <div className={styles.dashboard}>
      <form onSubmit={handleCreateNewTask} className={styles.form}>
        <input
          type="text"
          placeholder="Adicione uma nova tarefa"
          value={newTask}
          onChange={handleNewTaskChange}
          onInvalid={handleNewTaskInvalid}
          required
        />

        <button type="submit" disabled={isNewTaskDisabled}>
          Criar
          <PlusCircle size={16} weight='bold' />
        </button>
      </form>

      <div className={styles.details}>
        <strong className={styles.createdTasks}>
          Tarefas criadas
          <span>{createdTasks}</span>
        </strong>

        <strong className={styles.completedTasks}>
          Concluídas
          <span>{createdTasks > 0 ? `${completedtasks} de ${createdTasks}` : '0'}</span>
        </strong>
      </div>

      {tasks.length === 0 &&
        <div className={styles.empty}>
          <img src={clipboardImg} alt="Imagem de Clipboard" />

          <p>
            <strong>Você ainda não tem tarefas cadastradas</strong>
            <br/>
            Crie tarefas e organize seus itens a fazer
          </p>
        </div>
      }

      {tasks.length > 0 &&
        tasks.map(({ id, task, isComplete }) => {
          return (
            <div
              key={id}
              className={
                isComplete
                  ? `${styles.createdTask} ${styles.completedTask}`
                  : styles.createdTask
                }
            >
              <button
                className={
                  isComplete
                    ? styles.checkCompletedTask
                    : styles.checkIncompletedTask
                }
                onClick={() => handleCheckTask(id)}
              >
                {isComplete && <Check size={12} weight='bold' /> }
              </button>

              <p
                className={
                  isComplete
                    ? styles.contentCompletedTask
                    : styles.contentIncompletedTask
                  }>
                    {task}
              </p>

              <button
                className={styles.deleteTask}
                onClick={() => handleDeleteTask(id)}
              >
                <Trash size={16} />
              </button>
            </div>
          );
        })
      }
    </div>
  );
}
