import { useEffect, useState } from "react";

const API_URL = "https://dummyjson.com/todos?limit=10";

function DashboardApi() {
  const [todos, setTodos] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const loadTodos = async () => {
      setStatus("loading");
      setError("");

      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "API xatoligi.");
        }

        const nextTodos = Array.isArray(data.todos) ? data.todos : [];
        if (!ignore) {
          setTodos(nextTodos);
          setStatus("success");
        }
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        if (!ignore) {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "API ulanishda xatolik.";
          setError(message);
          setStatus("error");
        }
      }
    };

    loadTodos();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  if (status === "loading") {
    return <p>API malumotlari yuklanmoqda...</p>;
  } else if (status === "error") {
    return <p className="message message-error">{error}</p>;
  } else if (status === "success" && todos.length === 0) {
    return <p>API royxati bo`sh.</p>;
  }

  return (
    <section className="table-wrap">
      <h3 className="table-title">Todo API</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Todo</th>
            <th>Completed</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>{todo.todo}</td>
              <td>{todo.completed ? "Yes" : "No"}</td>
              <td>{todo.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default DashboardApi;
