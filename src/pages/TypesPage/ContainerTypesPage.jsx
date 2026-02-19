import { useEffect, useState } from "react";
import "./ContainerTypesPage.css";
import { useContainerTypes } from "../../hooks/useContainerTypes";
import {
  createContainerType,
  updateContainerType,
  deleteContainerType,
} from "../../services/api/containerTypes";

export default function ContainerTypesPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { containerTypes, loading, error: fetchError, refetch } = useContainerTypes();

  useEffect(() => {
    function onResize() {
      const mobile = window.innerWidth <= 900;

      setIsMobile((prev) => {
        if (prev !== mobile) {
          setPage(1);
        }
        return mobile;
      });
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pageSize = isMobile ? 4 : 6;

  const totalPages = Math.max(1, Math.ceil(containerTypes.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = (safePage - 1) * pageSize;
  const paged = containerTypes.slice(start, start + pageSize);

  function buildPages(current, total) {
    const result = [];
    const left = current - 1;
    const right = current + 2;

    result.push(1);
    if (left > 2) result.push("dots");

    for (let i = Math.max(2, left); i <= Math.min(total - 1, right); i++) {
      result.push(i);
    }

    if (right < total - 1) result.push("dots");
    if (total > 1) result.push(total);

    return result.filter((x, idx) => result.indexOf(x) === idx);
  }

  const pages = buildPages(safePage, totalPages);

  function handlePrev() {
    setPage((p) => Math.max(1, p - 1));
  }

  function handleNext() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

  function handleEditStart(id) {
    const item = containerTypes.find((x) => x.id === id);
    if (!item) return;

    setName(item.name || item.Name);
    setEditingId(id);
    setError("");
  }

  async function handleAdd() {
    const value = name.trim();

    if (!value) {
      setError("Enter a type name.");
      return;
    }

    const exists = containerTypes.some(
      (x) =>
        (x.name || x.Name).toLowerCase() === value.toLowerCase() &&
        x.id !== editingId,
    );

    if (exists) {
      setError("This type already exists.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (editingId) {
        // Update existing type
        await updateContainerType({
          id: editingId,
          name: value,
          volume: 0, // You may want to add volume field to the form
          unitId: 1, // You may want to add unit selection to the form
          productTypeIds: [],
        });
      } else {
        // Create new type
        await createContainerType({
          name: value,
          volume: 0, // You may want to add volume field to the form
          unitId: 1, // You may want to add unit selection to the form
          productTypeIds: [],
        });
      }

      await refetch();
      setName("");
      setEditingId(null);
      setSelected(null);
      setPage(1);
    } catch (err) {
      setError(err.message || "Failed to save container type");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    const ok = confirm("Delete this container type?");
    if (!ok) return;

    try {
      await deleteContainerType(id);
      await refetch();

      if (selected === id) setSelected(null);
      if (editingId === id) {
        setEditingId(null);
        setName("");
        setError("");
      }

      const nextTotal = Math.max(1, Math.ceil((containerTypes.length - 1) / pageSize));
      if (page > nextTotal) setPage(nextTotal);
    } catch (err) {
      alert("Failed to delete container type: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="types-page">
        <div className="types-wrapper">
          <div className="types-card">
            <div className="loading-message">Loading container types...</div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="types-page">
        <div className="types-wrapper">
          <div className="types-card">
            <div className="error-message">Error: {fetchError}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="types-page">
      <div className="types-wrapper">
        <div className="types-title">Container Types</div>

        <div className="types-grid">
          <div className="types-card">
            <div className="card-head">List of container types</div>

            <div className="table">
              <div className="table-head">
                <div className="col name">Name</div>
                <div className="col actions-head"></div>
              </div>

              {paged.map((x) => (
                <div
                  key={x.id}
                  className={
                    "table-row " + (selected === x.id ? "selected" : "")
                  }
                  onClick={() => setSelected(x.id)}
                >
                  <div className="col name-value">{x.name || x.Name}</div>

                  <div className="col actions">
                    <button
                      className="icon-btn"
                      type="button"
                      title="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStart(x.id);
                      }}
                    >
                      <img src="/edit.svg" alt="edit" />
                    </button>

                    <button
                      className="icon-btn"
                      type="button"
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(x.id);
                      }}
                    >
                      <img src="/trash.svg" alt="delete" />
                    </button>
                  </div>
                </div>
              ))}

              {paged.length === 0 && (
                <div className="empty-state">No types found.</div>
              )}
            </div>

            <div className="card-bottom">
              <div className="pagination">
                <button
                  className={"page-arrow " + (safePage === 1 ? "disabled" : "")}
                  type="button"
                  onClick={handlePrev}
                >
                  ‹
                </button>

                {pages.map((p, idx) =>
                  p === "dots" ? (
                    <span className="dots" key={"d" + idx}>
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      className={"page-btn " + (p === safePage ? "active" : "")}
                      type="button"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  className={
                    "page-arrow " + (safePage === totalPages ? "disabled" : "")
                  }
                  type="button"
                  onClick={handleNext}
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          <div className="types-card form-card">
            <div className="card-head">
              {editingId ? "Edit container type" : "Add new container type"}
            </div>

            <label className="field-label">Type name</label>
            <input
              className={"field-input " + (error ? "error" : "")}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Example: Barrel"
              disabled={submitting}
            />

            {error && <div className="field-error">{error}</div>}

            <button
              className="primary-btn"
              type="button"
              onClick={handleAdd}
              disabled={submitting}
            >
              {submitting ? "Saving..." : editingId ? "Save" : "Add"}
            </button>

            {editingId && (
              <button
                className="secondary-btn"
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setError("");
                }}
                disabled={submitting}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
