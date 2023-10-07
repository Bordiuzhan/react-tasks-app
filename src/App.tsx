import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ITask {
  name: string;
  done: boolean;
}

function App(): JSX.Element {
  const [newTask, setNewTask] = useState<string>('');
  const [tasks, setTasks] = useState<ITask[]>(
    JSON.parse(localStorage.getItem('tasks') || '[]')
  );
  const taskInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback(
    (name: string): void => {
      const newTasks: ITask[] = [...tasks, { name, done: false }];
      setTasks(newTasks);
      toast.success('Task added successfully');
    },
    [tasks]
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newTask.trim()) return toast.error('Please write a task');
      addTask(newTask);
      setNewTask('');
      taskInput.current?.focus();
    },
    [addTask, newTask]
  );

  const toggleDoneTask = useCallback(
    (i: number): void => {
      const newTasks: ITask[] = [...tasks];
      newTasks[i].done = !newTasks[i].done;
      setTasks(newTasks);
      if (newTasks[i].done) toast.success('Task completed');
      else toast.warning('Task uncompleted');
    },
    [tasks]
  );

  const removeTask = useCallback(
    (i: number): void => {
      const newTasks: ITask[] = [...tasks];
      newTasks.splice(i, 1);
      setTasks(newTasks);
      toast.success('Task removed successfully');
    },
    [tasks]
  );

  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  onChange={(e) => setNewTask(e.target.value)}
                  value={newTask}
                  className="form-control"
                  autoFocus
                  ref={taskInput}
                />
                <button className="btn btn-success btn-block mt-2">Save</button>
              </form>
            </div>
          </div>
          {tasks.map((t: ITask, i: number) => {
            return (
              <div className="card card-body mt-2 " key={i}>
                <h2 style={{ textDecoration: t.done ? 'line-through' : '' }}>
                  {t.name}
                </h2>
                <div className="mr-auto">
                  <button
                    className="btn btn-secondary"
                    onClick={() => toggleDoneTask(i)}
                  >
                    {t.done ? '✓' : 'x'}{' '}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeTask(i)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
