
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/auth';
import MainLayout from '@/components/layout/MainLayout';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminPayments from '@/components/admin/AdminPayments';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminAdmins from '@/components/admin/AdminAdmins';

export default function AdminPage() {
  const { user, isAdmin, isPlatformOwner } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  useEffect(() => {
    // Restrict access to admin users only
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this area.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, isAdmin, navigate, toast]);

  if (!user || !isAdmin) {
    return null; // Don't render anything if not admin
  }

  return (
    <MainLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Control Panel</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            {isPlatformOwner && (
              <TabsTrigger value="admins">Admin Access</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>
          
          <TabsContent value="payments">
            <AdminPayments />
          </TabsContent>
          
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
          
          {isPlatformOwner && (
            <TabsContent value="admins">
              <AdminAdmins />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
}
