import { useState, useEffect, useCallback } from 'react';
import { adminGetUsers, adminUpdateUserRole } from '../../services/api';
import Swal from 'sweetalert2';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    adminGetUsers({ page, pageSize: 20 }).then(res => { setUsers(res.data.items); setTotal(res.data.totalCount); }).catch(() => {});
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleRoleChange = async (userId, newRole) => {
    const confirmResult = await Swal.fire({
      title: 'Xác nhận',
      text: `Xác nhận đổi vai trò thành ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    });
    if (!confirmResult.isConfirmed) return;
    try {
      await adminUpdateUserRole(userId, newRole);
      load();
    } catch (err) { Swal.fire('Lỗi', err.response?.data?.message || 'Lỗi cập nhật vai trò', 'error'); }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{total} người dùng</span>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Họ tên</th><th>Email</th><th>SĐT</th><th>Vai trò</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td style={{ fontWeight: 600 }}>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.phone || '—'}</td>
                <td>
                  <select 
                    className={`form-input status-badge ${u.role.toLowerCase()}`} 
                    style={{ padding: '4px 8px', fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
                    value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value)}
                  >
                    <option value="User">User</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 20 && (
        <div className="pagination" style={{ marginTop: 24 }}>
          {[...Array(Math.ceil(total / 20))].map((_, i) => (
            <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
