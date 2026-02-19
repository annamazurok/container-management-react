import { useState, useEffect } from "react";
import "./EditProductPage.css";
import { useProductTypes } from "../../hooks/useProductTypes";
import { getProductById, updateProduct } from "../../services/api/products";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { productTypes, loading: typesLoading } = useProductTypes();
  
  const [form, setForm] = useState({
    typeId: "",
    name: "",
    description: "",
    productionDate: "",
    expirationDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const product = await getProductById(id);
        
        setForm({
          typeId: product.typeId?.toString() || "",
          name: product.name || product.Name || "",
          description: product.description || product.Description || "",
          productionDate: product.produced 
            ? new Date(product.produced).toISOString().split('T')[0]
            : "",
          expirationDate: product.expirationDate 
            ? new Date(product.expirationDate).toISOString().split('T')[0]
            : "",
        });
      } catch (err) {
        setError(err.message);
        alert("Failed to load product: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCancel() {
    navigate("/products");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.typeId) return alert("Select product type");
    if (!form.productionDate) return alert("Enter production date");
    if (!form.name) return alert("Enter product name");

    setSubmitting(true);

    try {
      await updateProduct({
        Id: parseInt(id),
        TypeId: parseInt(form.typeId),
        Name: form.name,
        Produced: new Date(form.productionDate).toISOString(),
        ExpirationDate: form.expirationDate 
          ? new Date(form.expirationDate).toISOString() 
          : null,
        Description: form.description || null,
      });

      alert("Product updated successfully!");
      navigate("/products");
    } catch (err) {
      setError(err.message);
      alert("Failed to update product: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || typesLoading) {
    return (
      <div className="edit-product-page">
        <div className="edit-card">
          <div className="loading-text">Loading product...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-page">
      <div className="edit-card">
        <h1 className="edit-title">Edit product</h1>

        {error && <div className="error-banner">{error}</div>}

        <form className="edit-form" onSubmit={handleSubmit}>
          <input
            className="edit-input"
            name="name"
            type="text"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            required
          />
          
          <select
            className="edit-input edit-select"
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
            className="edit-input edit-textarea"
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            rows="3"
          />

          <input
            className="edit-input"
            name="productionDate"
            type="date"
            placeholder="Production date"
            value={form.productionDate}
            onChange={handleChange}
          />

          <input
            className="edit-input"
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
              className="edit-btn" 
              type="submit"
              disabled={submitting || typesLoading}
            >
              {submitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
