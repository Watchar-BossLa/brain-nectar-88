import React, { useState } from 'react';
import { useGroupSessions } from '@/services/study-groups';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Loader2, Users } from 'lucide-react';

/**
 * Session Scheduler Component
 * @param {Object} props - Component props
 * @param {string} props.groupId - Group ID
 * @param {Function} props.onSuccess - Success callback
 * @param {Function} props.onCancel - Cancel callback
 * @returns {React.ReactElement} Session scheduler component
 */
const SessionScheduler = ({ groupId, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const groupSessions = useGroupSessions();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date(),
    startTime: '18:00',
    endTime: '19:00',
    sessionData: {}
  });
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle date change
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !groupId) return;
    
    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Session name is required',
        variant: 'destructive'
      });
      return;
    }
    
    if (!formData.date) {
      toast({
        title: 'Error',
        description: 'Date is required',
        variant: 'destructive'
      });
      return;
    }
    
    if (!formData.startTime) {
      toast({
        title: 'Error',
        description: 'Start time is required',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Initialize service if needed
      if (!groupSessions.initialized) {
        await groupSessions.initialize(user.id);
      }
      
      // Create date objects for start and end times
      const startDate = new Date(formData.date);
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
      startDate.setHours(startHours, startMinutes, 0, 0);
      
      let endDate = null;
      if (formData.endTime) {
        endDate = new Date(formData.date);
        const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
        endDate.setHours(endHours, endMinutes, 0, 0);
        
        // Check if end time is before start time
        if (endDate < startDate) {
          toast({
            title: 'Error',
            description: 'End time cannot be before start time',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }
      }
      
      // Create the session
      const session = await groupSessions.createSession(groupId, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        scheduledStart: startDate.toISOString(),
        scheduledEnd: endDate ? endDate.toISOString() : null,
        sessionData: formData.sessionData
      });
      
      toast({
        title: 'Success',
        description: 'Study session scheduled successfully',
      });
      
      if (onSuccess) {
        onSuccess(session);
      }
    } catch (error) {
      console.error('Error scheduling session:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to schedule study session',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Schedule Study Session</CardTitle>
        <CardDescription>
          Schedule a new study session for your group
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Session Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter session name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what you'll study in this session"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Schedule Session
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SessionScheduler;
