import { useState, useEffect, useMemo } from "react";
import "./ProductContainersPage.css";
import { getContainersByProduct } from "../../services/api/containers";
import { getProductById } from "../../services/api/products";
import { useContainerTypes } from "../../hooks/useContainerTypes";
import { useUnits } from "../../hooks/useUnits";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductContainersPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [apiContainers, setApiContainers] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { containerTypes, loading: typesLoading } = useContainerTypes();
  const { units, loading: unitsLoading } = useUnits();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const [containersData, productData] = await Promise.all([
          getContainersByProduct(id),
          getProductById(id),
        ]);
        
        setApiContainers(containersData);
        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const containers = useMemo(() => {
    if (typesLoading || unitsLoading) return [];
    
    return apiContainers.map((container) => {
      const type = containerTypes.find(t => t.id === container.typeId);
      const unit = units.find(u => u.id === container.unitId);
      
      return {
        id: container.id,
        code: container.code,
        type: type?.name || type?.Name || "Unknown",
        name: container.name || container.Name,
        volume: container.quantity && unit
          ? `${container.quantity} ${unit.title || unit.Title}` 
          : "-",
        state: container.status ?? "Default",
      };
    });
  }, [apiContainers, containerTypes, units, typesLoading, unitsLoading]);

  const getBadgeClass = (status) => {
    if (!status) return "empty";
    const normalizedStatus = String(status).toLowerCase();
    if (normalizedStatus === "active" || normalizedStatus === "1") return "filled";
    if (normalizedStatus === "inactive" || normalizedStatus === "default" || normalizedStatus === "0" || normalizedStatus === "2") return "empty";
    return normalizedStatus;
  };

  function handleBack() {
    navigate("/products");
  }

  if (loading || typesLoading || unitsLoading) {
    return (
      <div className="product-containers-page">
        <div className="pcp-page-card">
          <div className="pcp-loading-message">Loading containers...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-containers-page">
        <div className="pcp-page-card">
          <div className="pcp-error-message">Error: {error}</div>
          <button className="pcp-back-btn" onClick={handleBack}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const productName = product?.name || product?.Name || "Unknown Product";

  return (
    <div className="product-containers-page">
      <div className="pcp-page-card">
        <div className="pcp-card-header">
          <div className="pcp-header-content">
            <h1 className="pcp-page-title">Containers for: {productName}</h1>
            <p className="pcp-container-count">{containers.length} container{containers.length !== 1 ? 's' : ''} found</p>
          </div>
          <button className="pcp-back-btn" onClick={handleBack}>
            ← Back to Products
          </button>
        </div>

        {containers.length === 0 ? (
          <div className="pcp-empty-state">
            <div className="pcp-empty-icon">📦</div>
            <div className="pcp-empty-title">No containers found</div>
            <div className="pcp-empty-text">This product is not assigned to any containers yet.</div>
          </div>
        ) : (
          <div className="pcp-table">
            <div className="pcp-table-head">
              <div className="pcp-col">Code</div>
              <div className="pcp-col">Type</div>
              <div className="pcp-col">Name</div>
              <div className="pcp-col">Volume</div>
              <div className="pcp-col">State</div>
            </div>

            {containers.map((item) => (
              <div
                key={item.id}
                className={
                  "pcp-table-row " + (selected === item.id ? "pcp-selected" : "")
                }
                onClick={() => setSelected(item.id)}
              >
                <div className="pcp-col pcp-code">{item.code}</div>
                <div className="pcp-col">{item.type}</div>
                <div className="pcp-col pcp-name">{item.name}</div>
                <div className="pcp-col">{item.volume}</div>

                <div className="pcp-col">
                  <span className={"pcp-badge " + getBadgeClass(item.state)}>
                    {item.state}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
