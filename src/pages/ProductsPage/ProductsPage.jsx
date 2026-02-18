import { useMemo, useState } from "react";
import "./ProductsPage.css";
import { useProducts } from "../../hooks/useProducts";
import { useProductTypes } from "../../hooks/useProductTypes";
import { deleteProduct } from "../../services/api/products";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);

  const pageSize = 6;

  const { products: apiProducts, loading, error, refetch } = useProducts();
  const { productTypes, loading: typesLoading } = useProductTypes();

  const products = useMemo(() => {
    if (typesLoading) return [];

    return apiProducts.map((product) => {
      const type = productTypes.find((t) => t.id === product.typeId);

      return {
        id: product.id,
        name: product.name || product.Name,
        type: type?.title || type?.Title || "Unknown",
        description: product.description || product.Description || "-",
        produced: product.produced,
        expirationDate: product.expirationDate,
      };
    });
  }, [apiProducts, productTypes, typesLoading]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return products;

    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
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
    navigate(`/products/edit/${id}`);
  }

  async function handleDelete(id) {
    if (deleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteProduct(id);
      await refetch();
      alert("Product deleted successfully!");
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    } finally {
      setDeleting(false);
    }
  }

  function handleView(id) {
    navigate(`/products/${id}/containers`);
  }

  function goPrev() {
    setPage((p) => Math.max(1, p - 1));
  }

  function goNext() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

  if (page > totalPages) setPage(totalPages);

  if (loading || typesLoading) {
    return (
      <div className="products-page">
        <div className="products-wrapper">
          <div className="products-card">
            <div className="loading-message">Loading products...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="products-wrapper">
          <div className="products-card">
            <div className="error-message">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

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

          <div className="table desktop-only">
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

          <div className="mobile-only">
            <div className="cards">
              {pageItems.map((item) => (
                <div
                  key={item.id}
                  className={
                    "product-card " + (selected === item.id ? "selected" : "")
                  }
                  onClick={() => setSelected(item.id)}
                >
                  <div className="product-card-top">
                    <div className="product-title">{item.type}</div>
                    <span className="units-pill">{item.units} units</span>
                  </div>

                  <div className="product-desc">{item.description}</div>

                  <div className="product-actions">
                    <button
                      className="btn-soft"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(item.id);
                      }}
                    >
                      View
                    </button>

                    <div className="action-icons">
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
                </div>
              ))}

              {pageItems.length === 0 && (
                <div className="empty-state">No products found.</div>
              )}
            </div>
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
