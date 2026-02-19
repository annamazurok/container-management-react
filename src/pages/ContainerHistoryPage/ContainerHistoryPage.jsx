import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ContainerHistoryPage.css";
import { getContainerHistoryByContainerId } from "../../services/api/containerHistory";

export default function ContainerHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);

      try {
        const data = await getContainerHistoryByContainerId(id);
        setHistory(data);
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

  if (loading) {
    return (
      <div className="history-page">
        <div className="history-card">
          <div className="loading-message">Loading history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page">
        <div className="history-card">
          <div className="error-message">Error: {error}</div>
          <button className="back-btn" type="button" onClick={handleBack}>
            ← Back to Containers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-card">
        <button className="back-btn" type="button" onClick={handleBack}>
          ← Back to Containers
        </button>

        <div className="history-top">
          <h1 className="history-title">History of Container Contents</h1>

          <button className="dots-btn" type="button" title="More">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </button>
        </div>

        {history.length === 0 ? (
          <div className="empty-state">No history records found for this container.</div>
        ) : (
          <div className="history-table">
            <div className="history-head">
              <div className="col no">No</div>
              <div className="col type">Action</div>
              <div className="col date">Date</div>
              <div className="col storage">Product</div>
              <div className="col desc">Description</div>
              <div className="col created">Record Created</div>
              <div className="col changed">Last Change</div>
            </div>

            {history.map((record, index) => (
              <div
                key={record.id}
                className={"history-row " + (selected === record.id ? "selected" : "")}
                onClick={() => setSelected(record.id)}
              >
                <div className="col no big">{String(index + 1).padStart(2, "0")}</div>
                <div className="col type strong">{record.actionType || "Unknown"}</div>
                <div className="col date">
                  {record.actionDate ? new Date(record.actionDate).toLocaleDateString() : "-"}
                </div>
                <div className="col storage muted">{record.productId || "-"}</div>
                <div className="col desc strong">{record.notes || "-"}</div>
                <div className="col created">
                  {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "-"}
                </div>
                <div className="col changed">
                  {record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : "-"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
