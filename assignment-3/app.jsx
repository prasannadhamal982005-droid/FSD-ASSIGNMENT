const { useState, useEffect } = React;

// Unique ID generator
const uid = () => Math.random().toString(36).slice(2, 9);

// Header Component
function Header() {
  return (
    <header className="w-full py-6 px-6 sm:px-10 flex items-center justify-between bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 text-white rounded-b-3xl shadow-lg">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          🌈 Funky Task Manager
        </h1>
        <p className="text-sm opacity-90">Get things done — with style ✨</p>
      </div>
    </header>
  );
}

// Add Task Component
function AddTask({ onAdd }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("normal");

  function submit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({
      id: uid(),
      text: trimmed,
      done: false,
      priority,
      createdAt: Date.now(),
    });
    setText("");
    setPriority("normal");
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col sm:flex-row gap-3 sm:items-center"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 px-4 py-3 rounded-2xl shadow-inner outline-none placeholder:opacity-60 bg-white/90"
        placeholder='Add a funky task... e.g. "Walk the neon dog"'
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="px-4 py-3 rounded-2xl bg-white/90"
      >
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>
      <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-pink-500 font-semibold shadow-md hover:scale-105 transition">
        Add
      </button>
    </form>
  );
}

// Task Item
function TaskItem({ task, onToggle, onDelete, onEdit }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl shadow-sm transition transform hover:-translate-y-1 bg-white/90">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        className="w-5 h-5 accent-purple-500"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p
            className={`truncate font-medium ${
              task.done ? "line-through opacity-60" : ""
            }`}
          >
            {task.text}
          </p>
          <div
            className="text-xs rounded-xl px-2 py-1 font-semibold"
            style={{
              background:
                task.priority === "high"
                  ? "rgba(255,99,132,0.12)"
                  : task.priority === "low"
                  ? "rgba(99,255,200,0.08)"
                  : "rgba(255,211,92,0.08)",
            }}
          >
            {task.priority}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Added: {new Date(task.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(task.id)}
          className="px-3 py-2 rounded-xl bg-white/90 text-sm"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-2 rounded-xl bg-white/10 text-sm"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

// Task List (Class Component)
class TaskList extends React.Component {
  render() {
    const { tasks, onToggle, onDelete, onEdit } = this.props;
    if (!tasks.length)
      return (
        <div className="p-6 text-center text-gray-500">
          No tasks yet — add some funky ones ✨
        </div>
      );

    return (
      <div className="grid gap-3">
        {tasks.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  }
}

// Main App
function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("funky_tasks_v1");
    if (raw) setTasks(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem("funky_tasks_v1", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(task) {
    setTasks((s) => [task, ...s]);
  }

  function toggleTask(id) {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id) {
    setTasks((s) => s.filter((t) => t.id !== id));
  }

  function startEdit(id) {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    setEditingId(id);
    setEditText(t.text);
  }

  function commitEdit(e) {
    e.preventDefault();
    setTasks((s) =>
      s.map((t) => (t.id === editingId ? { ...t, text: editText } : t))
    );
    setEditingId(null);
    setEditText("");
  }

  function bulkClearDone() {
    setTasks((s) => s.filter((t) => !t.done));
  }

  const filtered = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-white via-slate-50 to-slate-100 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        <Header />

        <main className="mt-6 p-6 bg-white rounded-3xl shadow-xl">
          <section className="space-y-4">
            <AddTask onAdd={addTask} />

            <div className="flex items-center justify-between gap-3 mt-2">
              <div className="flex items-center gap-2">
                <label className="text-sm opacity-80">Show:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="done">Completed</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">{tasks.length} total</div>
                <button
                  onClick={bulkClearDone}
                  className="px-4 py-2 rounded-2xl bg-red-50 hover:bg-red-100"
                >
                  Clear done
                </button>
              </div>
            </div>

            <div className="mt-2">
              {editingId ? (
                <form
                  onSubmit={commitEdit}
                  className="flex gap-3 items-center"
                >
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl"
                  />
                  <button className="px-4 py-3 rounded-2xl bg-emerald-300">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditText("");
                    }}
                    className="px-4 py-3 rounded-2xl bg-slate-100"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <TaskList
                  tasks={filtered}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onEdit={startEdit}
                />
              )}
            </div>

            <footer className="mt-6 text-sm text-gray-500 flex items-center justify-between">
              <div>Tip: Use fun task names — be creative 🎨</div>
              <div>Made with ❤️ — React & Tailwind vibes</div>
            </footer>
          </section>
        </main>

        <div className="mt-6 text-center text-xs opacity-80">
          Responsive — try resizing the window or open on mobile!
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
