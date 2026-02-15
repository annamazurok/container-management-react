import "./ContainerDetailsPage.css";

export default function ContainerDetailsPage() {
  const container = {
    code: "TARA-12345",
    status: "IN USE",
    type: "Barrel",
    name: "Wine Barrel",
    volume: "200L",
    note: "You can store wine here",
  };

  const content = {
    title: "Red Wine",
    category: "Wine",
    date: "16.01.2025",
    description: "An assortment of cabernet, Merlot",
  };

  return (
    <div className="container-details-page">
      <div className="container-details-wrapper">
        <div className="details-card">
          <div className="details-top">
            <div className="details-left">
              <div className="details-title-row">
                <h2 className="details-title">{container.code}</h2>
                <span className="details-status">{container.status}</span>
              </div>

              <div className="details-info">
                <div>{container.code}</div>
                <div>{container.type}</div>
                <div>{container.name}</div>
                <div>{container.volume}</div>
                <div>{container.note}</div>
              </div>
            </div>

            <div className="details-right">
              <div className="qr-box">
                <img src="/qr.png" alt="qr" />
              </div>
            </div>
          </div>

          <div className="details-actions">
            <button className="history-btn" type="button">
              View history of container contents
            </button>
          </div>
        </div>

        <div className="details-card">
          <div className="content-head">
            <h2 className="content-title">{content.title}</h2>

            <div className="content-label">
              <img src="/box.svg" alt="box" />
              Container Contents
            </div>
          </div>

          <div className="content-info">
            <div>{content.category}</div>
            <div>{content.date}</div>
            <div>{content.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
