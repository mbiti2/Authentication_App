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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-blue-300 to-blue-900">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Admin Dashboard</h1>
          <div className="flex gap-2 items-center">
            <Link to="/admin/register">
              <Button className="rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-6 shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
                Register New Admin
              </Button>
            </Link>
            <Button onClick={logout} variant="outline" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
        
        {dashboardData ? (
          <div>
            <p className="mb-4 text-lg text-blue-900">User count: {dashboardData.user_count || 0}</p>
            {dashboardData.users && Array.isArray(dashboardData.users) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Admin Users */}
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-blue-700">Admin Users</h2>
                  <ul className="space-y-4">
                    {dashboardData.users.filter((u: any) => u.role === 'Admin').length === 0 && (
                      <li className="bg-white/80 rounded-2xl shadow-xl p-6 text-center text-blue-700">No admin users found</li>
                    )}
                    {dashboardData.users.filter((u: any) => u.role === 'Admin').map((user: any) => (
                      <li key={user.id} className="bg-gradient-to-r from-blue-400 to-blue-700 rounded-2xl shadow-xl p-6 text-white">
                        <p className="font-bold text-lg">{user.first_name} {user.last_name}</p>
                        <p className="text-blue-100">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-900/80 rounded-full text-xs font-semibold">{user.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Regular Users */}
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-blue-700">Regular Users</h2>
                  <ul className="space-y-4">
                    {dashboardData.users.filter((u: any) => u.role !== 'Admin').length === 0 && (
                      <li className="bg-white/80 rounded-2xl shadow-xl p-6 text-center text-blue-700">No regular users found</li>
                    )}
                    {dashboardData.users.filter((user: any) => user.role !== 'Admin').map((user: any) => (
                      <li key={user.id} className="bg-white/80 rounded-2xl shadow-xl p-6">
                        <p className="font-bold text-lg text-blue-900">{user.first_name} {user.last_name}</p>
                        <p className="text-blue-700">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-200 rounded-full text-xs font-semibold text-blue-900">{user.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-blue-700">No users found or invalid data format</p>
            )}
          </div>
        ) : (
          <p className="text-blue-700">Loading dashboard...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
