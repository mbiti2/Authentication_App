import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await authApi.getAdminDashboard(token!);
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch admin dashboard");
      }
    };

    fetchDashboard();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {dashboardData ? (
        <div>
          <p className="mb-2">User count: {dashboardData.user_count}</p>
          <ul className="space-y-2">
            {dashboardData.users.map((user: any) => (
              <li key={user.id} className="border p-2 rounded">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading dashboard...</p>
      )}
    </div>
  );
};

export default AdminDashboard;
