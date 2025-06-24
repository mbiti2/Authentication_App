import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/services/api';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await authApi.getAdminDashboard();
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2 items-center">
          <Link to="/admin/register">
            <Button>Register New Admin</Button>
          </Link>
          <Button onClick={logout} variant="outline" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>
      
      {dashboardData ? (
        <div>
          <p className="mb-4 text-lg">User count: {dashboardData.user_count || 0}</p>
          {dashboardData.users && Array.isArray(dashboardData.users) ? (
            <div>
              <h2 className="text-xl font-semibold mb-3">All Users</h2>
              <ul className="space-y-2">
                {dashboardData.users.map((user: any) => (
                  <li key={user.id} className="border p-3 rounded-lg shadow-sm">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No users found or invalid data format</p>
          )}
        </div>
      ) : (
        <p>Loading dashboard...</p>
      )}
    </div>
  );
};

export default AdminDashboard;
