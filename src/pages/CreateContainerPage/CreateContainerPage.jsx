import { useState } from "react";
import "./CreateContainerPage.css";

export default function CreateContainerPage() {
  const [form, setForm] = useState({
    code: "",
    type: "",
    name: "",
    volume: "",
    status: "",
    product: "",
    processDate: "",
    processType: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.code.trim()) return alert("Enter container code");
    if (!form.type.trim()) return alert("Enter container type");
    if (!form.name.trim()) return alert("Enter name");
    if (!form.volume.trim()) return alert("Enter volume");

    alert("Container created (next step: API)");

    setForm({
      code: "",
      type: "",
      name: "",
      volume: "",
      status: "",
      product: "",
      processDate: "",
      processType: "",
    });
  }

  return (
    <div className="create-container-page">
      <div className="create-card">
        <h1 className="create-title">Create container</h1>

        <form className="create-form" onSubmit={handleSubmit}>
          <div className="create-row full">

            <input
              className="create-input"
              name="type"
              placeholder="Container type"
              value={form.type}
              onChange={handleChange}
            />
          </div>

          <input
            className="create-input full"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            className="create-input full"
            name="volume"
            placeholder="Volume"
            value={form.volume}
            onChange={handleChange}
          />

          <input
            className="create-input full"
            name="status"
            placeholder="Status"
            value={form.status}
            onChange={handleChange}
          />

          <input
            className="create-input full"
            name="product"
            placeholder="Product"
            value={form.product}
            onChange={handleChange}
          />

          <input
            className="create-input full"
            name="processDate"
            placeholder="Process date"
            value={form.processDate}
            onChange={handleChange}
          />

          <input
            className="create-input full"
            name="processType"
            placeholder="Process type"
            value={form.processType}
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
