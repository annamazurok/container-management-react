import { useEffect, useState } from "react";
import "./ProductTypesPage.css";
import { useProductTypes } from "../../hooks/useProductTypes";
import {
  createProductType,
  updateProductType,
  deleteProductType,
} from "../../services/api/productTypes";

export default function ProductTypesPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    productTypes,
    loading,
    error: fetchError,
    refetch,
  } = useProductTypes();

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

  const totalPages = Math.max(1, Math.ceil(productTypes.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = (safePage - 1) * pageSize;
  const paged = productTypes.slice(start, start + pageSize);

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
    const item = productTypes.find((x) => x.id === id);
    if (!item) return;

    setTitle(item.title || item.Title);
    setEditingId(id);
    setError("");
  }

  async function handleAdd() {
    const value = title.trim();

    if (!value) {
      setError("Enter type name.");
      return;
    }

    const exists = productTypes.some(
      (x) =>
        (x.title || x.Title).toLowerCase() === value.toLowerCase() &&
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
        await updateProductType({
          id: editingId,
          title: value,
        });
      } else {
        await createProductType({
          title: value,
        });
      }

      await refetch();
      setTitle("");
      setEditingId(null);
      setSelected(null);
      setPage(1);
    } catch (err) {
      setError(err.message || "Failed to save product type");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    const ok = confirm("Delete this product type?");
    if (!ok) return;

    try {
      await deleteProductType(id);
      await refetch();

      if (selected === id) setSelected(null);
      if (editingId === id) {
        setEditingId(null);
        setTitle("");
        setError("");
      }

      const nextTotal = Math.max(
        1,
        Math.ceil((productTypes.length - 1) / pageSize),
      );
      if (page > nextTotal) setPage(nextTotal);
    } catch (err) {
      alert("Failed to delete product type: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="types-page">
        <div className="types-wrapper">
          <div className="types-card">
            <div className="loading-message">Loading product types...</div>
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
                  <div className="col name-value">{x.title || x.Title}</div>

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
              {editingId ? "Edit product type" : "Add new product type"}
            </div>

            <label className="field-label">Type name</label>
            <input
              className={"field-input " + (error ? "error" : "")}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              placeholder="Example: Liquid"
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
                  setTitle("");
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
