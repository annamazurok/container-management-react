import { useState } from "react";
import "./ProductsPage.css";

export default function ProductsPage() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(2);

  const products = [
    {
      id: 1,
      type: "Red Wine",
      description: "An assortment of Cabernet, Merlot",
      units: 40,
    },
    {
      id: 2,
      type: "Cider",
      description: "Sparkling apple cider beverage",
      units: 10,
    },
    {
      id: 3,
      type: "Apple Juice",
      description: "Fresh pressed apple juice",
      units: 20,
    },
    {
      id: 4,
      type: "White Wine",
      description: "An assortment of Cabernet, Merlot",
      units: 40,
    },
  ];

  const filtered = products.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;

    return (
      p.type.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  function handleAdd() {
    alert("Open create product page (next step)");
  }

  function handleEdit(id) {
    alert("Edit product: " + id);
  }

  function handleDelete(id) {
    const ok = confirm("Delete product?");
    if (!ok) return;
    alert("Deleted product: " + id);
  }

  function goPrev() {
    if (page === 1) return;
    setPage(page - 1);
  }

  function goNext() {
    setPage(page + 1);
  }

  return (
    <div className="products-page">
      <div className="products-wrapper">
        <div className="top-bar">
          <div className="search-box">
            <img src="Search.svg" className="search-icon" alt="search" />

            <input
              className="search-input"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="add-product-btn" type="button" onClick={handleAdd}>
            + Add Product
          </button>
        </div>

        <div className="products-card">
          <h1 className="page-title">Products</h1>

          <div className="table">
            <div className="table-head">
              <div className="col type">Type</div>
              <div className="col desc">Description</div>
              <div className="col units">Units</div>
              <div className="col actions">Actions</div>
            </div>

            {filtered.map((item) => (
              <div
                key={item.id}
                className={
                  "table-row " + (selected === item.id ? "selected" : "")
                }
                onClick={() => setSelected(item.id)}
              >
                <div className="col type-value">{item.type}</div>
                <div className="col desc-value">{item.description}</div>

                <div className="col units">
                  <span className="units-badge">{item.units} units</span>
                </div>

                <div className="col actions">
                  <button
                    className="icon-btn"
                    type="button"
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item.id);
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
                      handleDelete(item.id);
                    }}
                  >
                    <img src="/trash.svg" alt="delete" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card-bottom">
            <div className="pagination">
              <button className="page-arrow" type="button" onClick={goPrev}>
                ‹
              </button>

              <button
                className={"page-btn " + (page === 1 ? "active" : "")}
                type="button"
                onClick={() => setPage(1)}
              >
                1
              </button>

              <button
                className={"page-btn " + (page === 2 ? "active" : "")}
                type="button"
                onClick={() => setPage(2)}
              >
                2
              </button>

              <button
                className={"page-btn " + (page === 3 ? "active" : "")}
                type="button"
                onClick={() => setPage(3)}
              >
                3
              </button>

              <button
                className={"page-btn " + (page === 4 ? "active" : "")}
                type="button"
                onClick={() => setPage(4)}
              >
                4
              </button>

              <span className="dots">…</span>

              <button
                className={"page-btn " + (page === 20 ? "active" : "")}
                type="button"
                onClick={() => setPage(20)}
              >
                20
              </button>

              <button className="page-arrow" type="button" onClick={goNext}>
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
