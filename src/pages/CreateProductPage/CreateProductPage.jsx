import { useState } from "react";
import "./CreateProductPage.css";

export default function CreateProductPage() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    productionDate: "",
    expirationDate: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) return alert("Enter product name");
    if (!form.type.trim()) return alert("Enter product type");
    if (!form.productionDate.trim()) return alert("Enter production date");

    alert("Product created (next step: API)");

    setForm({
      name: "",
      type: "",
      description: "",
      productionDate: "",
      expirationDate: "",
    });
  }

  return (
    <div className="create-product-page">
      <div className="create-card">
        <h1 className="create-title">Create product</h1>

        <form className="create-form" onSubmit={handleSubmit}>
          <input
            className="create-input"
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            className="create-input"
            name="type"
            placeholder="Product type"
            value={form.type}
            onChange={handleChange}
          />

          <input
            className="create-input"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            className="create-input"
            name="productionDate"
            placeholder="Production date"
            value={form.productionDate}
            onChange={handleChange}
          />

          <input
            className="create-input"
            name="expirationDate"
            placeholder="Expiration/ control date"
            value={form.expirationDate}
            onChange={handleChange}
          />

          <button className="create-btn" type="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
