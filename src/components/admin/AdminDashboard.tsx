
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/integrations/supabase/client';

export default function AdminDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPayments: 0,
    revenueTotal: 0,
  });

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        setLoading(true);
        
        // Get total users count
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        // For demonstration - in a real app you would have more accurate stats
        const activeUsers = Math.floor(totalUsers * 0.7); // Simulated active users
        
        // Example stats - replace with real payment data when implemented
        const totalPayments = 0;
        const revenueTotal = 0;
        
        setStats({
          totalUsers: totalUsers || 0,
          activeUsers,
          totalPayments,
          revenueTotal
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="Registered accounts"
          loading={loading}
        />
        
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          description="Last 30 days"
          loading={loading}
        />
        
        <StatCard
          title="Payments"
          value={stats.totalPayments}
          description="Total transactions"
          loading={loading}
        />
        
        <StatCard
          title="Revenue"
          value={`$${stats.revenueTotal.toFixed(2)}`}
          description="Total earnings"
          loading={loading}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  loading?: boolean;
}

function StatCard({ title, value, description, loading = false }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <CardDescription>{description}</CardDescription>
          </>
        )}
      </CardContent>
    </Card>
  );
}
