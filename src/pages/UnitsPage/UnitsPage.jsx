import { useEffect, useState } from "react";
import "./UnitsPage.css";

import { useUnits } from "../../hooks/useUnits";
import {
  createUnit,
  updateUnit,
  deleteUnit,
  UnitType,
} from "../../services/api/units";

export default function UnitsPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [page, setPage] = useState(1);

  const [title, setTitle] = useState("");
  const [unitType, setUnitType] = useState(UnitType.Default);

  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { units, loading, error: fetchError, refetch } = useUnits();

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

  const pageSize = isMobile ? 6 : 10;

  const totalPages = Math.max(1, Math.ceil((units || []).length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = (safePage - 1) * pageSize;
  const paged = (units || []).slice(start, start + pageSize);

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

  function unitTypeLabel(t) {
    const value = Number(t);

    if (value === UnitType.Mass) return "Mass";
    if (value === UnitType.Capacity) return "Capacity";
    return "Default";
  }

  function resetForm() {
    setTitle("");
    setUnitType(UnitType.Default);
    setError("");
    setEditingId(null);
  }

  function handleEditStart(id) {
    const item = (units || []).find((x) => x.id === id || x.Id === id);
    if (!item) return;

    setTitle(item.title || item.Title || item.name || item.Name || "");
    setUnitType(
      item.unitType !== undefined
        ? Number(item.unitType)
        : item.UnitType !== undefined
          ? Number(item.UnitType)
          : UnitType.Default,
    );

    setEditingId(item.id ?? item.Id ?? id);
    setError("");
  }

  function validate() {
    const value = title.trim();
    if (!value) return "Enter unit title.";

    const exists = (units || []).some((u) => {
      const uId = u.id ?? u.Id;
      const t = (u.title || u.Title || u.name || u.Name || "").toLowerCase();
      return t === value.toLowerCase() && uId !== editingId;
    });

    if (exists) return "This unit already exists.";
    return "";
  }

  async function handleSave() {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (editingId) {
        await updateUnit({
          Id: editingId,
          Title: title.trim(),
          UnitType: Number(unitType),
        });
      } else {
        await createUnit({
          Title: title.trim(),
          UnitType: Number(unitType),
        });
      }

      await refetch();
      resetForm();
      setSelected(null);
      setPage(1);
    } catch (err) {
      setError(err?.message || "Failed to save unit.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    const ok = confirm("Delete this unit?");
    if (!ok) return;

    try {
      await deleteUnit(id);
      await refetch();

      if (selected === id) setSelected(null);
      if (editingId === id) resetForm();

      const nextTotal = Math.max(
        1,
        Math.ceil(((units || []).length - 1) / pageSize),
      );
      if (page > nextTotal) setPage(nextTotal);
    } catch (err) {
      alert("Failed to delete unit: " + (err?.message || ""));
    }
  }

  if (loading) {
    return (
      <div className="units-page">
        <div className="units-wrapper">
          <div className="units-card">
            <div className="loading-message">Loading units...</div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="units-page">
        <div className="units-wrapper">
          <div className="units-card">
            <div className="error-message">Error: {fetchError}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="units-page">
      <div className="units-wrapper">
        <div className="units-title">Units</div>

        <div className="units-grid">
          {/* LIST */}
          <div className="units-card">
            <div className="card-head">List of units</div>

            <div className="table">
              <div className="table-head">
                <div className="col title">Title</div>
                <div className="col type">Type</div>
                <div className="col actions-head"></div>
              </div>

              {paged.map((x) => {
                const id = x.id ?? x.Id;
                const t = x.title || x.Title || x.name || x.Name;
                const tp =
                  x.unitType !== undefined
                    ? x.unitType
                    : x.UnitType !== undefined
                      ? x.UnitType
                      : 0;

                return (
                  <div
                    key={id}
                    className={
                      "table-row " + (selected === id ? "selected" : "")
                    }
                    onClick={() => setSelected(id)}
                  >
                    <div className="col title-value">{t}</div>
                    <div className="col type-value">{unitTypeLabel(tp)}</div>

                    <div className="col actions">
                      <button
                        className="icon-btn"
                        type="button"
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStart(id);
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
                          handleDelete(id);
                        }}
                      >
                        <img src="/trash.svg" alt="delete" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {paged.length === 0 && (
                <div className="empty-state">No units found.</div>
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

          <div className="units-card form-card">
            <div className="card-head">
              {editingId ? "Edit unit" : "Add new unit"}
            </div>

            <label className="field-label">Unit title</label>
            <input
              className={"field-input " + (error ? "error" : "")}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              placeholder="Example: kg / L / pcs"
              disabled={submitting}
            />

            <label className="field-label">Unit type</label>
            <select
              className={"field-input " + (error ? "error" : "")}
              value={unitType}
              onChange={(e) => {
                setUnitType(Number(e.target.value));
                setError("");
              }}
              disabled={submitting}
            >
              <option value={UnitType.Default}>Default</option>
              <option value={UnitType.Mass}>Mass</option>
              <option value={UnitType.Capacity}>Capacity</option>
            </select>

            {error && <div className="field-error">{error}</div>}

            <button
              className="primary-btn"
              type="button"
              onClick={handleSave}
              disabled={submitting}
            >
              {submitting ? "Saving..." : editingId ? "Save" : "Add"}
            </button>

            {editingId && (
              <button
                className="secondary-btn"
                type="button"
                onClick={resetForm}
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
