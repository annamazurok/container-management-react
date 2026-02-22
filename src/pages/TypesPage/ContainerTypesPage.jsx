import { useEffect, useMemo, useState } from "react";
import "./ContainerTypesPage.css";
import { NavLink } from "react-router-dom";

import { useContainerTypes } from "../../hooks/useContainerTypes";
import { useUnits } from "../../hooks/useUnits";
import { useProductTypes } from "../../hooks/useProductTypes";

import {
  createContainerType,
  updateContainerType,
  deleteContainerType,
} from "../../services/api/containerTypes";

export default function ContainerTypesPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [page, setPage] = useState(1);

  const [title, setTitle] = useState("");
  const [volume, setVolume] = useState("");
  const [unitId, setUnitId] = useState("");
  const [productTypeIds, setProductTypeIds] = useState([]);

  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    containerTypes,
    loading,
    error: fetchError,
    refetch,
  } = useContainerTypes();

  const { units, loading: unitsLoading, error: unitsError } = useUnits();
  const {
    productTypes,
    loading: productTypesLoading,
    error: productTypesError,
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

  const totalPages = Math.max(
    1,
    Math.ceil((containerTypes || []).length / pageSize),
  );
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = (safePage - 1) * pageSize;
  const paged = (containerTypes || []).slice(start, start + pageSize);

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

  const unitsMap = useMemo(() => {
    const map = new Map();
    (units || []).forEach((u) => map.set(u.id, u.title || u.name));
    return map;
  }, [units]);

  const productTypesMap = useMemo(() => {
    const map = new Map();
    (productTypes || []).forEach((pt) => map.set(pt.id, pt.title || pt.name));
    return map;
  }, [productTypes]);

  function resetForm() {
    setTitle("");
    setVolume("");
    setUnitId("");
    setProductTypeIds([]);
    setError("");
    setEditingId(null);
  }

  function handleEditStart(id) {
    const item = (containerTypes || []).find((x) => x.id === id);
    if (!item) return;

    setTitle(item.title || item.name || item.Name || "");
    setVolume(String(item.volume ?? ""));
    setUnitId(String(item.unitId ?? ""));

    const ids = item.productTypeIds || item.allowedProductTypeIds || [];
    setProductTypeIds(Array.isArray(ids) ? ids : []);

    setEditingId(id);
    setError("");
  }

  function toggleProductType(id) {
    setProductTypeIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  }

  function validate() {
    const t = title.trim();
    const v = String(volume).trim();

    if (!t) return "Enter a type title.";
    if (!v) return "Enter volume.";
    if (Number.isNaN(Number(v)) || Number(v) <= 0)
      return "Volume must be a positive number.";
    if (!unitId) return "Select unit.";

    const exists = (containerTypes || []).some((x) => {
      const name = (x.title || x.name || x.Name || "").toLowerCase();
      return name === t.toLowerCase() && x.id !== editingId;
    });

    if (exists) return "This container type already exists.";
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
      const payload = {
        Name: title.trim(),
        Volume: Number(volume),
        UnitId: Number(unitId),
        ProductTypeIds: productTypeIds,
      };

      if (editingId) {
        await updateContainerType({ Id: editingId, ...payload });
      } else {
        await createContainerType(payload);
      }

      await refetch();
      resetForm();
      setSelected(null);
      setPage(1);
    } catch (err) {
      setError(err?.message || "Failed to save container type.");
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
      if (editingId === id) resetForm();

      const nextTotal = Math.max(
        1,
        Math.ceil(((containerTypes || []).length - 1) / pageSize),
      );
      if (page > nextTotal) setPage(nextTotal);
    } catch (err) {
      alert("Failed to delete container type: " + (err?.message || ""));
    }
  }

  const anyLoading = loading || unitsLoading || productTypesLoading;

  if (anyLoading) {
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

  if (fetchError || unitsError || productTypesError) {
    return (
      <div className="types-page">
        <div className="types-wrapper">
          <div className="types-card">
            <div className="error-message">
              Error: {fetchError || unitsError || productTypesError}
            </div>
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
          {/* LIST */}
          <div className="types-card">
            <div className="card-head">List of container types</div>

            <div className="table">
              <div className="table-head">
                <div className="col col-title">Title</div>
                <div className="col col-volume">Volume</div>
                <div className="col col-unit">Unit</div>
                <div className="col col-allowed">Allowed product types</div>
                <div className="col actions-head"></div>
              </div>

              {paged.map((x) => {
                const xTitle = x.title || x.name || x.Name;
                const xVolume = x.volume ?? "-";
                const xUnit = unitsMap.get(x.unitId) || "-";
                const ids = (x.productTypes || [])
                  .map((p) => p.productType?.id)
                  .filter(Boolean);
                const labels = (Array.isArray(ids) ? ids : [])
                  .map((id) => productTypesMap.get(id))
                  .filter(Boolean);

                return (
                  <div
                    key={x.id}
                    className={
                      "table-row " + (selected === x.id ? "selected" : "")
                    }
                    onClick={() => setSelected(x.id)}
                  >
                    <div className="col col-title value-strong">{xTitle}</div>

                    <div className="col col-volume">
                      {xVolume} {xUnit}
                    </div>

                    <div className="col col-unit">{xUnit}</div>

                    <div className="col col-allowed">
                      {labels.length ? (
                        <div className="mini-pills">
                          {labels.slice(0, 3).map((t) => (
                            <span className="mini-pill" key={t}>
                              {t}
                            </span>
                          ))}
                          {labels.length > 3 && (
                            <span className="mini-pill more">
                              +{labels.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="muted">None</span>
                      )}
                    </div>

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
                );
              })}

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

          {/* FORM */}
          <div className="types-card form-card">
            <div className="card-head">
              {editingId ? "Edit container type" : "Add new container type"}
            </div>

            <label className="field-label">Title</label>
            <input
              className={"field-input " + (error ? "error" : "")}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              placeholder="Example: Barrel"
              disabled={submitting}
            />

            <label className="field-label">Volume</label>
            <input
              className={"field-input " + (error ? "error" : "")}
              value={volume}
              onChange={(e) => {
                setVolume(e.target.value);
                setError("");
              }}
              placeholder="Example: 200"
              disabled={submitting}
              inputMode="numeric"
            />

            <label className="field-label">Unit</label>

            <div className="unit-row">
              <select
                className={"field-input " + (error ? "error" : "")}
                value={unitId}
                onChange={(e) => {
                  setUnitId(e.target.value);
                  setError("");
                }}
                disabled={submitting}
              >
                <option value="">Select unit...</option>
                {(units || []).map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.title || u.name}
                  </option>
                ))}
              </select>

              <NavLink className="add-unit-link" to="/units">
                + Add unit
              </NavLink>
            </div>
            <div className="field-label">Allowed product types</div>
            <div className="check-list">
              {(productTypes || []).map((pt) => {
                const label = pt.title || pt.name;
                const checked = productTypeIds.includes(pt.id);

                return (
                  <label
                    key={pt.id}
                    className={"check-item " + (checked ? "on" : "")}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleProductType(pt.id)}
                      disabled={submitting}
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
              {!productTypes?.length && (
                <div className="muted">No product types.</div>
              )}
            </div>

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
