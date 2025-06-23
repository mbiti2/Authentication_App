
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <Button onClick={logout} variant="outline" className="flex items-center gap-2">
            <LogOut size={16} />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <User size={32} className="text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user.full_name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail size={16} />
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">Account Status</h3>
                <Badge variant={user.is_active ? "default" : "secondary"} className="flex items-center gap-1 w-fit">
                  <Shield size={14} />
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">Member Since</h3>
                <p className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-700 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">User ID</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {user.id}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Full Name</span>
                  <span>{user.full_name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Email Address</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Account Status</span>
                  <Badge variant={user.is_active ? "default" : "secondary"}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Your session will expire after 10 minutes of inactivity</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
