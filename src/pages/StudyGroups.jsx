import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/auth';
import { useStudyGroup } from '@/services/study-groups';
import { StudyGroupList, CreateGroupForm } from '@/components/study-groups';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, ArrowLeft } from 'lucide-react';

/**
 * Study Groups Page
 * @returns {React.ReactElement} Study groups page
 */
const StudyGroups = () => {
  const { user } = useAuth();
  const studyGroup = useStudyGroup();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('groups');
  
  // Handle create group
  const handleCreateGroup = () => {
    setShowCreateForm(true);
  };
  
  // Handle create success
  const handleCreateSuccess = (group) => {
    setShowCreateForm(false);
    // Could navigate to the new group page here
  };
  
  // Handle cancel create
  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Study Groups</h1>
              <p className="text-muted-foreground">
                Collaborate with others to enhance your learning experience
              </p>
            </div>
            <Button onClick={handleCreateGroup}>
              <UserPlus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
          
          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>My Groups</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Upcoming Sessions</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="groups">
              {showCreateForm ? (
                <div>
                  <Button 
                    variant="outline" 
                    className="mb-4"
                    onClick={handleCancelCreate}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Groups
                  </Button>
                  <CreateGroupForm 
                    onSuccess={handleCreateSuccess}
                    onCancel={handleCancelCreate}
                  />
                </div>
              ) : (
                <StudyGroupList onCreateGroup={handleCreateGroup} />
              )}
            </TabsContent>
            
            <TabsContent value="upcoming">
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Upcoming Sessions</h2>
                <p className="text-muted-foreground mb-4">
                  This feature is coming soon!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyGroups;
