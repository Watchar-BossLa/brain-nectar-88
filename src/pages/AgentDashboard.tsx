
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AgentSystemDashboard from '@/components/agents/AgentSystemDashboard';
import { useAuth } from '@/context/AuthContext';
import { Brain, Braces, Network } from 'lucide-react';

const AgentDashboard = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <motion.div 
        className="container mx-auto py-8 px-4 md:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">AI Agent System</h1>
            <span className="text-sm text-muted-foreground">
              User: {user?.email}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-primary" />
                  Master Control Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Coordinates specialized agents and orchestrates learning optimization based on your needs.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Network className="h-5 w-5 mr-2 text-primary" />
                  Agent Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Specialized agents work together to create a personalized learning experience tailored to your cognitive profile.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Braces className="h-5 w-5 mr-2 text-primary" />
                  Adaptive Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The system continuously learns from your interactions to optimize your study experience over time.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <AgentSystemDashboard />
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default AgentDashboard;
