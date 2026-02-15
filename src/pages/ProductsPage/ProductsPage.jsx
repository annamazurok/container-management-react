import { useMemo, useState } from "react";
import "./ProductsPage.css";

export default function ProductsPage() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 6;

  const products = useMemo(
    () => [
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
        description: "An assortment of Chardonnay, Sauvignon Blanc",
        units: 40,
      },
      {
        id: 5,
        type: "Water",
        description: "Still water 0.5L",
        units: 10,
      },
      {
        id: 6,
        type: "Lemonade",
        description: "Homemade sparkling lemonade",
        units: 18,
      },
    ],
    [],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return products;

    return products.filter((p) => {
      return (
        p.type.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [products, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  function handleAdd() {
    alert("Open create product page");
  }

  function handleEdit(id) {
    alert("Edit product: " + id);
  }

  function handleDelete(id) {
    const ok = confirm("Delete product?");
    if (!ok) return;
    alert("Deleted product: " + id);
  }

  function handleView(id) {
    alert("View product: " + id);
  }

  function goPrev() {
    setPage((p) => Math.max(1, p - 1));
  }

  function goNext() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

  if (page > totalPages) setPage(totalPages);

  return (
    <div className="products-page">
      <div className="products-wrapper">
        <div className="products-card">
          <div className="card-top">
            <div className="top-bar">
              <div className="search-box">
                <img src="/Search.svg" className="search-icon" alt="search" />
                <input
                  className="search-input"
                  placeholder="Search products"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <button
                className="add-product-btn"
                type="button"
                onClick={handleAdd}
              >
                + Add Product
              </button>
            </div>
          </div>

          <div className="table">
            <div className="table-head">
              <div className="col type">Type</div>
              <div className="col desc">Description</div>
              <div className="col units">Units</div>
              <div className="col actions-head">Actions</div>
            </div>

            {pageItems.map((item) => (
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
                  <button
                    className="view-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(item.id);
                    }}
                  >
                    View
                  </button>
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

            {pageItems.length === 0 && (
              <div className="empty-state">No products found.</div>
            )}
          </div>

          <div className="card-bottom">
            <div className="pagination">
              <button
                className={"page-arrow " + (page === 1 ? "disabled" : "")}
                type="button"
                onClick={goPrev}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(0, 6)
                .map((p) => (
                  <button
                    key={p}
                    className={"page-btn " + (page === p ? "active" : "")}
                    type="button"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}

              {totalPages > 6 && <span className="dots">…</span>}

              {totalPages > 6 && (
                <button
                  className={
                    "page-btn " + (page === totalPages ? "active" : "")
                  }
                  type="button"
                  onClick={() => setPage(totalPages)}
                >
                  {totalPages}
                </button>
              )}

              <button
                className={
                  "page-arrow " + (page === totalPages ? "disabled" : "")
                }
                type="button"
                onClick={goNext}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
