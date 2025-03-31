
import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Trash2, UserPlus } from 'lucide-react';

interface Admin {
  id: string;
  user_id: string;
  created_at: string;
  user_email: string;
  first_name?: string;
  last_name?: string;
}

export default function AdminAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newAdminEmail, setNewAdminEmail] = useState<string>('');
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [addingAdmin, setAddingAdmin] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    try {
      setLoading(true);
      
      // Get all admin user IDs
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (adminError) throw adminError;
      
      if (!adminData?.length) {
        setAdmins([]);
        return;
      }
      
      // Get all profile data for admin users
      const userIds = adminData.map(admin => admin.user_id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
        
      if (profileError) throw profileError;
      
      // Combine the data
      const combinedData = adminData.map(admin => {
        const profile = profileData?.find(p => p.id === admin.user_id);
        return {
          ...admin,
          user_email: profile?.email || 'Unknown email',
          first_name: profile?.first_name,
          last_name: profile?.last_name
        };
      });
      
      setAdmins(combinedData as Admin[]);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: "Error fetching admins",
        description: "Could not load admin data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function addAdmin() {
    try {
      setAddingAdmin(true);
      
      if (!newAdminEmail) {
        toast({
          title: "Missing email",
          description: "Please enter an email address.",
          variant: "destructive",
        });
        return;
      }
      
      // First check if user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newAdminEmail)
        .single();
      
      if (userError || !userData) {
        toast({
          title: "User not found",
          description: "No user with that email address was found.",
          variant: "destructive",
        });
        return;
      }
      
      // Check if already admin
      const { data: existingAdmin, error: existingError } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', userData.id)
        .single();
        
      if (existingAdmin) {
        toast({
          title: "Already admin",
          description: "This user is already an admin.",
          variant: "destructive",
        });
        return;
      }
      
      // Add as admin
      const { error: insertError } = await supabase
        .from('admins')
        .insert({
          user_id: userData.id
        });
        
      if (insertError) throw insertError;
      
      toast({
        title: "Admin added",
        description: `${newAdminEmail} has been added as an admin.`,
      });
      
      setNewAdminEmail('');
      setAddDialogOpen(false);
      fetchAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: "Error adding admin",
        description: "Could not add admin. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setAddingAdmin(false);
    }
  }

  async function removeAdmin(adminId: string, userEmail: string) {
    try {
      const confirmRemove = window.confirm(`Are you sure you want to remove admin access for ${userEmail}?`);
      
      if (!confirmRemove) return;
      
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', adminId);
        
      if (error) throw error;
      
      toast({
        title: "Admin removed",
        description: `Admin access removed for ${userEmail}.`,
      });
      
      fetchAdmins();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({
        title: "Error removing admin",
        description: "Could not remove admin. Please try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Admin Access Management</h2>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus size={16} />
              <span>Add Admin</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>
                Enter the email address of the user you want to grant admin access to.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addAdmin} disabled={addingAdmin}>
                {addingAdmin ? 'Adding...' : 'Add Admin'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>
            These users have full administrative access to the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Added On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading admins...
                  </TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No additional admins found
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.user_email}</TableCell>
                    <TableCell>
                      {admin.first_name && admin.last_name 
                        ? `${admin.first_name} ${admin.last_name}`
                        : "No name provided"}
                    </TableCell>
                    <TableCell>{new Date(admin.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeAdmin(admin.id, admin.user_email)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
