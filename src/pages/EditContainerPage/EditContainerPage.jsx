import { useEffect, useMemo, useState } from "react";
import "./EditContainerPage.css";
import { useContainerTypes } from "../../hooks/useContainerTypes";
import { useProducts } from "../../hooks/useProducts";
import { useUnits } from "../../hooks/useUnits";
import {
  getContainerById,
  updateContainer,
} from "../../services/api/containers";
import { useNavigate, useParams } from "react-router-dom";

export default function EditContainerPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { containerTypes, loading: typesLoading } = useContainerTypes();
  const { products, loading: productsLoading } = useProducts();
  const { units, loading: unitsLoading } = useUnits();

  const [form, setForm] = useState({
    name: "",
    typeId: "",
    productId: "",
    quantity: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleCancel() {
    navigate("/containers");
  }

  useEffect(() => {
    let mounted = true;

    async function loadContainer() {
      setLoading(true);
      setError("");

      try {
        const container = await getContainerById(id);

        if (mounted) {
          const typeId =
            container.typeId ??
            container.TypeId ??
            container.containerTypeId ??
            container.ContainerTypeId ??
            "";

          const productId = container.productId ?? container.ProductId ?? "";

          const qty = container.quantity ?? container.Quantity ?? "";

          const notes = container.notes ?? container.Notes ?? "";

          setForm({
            name: (container.name ?? container.Name ?? "").toString(),
            typeId: typeId ? String(typeId) : "",
            productId: productId ? String(productId) : "",
            quantity: qty === 0 ? "0" : qty ? String(qty) : "",
            notes: notes ? String(notes) : "",
          });
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || "Failed to load container.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (id) loadContainer();

    return () => {
      mounted = false;
    };
  }, [id]);

  const selectedType = useMemo(() => {
    if (!form.typeId) return null;
    const typeIdNum = Number(form.typeId);

    return (
      (containerTypes || []).find((t) => Number(t.id ?? t.Id) === typeIdNum) ||
      null
    );
  }, [form.typeId, containerTypes]);

  const typeCapacity = selectedType?.volume ?? selectedType?.Volume ?? "";
  const typeUnitId = Number(selectedType?.unitId ?? selectedType?.UnitId ?? 0);

  const unitTitle = useMemo(() => {
    if (!typeUnitId) return "";
    const u = (units || []).find((x) => Number(x.id ?? x.Id) === typeUnitId);
    return u?.title ?? u?.Title ?? u?.name ?? u?.Name ?? "";
  }, [typeUnitId, units]);

  const allowedProductTypeIds = useMemo(() => {
    if (!selectedType) return [];

    const list = selectedType.productTypes ?? selectedType.ProductTypes;
    if (!Array.isArray(list)) return [];

    return list
      .map((x) => x?.productType?.id ?? x?.productType?.Id)
      .filter(Boolean)
      .map((x) => Number(x));
  }, [selectedType]);

  const allowedTypeTitles = useMemo(() => {
    if (!selectedType) return [];
    const list = selectedType.productTypes ?? selectedType.ProductTypes;
    if (!Array.isArray(list)) return [];

    return list
      .map(
        (x) =>
          x?.productType?.title ??
          x?.productType?.Title ??
          x?.productType?.name ??
          x?.productType?.Name,
      )
      .filter(Boolean);
  }, [selectedType]);

  const filteredProducts = useMemo(() => {
    if (!allowedProductTypeIds.length) return products || [];

    return (products || []).filter((p) => {
      const ptId =
        p?.productTypeId ??
        p?.ProductTypeId ??
        p?.typeId ??
        p?.TypeId ??
        p?.productType?.id ??
        p?.productType?.Id;

      if (!ptId) return false;
      return allowedProductTypeIds.includes(Number(ptId));
    });
  }, [products, allowedProductTypeIds]);

  useEffect(() => {
    if (!form.productId) return;
    if (!allowedProductTypeIds.length) return;

    const pid = Number(form.productId);
    const p = (products || []).find((x) => Number(x.id ?? x.Id) === pid);
    if (!p) return;

    const ptId =
      p?.productTypeId ??
      p?.ProductTypeId ??
      p?.typeId ??
      p?.TypeId ??
      p?.productType?.id ??
      p?.productType?.Id;

    if (!ptId || !allowedProductTypeIds.includes(Number(ptId))) {
      setForm((prev) => ({ ...prev, productId: "" }));
    }
  }, [form.typeId, form.productId, allowedProductTypeIds, products]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    if (!name) return setError("Enter container name.");
    if (!form.typeId) return setError("Select container type.");

    const q = form.quantity !== "" ? Number(form.quantity) : 0;
    const cap = typeCapacity ? Number(typeCapacity) : 0;

    if (Number.isNaN(q) || q < 0) return setError("Quantity must be >= 0.");
    if (cap && q > cap) {
      return setError(
        `Quantity cannot be bigger than capacity (${cap} ${unitTitle}).`,
      );
    }

    setSubmitting(true);

    try {
      const typeIdNum = Number(form.typeId);
      const productIdNum = form.productId ? Number(form.productId) : 0;

      await updateContainer({
        Id: Number(id),
        Name: name,

        TypeId: typeIdNum,
        ContainerTypeId: typeIdNum,

        ProductId: productIdNum,
        Quantity: q,

        UnitId: typeUnitId || 0,
        Notes: form.notes?.trim() ? form.notes.trim() : null,
      });

      alert("Container updated successfully!");
      navigate("/containers");
    } catch (err) {
      setError(err?.message || "Failed to update container.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || typesLoading || productsLoading || unitsLoading) {
    return (
      <div className="edit-container-page">
        <div className="edit-card">
          <div className="loading-text">Loading container...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container-page">
      <div className="edit-card">
        <h1 className="edit-title">Edit container</h1>

        {error && <div className="error-banner">{error}</div>}

        <form className="edit-form" onSubmit={handleSubmit}>
          <input
            className="edit-input"
            name="name"
            type="text"
            placeholder="Container name"
            value={form.name}
            onChange={handleChange}
            disabled={submitting}
          />

          <select
            className="edit-input edit-select"
            name="typeId"
            value={form.typeId}
            onChange={handleChange}
            disabled={typesLoading || submitting}
          >
            <option value="">
              {typesLoading ? "Loading types..." : "Select container type"}
            </option>
            {(containerTypes || []).map((type) => (
              <option key={type.id ?? type.Id} value={type.id ?? type.Id}>
                {type.name || type.Name}
              </option>
            ))}
          </select>

          {form.typeId && (
            <div className="type-info">
              <div className="type-line">
                <span className="type-label">Capacity:</span>
                <span className="type-value">
                  {typeCapacity ? `${typeCapacity} ${unitTitle || ""}` : "—"}
                </span>
              </div>

              <div className="type-line">
                <span className="type-label">Allowed product types:</span>
                <span className="type-value">
                  {allowedTypeTitles.length
                    ? allowedTypeTitles.join(", ")
                    : "—"}
                </span>
              </div>
            </div>
          )}

          <select
            className="edit-input edit-select"
            name="productId"
            value={form.productId}
            onChange={handleChange}
            disabled={productsLoading || !form.typeId || submitting}
          >
            <option value="">
              {!form.typeId
                ? "Select container type first"
                : productsLoading
                  ? "Loading products..."
                  : "Select product (optional)"}
            </option>

            {filteredProducts.map((product) => (
              <option
                key={product.id ?? product.Id}
                value={product.id ?? product.Id}
              >
                {product.title ||
                  product.Title ||
                  product.name ||
                  product.Name ||
                  `Product ${product.id ?? product.Id}`}
              </option>
            ))}
          </select>

          <div className="form-row">
            <input
              className="edit-input"
              name="quantity"
              type="number"
              placeholder={
                typeCapacity
                  ? `Quantity (max ${typeCapacity} ${unitTitle})`
                  : "Quantity (optional)"
              }
              value={form.quantity}
              onChange={handleChange}
              min="0"
              disabled={submitting}
            />

            <input
              className="edit-input"
              value={
                unitsLoading
                  ? "Loading unit..."
                  : unitTitle
                    ? `Unit: ${unitTitle}`
                    : "Unit from type"
              }
              disabled
              readOnly
            />
          </div>

          <textarea
            className="edit-input edit-textarea"
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={handleChange}
            rows="3"
            disabled={submitting}
          />

          <div className="button-group">
            <button
              className="cancel-btn"
              type="button"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>

            <button className="edit-btn" type="submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
