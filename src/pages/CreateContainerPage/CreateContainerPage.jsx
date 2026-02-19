import { useState } from "react";
import "./CreateContainerPage.css";
import { useContainerTypes } from "../../hooks/useContainerTypes";
import { useProducts } from "../../hooks/useProducts";
import { useUnits } from "../../hooks/useUnits";
import { createContainer } from "../../services/api/containers";
import { useNavigate } from "react-router-dom";

export default function CreateContainerPage() {
  const navigate = useNavigate();
  const { containerTypes, loading: typesLoading } = useContainerTypes();
  const { products, loading: productsLoading } = useProducts();
  const { units, loading: unitsLoading } = useUnits();

  const [form, setForm] = useState({
    name: "",
    typeId: "",
    productId: "",
    quantity: "",
    unitId: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCancel() {
    setForm({
      name: "",
      typeId: "",
      productId: "",
      quantity: "",
      unitId: "",
      notes: "",
    });
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return alert("Enter container name");
    if (!form.typeId) return alert("Select container type");

    setSubmitting(true);

    try {
      await createContainer({
        Name: form.name,
        TypeId: parseInt(form.typeId),
        ProductId: form.productId ? parseInt(form.productId) : 0,
        Quantity: form.quantity ? parseInt(form.quantity) : 0,
        UnitId: form.unitId ? parseInt(form.unitId) : 0,
        Notes: form.notes || null,
      });

      alert("Container created successfully!");
      navigate("/containers");
    } catch (err) {
      setError(err.message);
      alert("Failed to create container: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="create-container-page">
      <div className="create-card">
        <h1 className="create-title">Create container</h1>

        {error && <div className="error-banner">{error}</div>}

        <form className="create-form" onSubmit={handleSubmit}>
          <input
            className="create-input"
            name="name"
            placeholder="Container name"
            value={form.name}
            onChange={handleChange}
          />

          <select
            className="create-input create-select"
            name="typeId"
            value={form.typeId}
            onChange={handleChange}
            disabled={typesLoading}
          >
            <option value="">
              {typesLoading ? "Loading types..." : "Select container type"}
            </option>
            {containerTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name || type.Name}
              </option>
            ))}
          </select>

          <select
            className="create-input create-select"
            name="productId"
            value={form.productId}
            onChange={handleChange}
            disabled={productsLoading}
          >
            <option value="">
              {productsLoading ? "Loading products..." : "Select product (optional)"}
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.type?.title || product.type?.Title || `Product ${product.id}`}
              </option>
            ))}
          </select>

          <div className="form-row">
            <input
              className="create-input"
              name="quantity"
              type="number"
              placeholder="Quantity (optional)"
              value={form.quantity}
              onChange={handleChange}
              min="0"
            />

            <select
              className="create-input create-select"
              name="unitId"
              value={form.unitId}
              onChange={handleChange}
              disabled={unitsLoading}
            >
              <option value="">
                {unitsLoading ? "Loading..." : "Unit (optional)"}
              </option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.title || unit.Title}
                </option>
              ))}
            </select>
          </div>

          <textarea
            className="create-input create-textarea"
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={handleChange}
            rows="3"
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
            
            <button 
              className="create-btn" 
              type="submit"
              disabled={submitting || typesLoading}
            >
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
