import { useMemo, useState, useEffect } from "react";
import "./UsersPage.css";
import { useUsers } from "../../hooks/useUsers";
import { useRoles } from "../../hooks/useRoles";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    fathersName: "",
    email: "",
    roleId: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { users, loading, error, createUser, updateUser, confirmUser, deleteUser, refetch } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    function onResize() {
      const mobile = window.innerWidth <= 900;
      setIsMobile((prev) => {
        if (prev !== mobile) {
          setPage(1);
        }
        return mobile;
      });
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pageSize = isMobile ? 4 : 6;

  // Create a map of roleId to role name
  const rolesMap = useMemo(() => {
    const map = new Map();
    (roles || []).forEach((r) => map.set(r.id, r.name || r.title));
    return map;
  }, [roles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const fullName = `${u.name || ""} ${u.surname || ""} ${u.fathersName || ""}`.toLowerCase();
      return (
        fullName.includes(q) || 
        (u.email || "").toLowerCase().includes(q)
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
    setEditingUser(null);
    setFormData({
      name: "",
      surname: "",
      fathersName: "",
      email: "",
      roleId: roles.length > 0 ? roles[0].id : "",
    });
    setFormError("");
    setShowModal(true);
  }

  function handleEdit(user) {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      surname: user.surname || "",
      fathersName: user.fathersName || "",
      email: user.email || "",
      roleId: user.roleId || "",
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleDelete(id) {
    const ok = confirm("Are you sure you want to delete this user?");
    if (!ok) return;
    
    const result = await deleteUser(id);
    if (!result.success) {
      alert("Error deleting user: " + result.error);
    }
  }

  async function handleConfirm(id) {
    const result = await confirmUser(id);
    if (!result.success) {
      alert("Error confirming user: " + result.error);
    } else {
      await refetch();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.surname.trim() || !formData.email.trim() || !formData.roleId) {
      setFormError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      let result;
      if (editingUser) {
        result = await updateUser({
          id: editingUser.id,
          ...formData,
        });
      } else {
        result = await createUser(formData);
      }

      if (result.success) {
        setShowModal(false);
        setFormData({
          name: "",
          surname: "",
          fathersName: "",
          email: "",
          roleId: "",
        });
      } else {
        setFormError(result.error || "An error occurred");
      }
    } catch (err) {
      setFormError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCloseModal() {
    if (submitting) return;
    setShowModal(false);
    setFormError("");
  }

  function getFullName(user) {
    const parts = [user.name, user.surname].filter(Boolean);
    return parts.join(" ") || "N/A";
  }

  function getUserStatus(user) {
    return user.confirmed ? "Approved" : "Pending";
  }

  if (safePage !== page) setPage(safePage);

  if (loading || rolesLoading) {
    return (
      <div className="up-users-page">
        <div className="up-page-card">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="up-users-page">
        <div className="up-page-card">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="up-users-page">
      <div className="up-page-card">
        <div className="up-users-top">
          <div className="up-search-wrap">
            <img src="/Search.svg" alt="search" />
            <input
              className="up-search-input"
              type="text"
              placeholder="Search users"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <button className="up-add-users-btn" type="button" onClick={handleAdd}>
            + Add Users
          </button>
        </div>

        <div className="up-table up-desktop-only">
          <div className="up-table-head up-users-grid">
            <div className="up-col">No</div>
            <div className="up-col">User Name</div>
            <div className="up-col">Email</div>
            <div className="up-col">Role</div>
            <div className="up-col">Status</div>
            <div className="up-col up-actions"></div>
          </div>

          {paged.map((u, idx) => (
            <div
              key={u.id}
              className={
                "up-table-row up-users-grid " + (selected === u.id ? "up-selected" : "")
              }
              onClick={() => setSelected(u.id)}
            >
              <div className="up-col up-no">{getRowNo(idx)}</div>

              <div className="up-col up-user-name">{getFullName(u)}</div>

              <div className="up-col">{u.email}</div>

              <div className="up-col">
                <span className="up-role-badge">
                  {rolesMap.get(u.roleId) || "Unknown"}
                </span>
              </div>

              <div className="up-col">
                <span
                  className={
                    "up-status-badge " +
                    (getUserStatus(u) === "Approved" ? "up-approved" : "up-pending")
                  }
                >
                  {getUserStatus(u)}
                </span>
              </div>

              <div className="up-col up-actions">
                {getUserStatus(u) === "Pending" && (
                  <button
                    className="up-icon-btn"
                    type="button"
                    title="Approve"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirm(u.id);
                    }}
                  >
                    <img src="/check.svg" alt="approve" />
                    <span className="up-btn-text"></span>
                  </button>
                )}
                
                <button
                  className="up-icon-btn"
                  type="button"
                  title="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(u);
                  }}
                >
                  <img src="/edit.svg" alt="edit" />
                  <span className="up-btn-text"></span>
                </button>

                <button
                  className="up-icon-btn"
                  type="button"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(u.id);
                  }}
                >
                  <img src="/trash.svg" alt="delete" />
                  <span className="up-btn-text"></span>
                </button>
              </div>
            </div>
          ))}

          {paged.length === 0 && (
            <div className="up-empty-state">No users found.</div>
          )}
        </div>

        <div className="up-mobile-only">
          <div className="up-cards">
            {paged.map((u, idx) => (
              <div
                key={u.id}
                className={"up-user-card " + (selected === u.id ? "up-selected" : "")}
                onClick={() => setSelected(u.id)}
              >
                <div className="up-user-card-top">
                  <div className="up-user-title">
                    <div className="up-user-no">{getRowNo(idx)}</div>
                    <div className="up-user-name-mobile">{getFullName(u)}</div>
                  </div>

                  <span
                    className={
                      "up-status-badge " +
                      (getUserStatus(u) === "Approved" ? "up-approved" : "up-pending")
                    }
                  >
                    {getUserStatus(u)}
                  </span>
                </div>

                <div className="up-user-email">{u.email}</div>

                <div className="up-user-pills">
                  <span className="up-role-pill">
                    {rolesMap.get(u.roleId) || "Unknown"}
                  </span>

                  <span
                    className={
                      "status-pill " +
                      (getUserStatus(u) === "Approved" ? "approved" : "pending")
                    }
                  >
                    {getUserStatus(u)}
                  </span>
                </div>

                <div className="up-user-actions">
                  {getUserStatus(u) === "Pending" && (
                    <button
                      className="up-icon-btn up-only-ico"
                      type="button"
                      title="Approve"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirm(u.id);
                      }}
                    >
                      <img src="/check.svg" alt="approve" />
                    </button>
                  )}
                  
                  <button
                    className="up-icon-btn up-only-ico"
                    type="button"
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(u);
                    }}
                  >
                    <img src="/edit.svg" alt="edit" />
                  </button>

                  <button
                    className="up-icon-btn up-only-ico"
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
              <div className="up-empty-state">No users found.</div>
            )}
          </div>
        </div>

        <div className="up-card-bottom">
          <div className="up-pagination">
            <button
              className={"up-page-arrow " + (safePage === 1 ? "up-disabled" : "")}
              type="button"
              onClick={handlePrev}
            >
              ‹
            </button>

            {pages.map((p, idx) =>
              p === "dots" ? (
                <span className="up-dots" key={"d" + idx}>
                  …
                </span>
              ) : (
                <button
                  key={p}
                  className={"up-page-btn " + (p === safePage ? "up-active" : "")}
                  type="button"
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ),
            )}

            <button
              className={
                "up-page-arrow " + (safePage === totalPages ? "up-disabled" : "")
              }
              type="button"
              onClick={handleNext}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="up-modal-overlay" onClick={handleCloseModal}>
          <div className="up-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="up-modal-header">
              <h2>{editingUser ? "Edit User" : "Add New User"}</h2>
              <button className="up-modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="up-form-group">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                  disabled={submitting}
                />
              </div>

              <div className="up-form-group">
                <label htmlFor="surname">Surname *</label>
                <input
                  id="surname"
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  placeholder="Enter surname"
                  disabled={submitting}
                />
              </div>

              <div className="up-form-group">
                <label htmlFor="fathersName">Father's Name</label>
                <input
                  id="fathersName"
                  type="text"
                  value={formData.fathersName}
                  onChange={(e) => setFormData({ ...formData, fathersName: e.target.value })}
                  placeholder="Enter father's name"
                  disabled={submitting}
                />
              </div>

              <div className="up-form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  disabled={submitting}
                />
              </div>

              <div className="up-form-group">
                <label htmlFor="roleId">Role *</label>
                <select
                  id="roleId"
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: parseInt(e.target.value) })}
                  disabled={submitting}
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name || role.title}
                    </option>
                  ))}
                </select>
              </div>

              {formError && <div className="up-form-error">{formError}</div>}

              <div className="up-modal-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="up-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="up-btn-submit"
                >
                  {submitting ? "Saving..." : editingUser ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
