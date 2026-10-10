"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  Shield,
  Trash2,
  Edit,
  Sparkles,
  Send,
  UserCheck,
  UserX,
} from "lucide-react";

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<any>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("STUDENT");
  const [formDept, setFormDept] = useState("Environmental Engineering");
  const [formStudentId, setFormStudentId] = useState("");
  const [formStaffId, setFormStaffId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filterRole !== "ALL") queryParams.append("role", filterRole);
      if (searchQuery) queryParams.append("search", searchQuery);

      const res = await fetch(`/api/admin/users?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Fetch admin users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterRole, searchQuery]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          role: formRole,
          department: formDept,
          studentId: formStudentId,
          staffId: formStaffId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message);
        setTimeout(() => setToastMessage(""), 3500);
        setShowCreateModal(false);
        setFormName("");
        setFormEmail("");
        fetchUsers();
      }
    } catch (err) {
      console.error("Create user error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRoleStatus = async (userId: string, newRole?: string, isActive?: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole, isActive }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage("User role & access updated!");
        setTimeout(() => setToastMessage(""), 3000);
        setShowEditModal(null);
        fetchUsers();
      }
    } catch (err) {
      console.error("Update user error:", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this user from the system?")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setToastMessage("User deleted.");
        setTimeout(() => setToastMessage(""), 3000);
        fetchUsers();
      }
    } catch (err) {
      console.error("Delete user error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="ADMIN" size="sm" />
            <span className="text-xs text-purple-400 font-semibold bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">
              RBAC Governance
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            User Management & Role Access Control
            <Users className="h-5 w-5 text-purple-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Provision user accounts, assign roles (Student, Faculty, Admin, Maintenance), and audit permissions
          </p>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          variant="eco"
          size="sm"
          className="gap-2 shadow-lg shadow-emerald-600/20"
        >
          <PlusCircle className="h-4 w-4" />
          Create New User
        </Button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold text-center shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Filter className="h-3.5 w-3.5 text-purple-400" />
            Filter Role:
          </div>
          {["ALL", "STUDENT", "FACULTY", "ADMIN", "MAINTENANCE_STAFF"].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterRole === r
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {r === "ALL" ? "All Roles" : r.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name, email, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading user roster...</div>
      ) : users.length === 0 ? (
        <Card className="glass-card text-center p-8">
          <Users className="h-8 w-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No Users Found</p>
        </Card>
      ) : (
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">User Details</th>
                    <th className="py-3.5 px-4">Role Badge</th>
                    <th className="py-3.5 px-4">Department / ID</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Eco-Points</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-700 flex items-center justify-center font-bold text-white text-xs">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs">{u.name}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <RoleBadge role={u.role} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        <p className="text-slate-200 font-semibold">{u.department || "General Campus"}</p>
                        <p className="text-[10px] text-slate-400">{u.studentId || u.staffId || "ID: N/A"}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <UserCheck className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <UserX className="h-3 w-3" /> Suspended
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-amber-400">
                        {u.ecoPoints} PTS
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            onClick={() => setShowEditModal(u)}
                            variant="ghost"
                            size="sm"
                            className="p-1 text-slate-400 hover:text-purple-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(u.id)}
                            variant="ghost"
                            size="sm"
                            className="p-1 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-card border border-purple-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Create New User & Assign RBAC Role
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Maya Angelou"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. maya@greencampus.ai"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">System Role *</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none font-bold"
                  >
                    <option value="STUDENT">STUDENT (Eco Advocate)</option>
                    <option value="FACULTY">FACULTY (Researcher/Professor)</option>
                    <option value="MAINTENANCE_STAFF">MAINTENANCE_STAFF (Facilities Engineer)</option>
                    <option value="ADMIN">ADMIN (Executive Council)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Dept of Renewable Energy"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Student ID (If Student)</label>
                  <input
                    type="text"
                    placeholder="e.g. STU-90214"
                    value={formStudentId}
                    onChange={(e) => setFormStudentId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Staff ID (If Employee)</label>
                  <input
                    type="text"
                    placeholder="e.g. FAC-4012"
                    value={formStaffId}
                    onChange={(e) => setFormStaffId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="eco" disabled={submitting} className="text-xs gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? "Creating..." : "Create User Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role / Status Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-card border border-purple-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                Edit Role Access for {showEditModal.name}
              </h3>
              <button onClick={() => setShowEditModal(null)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select New System Role</label>
                <select
                  defaultValue={showEditModal.role}
                  id="edit-role-select"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none font-bold"
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="FACULTY">FACULTY</option>
                  <option value="MAINTENANCE_STAFF">MAINTENANCE_STAFF</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-semibold text-slate-200">Account Access Status</span>
                <button
                  type="button"
                  onClick={() => handleUpdateRoleStatus(showEditModal.id, undefined, !showEditModal.isActive)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs ${
                    showEditModal.isActive
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  {showEditModal.isActive ? "Suspend Account" : "Activate Account"}
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(null)} className="text-xs">
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="eco"
                  onClick={() => {
                    const sel = document.getElementById("edit-role-select") as HTMLSelectElement;
                    handleUpdateRoleStatus(showEditModal.id, sel.value);
                  }}
                  className="text-xs"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
