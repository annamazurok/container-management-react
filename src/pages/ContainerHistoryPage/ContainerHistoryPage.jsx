import { useState } from "react";
import "./ContainerHistoryPage.css";

export default function ContainerHistoryPage() {
  const [selected, setSelected] = useState(null);

  const rows = [
    {
      id: 1,
      no: "01",
      type: "White Wine",
      date: "01.01.2024",
      storage: "01.02.2024 – 10.05.2024",
      desc: "Chardonnay, oak barrel aging",
      created: "01.01.2024 (Admin)",
      changed: "10.05.2024 (Operator)",
    },
    {
      id: 2,
      no: "02",
      type: "Cherry Compote",
      date: "01.07.2023",
      storage: "01.08.2023 – 31.12.2023",
      desc: "Compote from red cherries",
      created: "01.07.2023 (Admin)",
      changed: "10.05.2024 (Operator)",
    },
  ];

  return (
    <div className="history-page">
      <div className="history-card">
        <div className="history-top">
          <h1 className="history-title">History of Container Contents</h1>

          <button className="dots-btn" type="button" title="More">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </button>
        </div>

        <div className="history-table">
          <div className="history-head">
            <div className="col no">No</div>
            <div className="col type">Type</div>
            <div className="col date">Date</div>
            <div className="col storage">Storage period</div>
            <div className="col desc">Description</div>
            <div className="col created">Record Created</div>
            <div className="col changed">Last Change</div>
          </div>

          {rows.map((r) => (
            <div
              key={r.id}
              className={"history-row " + (selected === r.id ? "selected" : "")}
              onClick={() => setSelected(r.id)}
            >
              <div className="col no big">{r.no}</div>
              <div className="col type strong">{r.type}</div>
              <div className="col date">{r.date}</div>
              <div className="col storage muted">{r.storage}</div>
              <div className="col desc strong">{r.desc}</div>
              <div className="col created">{r.created}</div>
              <div className="col changed">{r.changed}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
