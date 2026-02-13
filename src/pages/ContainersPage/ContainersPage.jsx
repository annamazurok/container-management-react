import { useState } from "react";
import "./ContainersPage.css";

export default function ContainersPage() {
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState(""); // "" | "type" | "state" | "date"

  // ✅ Pagination
  const [page, setPage] = useState(2); // старт як на скріні (2)
  const pageSize = 6;

  const containers = [
    {
      id: 1,
      code: "TARA-12345",
      type: "Barrel",
      name: "Wine barrel",
      volume: "200 L",
      state: "Filled",
      product: "Red wine 2023",
      date: "15.01.2026",
    },
    {
      id: 2,
      code: "TARA-34526",
      type: "Container",
      name: "Plastic container",
      volume: "100 L",
      state: "Empty",
      product: "Apple juice",
      date: "-",
    },
    {
      id: 3,
      code: "TARA-09876",
      type: "Barrel",
      name: "Barrel number 3",
      volume: "150 L",
      state: "Filled",
      product: "Sour cherry compote",
      date: "-",
    },
    {
      id: 4,
      code: "TARA-43215",
      type: "Barrel",
      name: "Old barrel",
      volume: "300 L",
      state: "Filled",
      product: "White wine",
      date: "07.01.2026",
    },
    {
      id: 5,
      code: "TARA-56789",
      type: "Container",
      name: "Container number 2",
      volume: "125 L",
      state: "Empty",
      product: "Cherry juice",
      date: "-",
    },
    {
      id: 6,
      code: "TARA-34567",
      type: "Barrel",
      name: "Wine container",
      volume: "200 L",
      state: "Empty",
      product: "White wine",
      date: "-",
    },
  ];

  // НЕ міняю контейнерс — роблю копію і сортую
  let sorted = [...containers];

  if (sortBy === "type") {
    sorted.sort((a, b) => {
      if (a.type === "Barrel" && b.type !== "Barrel") return -1;
      if (a.type !== "Barrel" && b.type === "Barrel") return 1;
      return 0;
    });
  }

  if (sortBy === "state") {
    sorted.sort((a, b) => {
      if (a.state === "Filled" && b.state !== "Filled") return -1;
      if (a.state !== "Filled" && b.state === "Filled") return 1;
      return 0;
    });
  }

  if (sortBy === "date") {
    sorted.sort((a, b) => {
      const aHasDate = a.date !== "-";
      const bHasDate = b.date !== "-";

      if (aHasDate && !bHasDate) return -1;
      if (!aHasDate && bHasDate) return 1;
      return 0;
    });
  }

  // ✅ Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const paged = sorted.slice(start, end);

  function buildPages(current, total) {
    // показуємо: 1, (2..4 біля current), ..., total
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

    // прибираємо дублікати типу 1,1
    return result.filter((x, idx) => result.indexOf(x) === idx);
  }

  const pages = buildPages(safePage, totalPages);

  function handlePrev() {
    if (safePage === 1) return;
    setPage(safePage - 1);
  }

  function handleNext() {
    if (safePage === totalPages) return;
    setPage(safePage + 1);
  }

  // якщо змінився sort і сторінок стало менше — підрівняємо
  if (safePage !== page) {
    setPage(safePage);
  }

  return (
    <div className="containers-page">
      <div className="page-card">
        <div className="card-top">
          <div className="filters">
            <button
              className={"filter-pill " + (sortBy === "type" ? "active" : "")}
              type="button"
              onClick={() => setSortBy("type")}
            >
              Type <span className="pill-icon">⇅</span>
            </button>

            <button
              className={"filter-pill " + (sortBy === "state" ? "active" : "")}
              type="button"
              onClick={() => setSortBy("state")}
            >
              State <span className="pill-icon">⇅</span>
            </button>

            <button
              className={"filter-pill " + (sortBy === "date" ? "active" : "")}
              type="button"
              onClick={() => setSortBy("date")}
            >
              Date <span className="pill-icon">⇅</span>
            </button>

            <button className="add-btn" type="button">
              + Add Container
            </button>
          </div>
        </div>

        <div className="table">
          <div className="table-head">
            <div className="col">Code</div>
            <div className="col">Type</div>
            <div className="col">Name</div>
            <div className="col">Volume</div>
            <div className="col">State</div>
            <div className="col">Product/Last</div>
            <div className="col">Process date</div>
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
                <span
                  className={
                    "badge " + (item.state === "Filled" ? "filled" : "empty")
                  }
                >
                  {item.state}
                </span>
              </div>

              <div className="col">{item.product}</div>
              <div className="col">{item.date}</div>

              <div className="col actions">
                <button className="icon-btn" type="button" title="Edit">
                  <img src="/edit.svg" alt="edit" />
                </button>

                <button className="icon-btn" type="button" title="Delete">
                  <img src="/trash.svg" alt="delete" />
                </button>
              </div>
            </div>
          ))}
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
