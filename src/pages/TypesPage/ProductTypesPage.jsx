import { useEffect, useMemo, useState } from "react";
import "./ProductTypesPage.css";

export default function ProductTypesPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [page, setPage] = useState(1);

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

  const initial = useMemo(
    () => [
      { id: 1, name: "Liquid" },
      { id: 2, name: "Liquid" },
      { id: 3, name: "Liquid" },
      { id: 4, name: "Liquid" },
    ],
    [],
  );

  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = (safePage - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

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
    const item = items.find((x) => x.id === id);
    if (!item) return;

    setName(item.name);
    setEditingId(id);
    setError("");
  }

  function handleAdd() {
    const value = name.trim();

    if (!value) {
      setError("Enter type name.");
      return;
    }

    const exists = items.some(
      (x) => x.name.toLowerCase() === value.toLowerCase() && x.id !== editingId,
    );

    if (exists) {
      setError("This type already exists.");
      return;
    }

    if (editingId) {
      setItems((prev) =>
        prev.map((x) => (x.id === editingId ? { ...x, name: value } : x)),
      );
    } else {
      setItems((prev) => [{ id: Date.now(), name: value }, ...prev]);
    }

    setName("");
    setError("");
    setEditingId(null);
    setSelected(null);
    setPage(1);
  }

  function handleDelete(id) {
    const ok = confirm("Delete product type?");
    if (!ok) return;

    setItems((prev) => prev.filter((x) => x.id !== id));
    if (selected === id) setSelected(null);
    if (editingId === id) {
      setEditingId(null);
      setName("");
      setError("");
    }

    const nextTotal = Math.max(1, Math.ceil((items.length - 1) / pageSize));
    if (page > nextTotal) setPage(nextTotal);
  }

  return (
    <div className="types-page">
      <div className="types-wrapper">
        <div className="types-title">Product Types</div>

        <div className="types-grid">
          <div className="types-card">
            <div className="card-head">List of product types</div>

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
                  <div className="col name-value">{x.name}</div>

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
            <div className="card-head"></div>

            <label className="field-label">Type name</label>
            <input
              className={"field-input " + (error ? "error" : "")}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Example: Liquid"
            />

            {error && <div className="field-error">{error}</div>}

            <button className="primary-btn" type="button" onClick={handleAdd}>
              {editingId ? "Save" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
