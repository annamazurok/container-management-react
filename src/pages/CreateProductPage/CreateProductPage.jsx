import { useState } from "react";
import "./CreateProductPage.css";
import { useProductTypes } from "../../hooks/useProductTypes";
import { createProduct } from "../../services/api/products";
import { useNavigate } from "react-router-dom";

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { productTypes, loading: typesLoading } = useProductTypes();
  
  const [form, setForm] = useState({
    typeId: "",
    name: "",
    description: "",
    productionDate: "",
    expirationDate: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCancel() {
    setForm({
      typeId: "",
      name: "",
      description: "",
      productionDate: "",
      expirationDate: "",
    });
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.typeId) return alert("Select product type");
    if (!form.productionDate) return alert("Enter production date");
    if (!form.name) return alert("Enter product name");

    setSubmitting(true);

    try {
      await createProduct({
        TypeId: parseInt(form.typeId),
        Name: form.name,
        Produced: new Date(form.productionDate).toISOString(),
        ExpirationDate: form.expirationDate 
          ? new Date(form.expirationDate).toISOString() 
          : null,
        Description: form.description || null,
      });

      alert("Product created successfully!");
      navigate("/products");
    } catch (err) {
      setError(err.message);
      alert("Failed to create product: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="create-product-page">
      <div className="create-card">
        <h1 className="create-title">Create product</h1>

        {error && <div className="error-banner">{error}</div>}

        <form className="create-form" onSubmit={handleSubmit}>
              <input
        className="create-input"
        name="name"
        type="text"
        placeholder="Product name"
        value={form.name}
        onChange={handleChange}
        required
      />
          <select
            className="create-input create-select"
            name="typeId"
            value={form.typeId}
            onChange={handleChange}
            disabled={typesLoading}
          >
            <option value="">
              {typesLoading ? "Loading types..." : "Select product type"}
            </option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.title || type.Title}
              </option>
            ))}
          </select>

          <textarea
            className="create-input create-textarea"
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            rows="3"
          />

          <label className="date-label">Creation date</label>
          <input
            className="create-input"
            name="productionDate"
            type="date"
            placeholder="Production date"
            value={form.productionDate}
            onChange={handleChange}
          />

          <label className="date-label">Expiration date</label>
          <input
            className="create-input"
            name="expirationDate"
            type="date"
            placeholder="Expiration date (optional)"
            value={form.expirationDate}
            onChange={handleChange}
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
