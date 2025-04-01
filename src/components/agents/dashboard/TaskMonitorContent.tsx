
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { taskMonitor, TaskProcessingRecord, TaskProcessingStats } from '@/services/agents/monitoring/taskMonitor';

export function TaskMonitorContent() {
  const [taskRecords, setTaskRecords] = useState<TaskProcessingRecord[]>([]);
  const [stats, setStats] = useState<TaskProcessingStats | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Refresh task data periodically
  useEffect(() => {
    const fetchData = () => {
      // In a real implementation, we would fetch the actual data
      // For now, we'll use dummy data
      const records = Array.from(taskMonitor.getProcessingStats() 
        ? [] // Replace with actual data when integrated
        : []
      );
      
      const currentStats = taskMonitor.getProcessingStats();
      
      setTaskRecords(records);
      setStats(currentStats);
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'processing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Task Processing Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg shadow">
            <div className="text-muted-foreground text-sm">Success Rate</div>
            <div className="text-2xl font-bold">
              {stats ? `${(stats.successRate * 100).toFixed(1)}%` : 'N/A'}
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg shadow">
            <div className="text-muted-foreground text-sm">Avg. Processing Time</div>
            <div className="text-2xl font-bold">
              {stats ? `${stats.averageProcessingTime.toFixed(0)}ms` : 'N/A'}
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg shadow">
            <div className="text-muted-foreground text-sm">Tasks Completed</div>
            <div className="text-2xl font-bold">
              {stats ? stats.completed : 0}
              <span className="text-sm text-muted-foreground ml-2">
                of {stats ? stats.totalTasks : 0}
              </span>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg shadow">
            <div className="text-muted-foreground text-sm">Failed Tasks</div>
            <div className="text-2xl font-bold text-red-500">
              {stats ? stats.failed : 0}
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Recent Tasks</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <div className="border rounded-lg">
            <Table>
              <TableCaption>Recent task processing history</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processing Time</TableHead>
                  <TableHead>Agents</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taskRecords.length > 0 ? (
                  taskRecords.map(record => (
                    <TableRow 
                      key={record.taskId}
                      onClick={() => setSelectedTaskId(record.taskId)}
                      className="cursor-pointer hover:bg-muted"
                    >
                      <TableCell className="font-mono text-xs">{record.taskId}</TableCell>
                      <TableCell>{record.taskType}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.endTime 
                          ? `${record.endTime - record.startTime}ms` 
                          : 'In progress'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {record.targetAgents.map(agent => (
                            <Badge key={agent} variant="outline">{agent}</Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No task records available yet. Run some agent tasks to see data here.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {selectedTaskId && (
            <div className="border rounded-lg p-4 mt-4">
              <h3 className="text-md font-medium mb-2">Task Details: {selectedTaskId}</h3>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {/* Task details would be shown here */}
                  <div className="text-sm text-muted-foreground">
                    Select a task to view its processing details and events.
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="logs">
          <ScrollArea className="h-[400px] border rounded-md p-4">
            <pre className="text-xs font-mono whitespace-pre-wrap">
              {/* System logs would be shown here */}
              [System] Task monitor enabled.
              [System] Ready to capture logs.
            </pre>
          </ScrollArea>
          
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" size="sm">
              Refresh Logs
            </Button>
            <Button variant="outline" size="sm">
              Clear Logs
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
