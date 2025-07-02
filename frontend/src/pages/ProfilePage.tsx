import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Mail, Calendar, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-900 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-blue-900">Profile</h1>
          <Button onClick={logout} variant="outline" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
            <LogOut size={16} />
            Logout
          </Button>
        </div>
        {/* Admin dashboard button for admin users */}
        {user.role === 'Admin' && (
          <div className="mb-6 flex justify-end">
            <a href="/admin" className="rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-6 shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200">Go to Admin Dashboard</a>
          </div>
        )}

        <Card className="shadow-xl rounded-2xl backdrop-blur bg-white/80">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-700 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-blue-900">{user.first_name} {user.last_name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1 text-blue-700">
                  <Mail size={16} />
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-900">Role</h3>
                <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded text-blue-900">{user.role}</span>
              </div>
            </div>
            <div className="border-t pt-6">
              <h3 className="font-semibold text-blue-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-blue-700">Full Name</span>
                  <span>{user.first_name} {user.last_name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-blue-700">Email Address</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-blue-700">Role</span>
                  <span>{user.role}</span>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-6 shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
                  Edit Profile
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-blue-200">
          <p>Your session will expire after 10 minutes of inactivity</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
