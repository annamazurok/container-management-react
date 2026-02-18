import { useMemo, useState } from "react";
import "./UsersPage.css";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(2);
  const [selected, setSelected] = useState(null);

  const pageSize = window.innerWidth <= 900 ? 4 : 6;

  const users = useMemo(
    () => [
      {
        id: 1,
        name: "Anna Mazurok",
        email: "annamazurok@gmail.com",
        role: "Admin",
        status: "Approved",
      },
      {
        id: 2,
        name: "Samantha Verdoes",
        email: "samanthaverdoes@gmail.com",
        role: "Operator",
        status: "Pending",
      },
      {
        id: 3,
        name: "Roman Nikitchuk",
        email: "romannikitchuk@gmail.com",
        role: "Operator",
        status: "Pending",
      },
      {
        id: 4,
        name: "Natalia Radchuk",
        email: "nataliaradchuk@gmail.com",
        role: "Operator",
        status: "Pending",
      },
    ],
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const paged = filtered.slice(start, end);

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

  function handlePrev() {
    if (safePage === 1) return;
    setPage(safePage - 1);
  }

  function handleNext() {
    if (safePage === totalPages) return;
    setPage(safePage + 1);
  }

  function getRowNo(index) {
    const no = (safePage - 1) * pageSize + index + 1;
    return String(no).padStart(2, "0");
  }

  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
  }

  function handleAdd() {
    alert("Open create users page");
  }

  function handleEdit(id) {
    alert("Edit user: " + id);
  }

  function handleDelete(id) {
    const ok = confirm("Delete user?");
    if (!ok) return;
    alert("Deleted user: " + id);
  }

  if (safePage !== page) setPage(safePage);

  return (
    <div className="users-page">
      <div className="page-card">
        <div className="users-top">
          <div className="search-wrap">
            <img src="/Search.svg" alt="search" />
            <input
              className="search-input"
              type="text"
              placeholder="Search users"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <button className="add-users-btn" type="button" onClick={handleAdd}>
            + Add Users
          </button>
        </div>

        <div className="table desktop-only">
          <div className="table-head users-grid">
            <div className="col">No</div>
            <div className="col">User Name</div>
            <div className="col">Email</div>
            <div className="col">Role</div>
            <div className="col">Status</div>
            <div className="col actions"></div>
          </div>

          {paged.map((u, idx) => (
            <div
              key={u.id}
              className={
                "table-row users-grid " + (selected === u.id ? "selected" : "")
              }
              onClick={() => setSelected(u.id)}
            >
              <div className="col no">{getRowNo(idx)}</div>

              <div className="col user-name">{u.name}</div>

              <div className="col">{u.email}</div>

              <div className="col">
                <span
                  className={
                    "role-badge " + (u.role === "Admin" ? "admin" : "operator")
                  }
                >
                  {u.role}
                </span>
              </div>

              <div className="col">
                <span
                  className={
                    "status-badge " +
                    (u.status === "Approved" ? "approved" : "pending")
                  }
                >
                  {u.status}
                </span>
              </div>

              <div className="col actions">
                <button
                  className="icon-btn"
                  type="button"
                  title="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(u.id);
                  }}
                >
                  <img src="/edit.svg" alt="edit" />
                  <span className="btn-text"></span>
                </button>

                <button
                  className="icon-btn"
                  type="button"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(u.id);
                  }}
                >
                  <img src="/trash.svg" alt="delete" />
                  <span className="btn-text"></span>
                </button>
              </div>
            </div>
          ))}

          {paged.length === 0 && (
            <div className="empty-state">No users found.</div>
          )}
        </div>

        <div className="mobile-only">
          <div className="cards">
            {paged.map((u, idx) => (
              <div
                key={u.id}
                className={"user-card " + (selected === u.id ? "selected" : "")}
                onClick={() => setSelected(u.id)}
              >
                <div className="user-card-top">
                  <div className="user-title">
                    <div className="user-no">{getRowNo(idx)}</div>
                    <div className="user-name-mobile">{u.name}</div>
                  </div>

                  <span
                    className={
                      "status-badge " +
                      (u.status === "Approved" ? "approved" : "pending")
                    }
                  >
                    {u.status}
                  </span>
                </div>

                <div className="user-email">{u.email}</div>

                <div className="user-pills">
                  <span
                    className={
                      "role-pill " + (u.role === "Admin" ? "admin" : "operator")
                    }
                  >
                    {u.role}
                  </span>

                  <span
                    className={
                      "status-pill " +
                      (u.status === "Approved" ? "approved" : "pending")
                    }
                  >
                    {u.status}
                  </span>
                </div>

                <div className="user-actions">
                  <button
                    className="icon-btn only-ico"
                    type="button"
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(u.id);
                    }}
                  >
                    <img src="/edit.svg" alt="edit" />
                  </button>

                  <button
                    className="icon-btn only-ico"
                    type="button"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(u.id);
                    }}
                  >
                    <img src="/trash.svg" alt="delete" />
                  </button>
                </div>
              </div>
            ))}

            {paged.length === 0 && (
              <div className="empty-state">No users found.</div>
            )}
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
