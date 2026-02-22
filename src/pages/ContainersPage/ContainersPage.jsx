import { useEffect, useMemo, useState } from "react";
import "./ContainersPage.css";
import { useContainers } from "../../hooks/useContainers";
import { useContainerTypes } from "../../hooks/useContainerTypes";
import { useProducts } from "../../hooks/useProducts";
import { useUnits } from "../../hooks/useUnits";
import { deleteContainer } from "../../services/api/containers";
import { NavLink, useNavigate } from "react-router-dom";

export default function ContainersPage() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 6;

  const {
    containers: apiContainers,
    loading,
    error,
    refetch,
  } = useContainers();
  const { containerTypes, loading: typesLoading } = useContainerTypes();
  const { products, loading: productsLoading } = useProducts();
  const { units, loading: unitsLoading } = useUnits();

  const containers = useMemo(() => {
    if (typesLoading || productsLoading || unitsLoading) return [];

    return (apiContainers || []).map((container) => {
      const containerId = container.id ?? container.Id;

      const typeId = container.typeId ?? container.TypeId;
      const productId = container.productId ?? container.ProductId;
      const unitId = container.unitId ?? container.UnitId;

      const type = (containerTypes || []).find(
        (t) => (t.id ?? t.Id) === typeId,
      );

      const product = (products || []).find(
        (p) => (p.id ?? p.Id) === productId,
      );

      const unit = (units || []).find((u) => (u.id ?? u.Id) === unitId);

      let productDisplay = "-";
      if (product) {
        const productName = product.name ?? product.Name ?? "";
        productDisplay = productName.trim() ? productName.trim() : "-";
      }

      const qty = container.quantity ?? container.Quantity;

      return {
        id: containerId,
        code: container.code ?? container.Code ?? "-",
        type: type?.name ?? type?.Name ?? "Unknown",
        name: container.name ?? container.Name ?? "-",
        volume:
          qty != null && qty !== "" && unit
            ? `${qty} ${unit.title ?? unit.Title ?? ""}`.trim()
            : "-",
        state: container.status ?? container.Status ?? "Default",
        product: productDisplay,
      };
    });
  }, [
    apiContainers,
    containerTypes,
    products,
    units,
    typesLoading,
    productsLoading,
    unitsLoading,
  ]);

  const sorted = useMemo(() => {
    const list = [...containers];

    if (sortBy === "type-asc") {
      list.sort((a, b) => String(a.type).localeCompare(String(b.type)));
    }

    if (sortBy === "type-desc") {
      list.sort((a, b) => String(b.type).localeCompare(String(a.type)));
    }

    return list;
  }, [containers, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const paged = sorted.slice(start, end);

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

  const getBadgeClass = (status) => {
    if (!status) return "empty";
    const normalizedStatus = String(status).toLowerCase();

    if (normalizedStatus === "active" || normalizedStatus === "1")
      return "filled";

    if (
      normalizedStatus === "inactive" ||
      normalizedStatus === "default" ||
      normalizedStatus === "0" ||
      normalizedStatus === "2"
    )
      return "empty";

    return normalizedStatus;
  };

  function handlePrev() {
    if (safePage === 1) return;
    setPage(safePage - 1);
  }

  function handleNext() {
    if (safePage === totalPages) return;
    setPage(safePage + 1);
  }

  function handleTypeSort() {
    if (sortBy === "") setSortBy("type-asc");
    else if (sortBy === "type-asc") setSortBy("type-desc");
    else setSortBy("");
  }

  function handleDetails(id) {
    navigate(`/containerdetails/${id}`);
  }

  function handleViewHistory(id) {
    navigate(`/containerhistory/${id}`);
  }

  async function handleDelete(id) {
    if (deleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this container?",
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteContainer(id);
      await refetch();
      alert("Container deleted successfully!");
    } catch (err) {
      alert("Failed to delete container: " + (err?.message || "Unknown error"));
    } finally {
      setDeleting(false);
    }
  }

  if (loading || typesLoading || productsLoading || unitsLoading) {
    return (
      <div className="containers-page">
        <div className="page-card">
          <div className="loading-message">Loading containers...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="containers-page">
        <div className="page-card">
          <div className="error-message">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="containers-page">
      <div className="page-card">
        <div className="card-top">
          <div className="filters">
            <button
              className={
                "filter-pill " + (sortBy.startsWith("type") ? "active" : "")
              }
              type="button"
              onClick={handleTypeSort}
            >
              Type <span className="pill-icon">⇅</span>
            </button>

            <NavLink className="add-link" to="/containers/new">
              <div className="add-btn">+ Add Container</div>
            </NavLink>
          </div>
        </div>

        <div className="table desktop-only">
          <div className="table-head">
            <div className="col">Code</div>
            <div className="col">Type</div>
            <div className="col">Name</div>
            <div className="col">Volume</div>
            <div className="col">State</div>
            <div className="col">Product/Last</div>
            <div className="col actions"></div>
          </div>

          {paged.map((item) => (
            <div
              key={item.id}
              className={
                "table-row " + (selected === item.id ? "selected" : "")
              }
              onClick={() => setSelected(item.id)}
            >
              <div className="col code">{item.code}</div>
              <div className="col">{item.type}</div>
              <div className="col name">{item.name}</div>
              <div className="col">{item.volume}</div>

              <div className="col">
                <span className={"badge " + getBadgeClass(item.state)}>
                  {item.state}
                </span>
              </div>

              <div className="col">{item.product}</div>

              <div className="col actions">
                <button
                  className="icon-btn"
                  type="button"
                  title="Details"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDetails(item.id);
                  }}
                >
                  <img src="/edit.svg" alt="details" />
                </button>

                <button
                  className="icon-btn"
                  type="button"
                  title="View History"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewHistory(item.id);
                  }}
                >
                  <img src="/box.svg" alt="history" />
                </button>

                <button
                  className="icon-btn"
                  type="button"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  disabled={deleting}
                >
                  <img src="/trash.svg" alt="delete" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mobile-only">
          <div className="cards">
            {paged.map((item) => (
              <div
                key={item.id}
                className={
                  "container-card " + (selected === item.id ? "selected" : "")
                }
                onClick={() => setSelected(item.id)}
              >
                <div className="container-card-top">
                  <div className="container-title">
                    <div className="code-strong">{item.code}</div>
                    <div className="type-soft">{item.type}</div>
                  </div>

                  <span className={"badge " + getBadgeClass(item.state)}>
                    {item.state}
                  </span>
                </div>

                <div className="container-name">{item.name}</div>

                <div className="container-pills">
                  <span className="meta-pill">Vol: {item.volume}</span>
                  <span className="meta-pill meta-strong">{item.product}</span>
                </div>

                <div className="container-actions">
                  <button
                    className="icon-btn"
                    type="button"
                    title="Details"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetails(item.id);
                    }}
                  >
                    <img src="/edit.svg" alt="details" />
                  </button>

                  <button
                    className="icon-btn"
                    type="button"
                    title="View History"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewHistory(item.id);
                    }}
                  >
                    <img src="/box.svg" alt="history" />
                  </button>

                  <button
                    className="icon-btn"
                    type="button"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    disabled={deleting}
                  >
                    <img src="/trash.svg" alt="delete" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}
