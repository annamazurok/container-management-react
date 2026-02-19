import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ContainerDetailsPage.css";
import { getContainerById } from "../../services/api/containers";
import { getContainerTypeById } from "../../services/api/containerTypes";
import { getProductById } from "../../services/api/products";
import { getProductTypeById } from "../../services/api/productTypes";
import { getUnitById } from "../../services/api/units";

export default function ContainerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [container, setContainer] = useState(null);
  const [containerType, setContainerType] = useState(null);
  const [product, setProduct] = useState(null);
  const [productType, setProductType] = useState(null);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContainerDetails() {
      setLoading(true);
      setError(null);

      try {
        const containerData = await getContainerById(id);
        setContainer(containerData);

        // Fetch related data
        if (containerData.typeId) {
          const typeData = await getContainerTypeById(containerData.typeId);
          setContainerType(typeData);
        }

        if (containerData.productId) {
          const productData = await getProductById(containerData.productId);
          setProduct(productData);

          if (productData.typeId) {
            const productTypeData = await getProductTypeById(productData.typeId);
            setProductType(productTypeData);
          }
        }

        if (containerData.unitId) {
          const unitData = await getUnitById(containerData.unitId);
          setUnit(unitData);
        }
      } catch (err) {
        setError(err.message || "Failed to load container details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchContainerDetails();
    }
  }, [id]);

  function handleBack() {
    navigate("/containers");
  }

  function handleViewHistory() {
    navigate(`/containerhistory/${id}`);
  }

  if (loading) {
    return (
      <div className="container-details-page">
        <div className="container-details-wrapper">
          <div className="details-card">
            <div className="loading-message">Loading container details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-details-page">
        <div className="container-details-wrapper">
          <div className="details-card">
            <div className="error-message">Error: {error}</div>
            <button className="back-btn" type="button" onClick={handleBack}>
              ← Back to Containers
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!container) {
    return (
      <div className="container-details-page">
        <div className="container-details-wrapper">
          <div className="details-card">
            <div className="error-message">Container not found</div>
            <button className="back-btn" type="button" onClick={handleBack}>
              ← Back to Containers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const volumeDisplay = container.quantity && unit 
    ? `${container.quantity} ${unit.title || unit.Title}`
    : "-";

  const productName = product ? (product.name || product.Name) : "-";
  const productTypeTitle = productType ? (productType.title || productType.Title) : "-";

  return (
    <div className="container-details-page">
      <div className="container-details-wrapper">
        <button className="back-btn" type="button" onClick={handleBack}>
          ← Back to Containers
        </button>

        <div className="details-card">
          <div className="details-top">
            <div className="details-left">
              <div className="details-title-row">
                <h2 className="details-title">{container.code}</h2>
                <span className="details-status">{container.status || "Default"}</span>
              </div>

              <div className="details-info">
                <div><strong>Code:</strong> {container.code}</div>
                <div><strong>Type:</strong> {containerType?.name || containerType?.Name || "Unknown"}</div>
                <div><strong>Name:</strong> {container.name || container.Name}</div>
                <div><strong>Volume:</strong> {volumeDisplay}</div>
                <div><strong>Notes:</strong> {container.notes || "No notes"}</div>
              </div>
            </div>

            <div className="details-right">
              <div className="qr-box">
                <img src="/qr.png" alt="qr" />
              </div>
            </div>
          </div>

          <div className="details-actions">
            <button className="history-btn" type="button" onClick={handleViewHistory}>
              View history of container contents
            </button>
          </div>
        </div>

        {product && (
          <div className="details-card">
            <div className="content-head">
              <h2 className="content-title">{productName}</h2>

              <div className="content-label">
                <img src="/box.svg" alt="box" />
                Container Contents
              </div>
            </div>

            <div className="content-info">
              <div><strong>Category:</strong> {productTypeTitle}</div>
              <div><strong>Produced:</strong> {product.produced ? new Date(product.produced).toLocaleDateString() : "-"}</div>
              <div><strong>Description:</strong> {product.description || product.Description || "-"}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
