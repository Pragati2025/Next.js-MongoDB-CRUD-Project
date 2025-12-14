"use client";

import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */
interface Person {
  _id: string;
  name: string;
}

/* ---------------- COMPONENT ---------------- */
export default function Home() {
  const [name, setName] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* -------- FETCH ALL PEOPLE -------- */
  const fetchPeople = async () => {
    try {
      const res = await fetch("/api/person");
      const data = await res.json();
      setPeople(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  /* -------- CREATE / UPDATE -------- */
  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    setLoading(true);

    try {
      if (editId) {
        // UPDATE
        const res = await fetch(`/api/person/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });

        const updated = await res.json();

        setPeople((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );

        setEditId(null);
      } else {
        // CREATE
        const res = await fetch("/api/person", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });

        const created = await res.json();
        setPeople((prev) => [...prev, created]);
      }

      setName("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* -------- EDIT -------- */
  const handleEdit = (person: Person) => {
    setEditId(person._id);
    setName(person.name);
  };

  /* -------- DELETE -------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this person?")) return;

    try {
      await fetch(`/api/person/${id}`, { method: "DELETE" });
      setPeople((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Person CRUD</h1>
        <p style={styles.subtitle}>Next.js + MongoDB</p>

        {/* FORM */}
        <div style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            style={editId ? styles.updateBtn : styles.addBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : editId ? "Update" : "Add"}
          </button>
        </div>

        {/* LIST */}
        <ul style={styles.list}>
          {people.length === 0 && (
            <p style={styles.empty}>No persons added yet</p>
          )}

          {people.map((person) => (
            <li key={person._id} style={styles.listItem}>
              <span style={styles.name}>{person.name}</span>

              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => handleEdit(person)}
                >
                  Edit
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(person._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 10,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  title: {
    textAlign: "center",
    marginBottom: 4,
    color: "#0f172a",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#64748b",
    fontSize: 14,
  },

  form: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    minWidth: 200,
    padding: 10,
    fontSize: 15,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    outline: "none",
  },

  addBtn: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },

  updateBtn: {
    backgroundColor: "#0284c7",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },

  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },

  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #e5e7eb",
  },

  name: {
    color: "#1e293b",
    fontSize: 15,
  },

  actions: {
    display: "flex",
    gap: 8,
  },

  editBtn: {
    backgroundColor: "#e2e8f0",
    border: "none",
    padding: "6px 10px",
    borderRadius: 4,
    cursor: "pointer",
  },

  deleteBtn: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    padding: "6px 10px",
    borderRadius: 4,
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 12,
  },
};
