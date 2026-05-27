import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ContainerHistoryPage.css";
import { getContainerHistoryByContainerId } from "../../services/api/containerHistory";
import { getAllProducts } from "../../services/api/products";

export default function ContainerHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);

      try {
        const [historyData, productsData] = await Promise.all([
          getContainerHistoryByContainerId(id),
          getAllProducts()
        ]);
        console.log("Container History Data:", historyData);
        setHistory(historyData);
        setProducts(productsData);
      } catch (err) {
        setError(err.message || "Failed to load container history");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchHistory();
    }
  }, [id]);

  function handleBack() {
    navigate("/containers");
  }

  function getProductName(productId) {
    const product = products.find(p => p.id == productId);
    return product ? product.name : "-";
  }

  if (loading) {
    return (
      <div className="ch-history-page">
        <div className="ch-history-card">
          <div className="ch-loading-message">Loading history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ch-history-page">
        <div className="ch-history-card">
          <div className="ch-error-message">Error: {error}</div>
          <button className="ch-back-btn" type="button" onClick={handleBack}>
            ← Back to Containers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ch-history-page">
      <div className="ch-history-card">
        <button className="ch-back-btn" type="button" onClick={handleBack}>
          ← Back to Containers
        </button>

        <div className="ch-history-top">
          <h1 className="ch-history-title">History of Container Contents</h1>

          <button className="ch-dots-btn" type="button" title="More">
            <span className="ch-dot"></span>
            <span className="ch-dot"></span>
            <span className="ch-dot"></span>
          </button>
        </div>

        {history.length === 0 ? (
          <div className="ch-empty-state">No history records found for this container.</div>
        ) : (
          <div className="ch-history-table">
            <div className="ch-history-head">
              <div className="ch-col ch-no">No</div>
              <div className="ch-col ch-type">Action</div>
              <div className="ch-col ch-storage">Product</div>
              <div className="ch-col ch-desc">Description</div>
              <div className="ch-col ch-created">Record Created</div>
            </div>

            {history.map((record, index) => (
              <div
                key={record.id}
                className={"ch-history-row " + (selected === record.id ? "ch-selected" : "")}
                onClick={() => setSelected(record.id)}
              >
                <div className="ch-col ch-no ch-big">{String(index + 1).padStart(2, "0")}</div>
                <div className="ch-col ch-type ch-strong">{record.actionType || "Unknown"}</div>
                <div className="ch-col ch-storage ch-muted">{getProductName(record.productId)}</div>
                <div className="ch-col ch-desc ch-strong">{record.notes || "-"}</div>
                <div className="ch-col ch-created">
                  {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "-"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
