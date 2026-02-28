import { useEffect, useState } from "react";

const USERS_API = "https://dummyjson.com/users?limit=10";

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const loadUsers = async () => {
      setStatus("loading");
      setError("");

      try {
        const response = await fetch(USERS_API, { signal: controller.signal });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Users API xatoligi.");
        }

        const nextUsers = Array.isArray(data.users) ? data.users : [];
        if (!ignore) {
          setUsers(nextUsers);
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
              : "Users API ulanishda xatolik.";
          setError(message);
          setStatus("error");
        }
      }
    };

    loadUsers();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  if (status === "loading") {
    return <p>Users malumotlari yuklanmoqda...</p>;
  } else if (status === "error") {
    return <p className="message message-error">{error}</p>;
  } else if (status === "success" && users.length === 0) {
    return <p>Users royxati bo`sh.</p>;
  }

  return (
    <section className="table-wrap">
      <h3 className="table-title">Users API</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default UsersTable;
