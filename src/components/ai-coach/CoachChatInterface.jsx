import React, { useState, useEffect, useRef } from 'react';
import { useAICoachSession, useAICoachProfile } from '@/services/ai-coach';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { 
  Send, 
  Loader2,
  RefreshCw,
  Sparkles,
  User,
  Clock,
  MoreHorizontal
} from 'lucide-react';

/**
 * Coach Chat Interface Component
 * Provides a chat interface for interacting with the AI coach
 * @param {Object} props - Component props
 * @param {string} [props.sessionType='general'] - Session type
 * @param {Function} [props.onSessionCreated] - Callback when session is created
 * @returns {React.ReactElement} Coach chat interface component
 */
const CoachChatInterface = ({ sessionType = 'general', onSessionCreated }) => {
  const { user } = useAuth();
  const aiCoachSession = useAICoachSession();
  const aiCoachProfile = useAICoachProfile();
  
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState('');
  const [profile, setProfile] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  // Load session and messages
  useEffect(() => {
    if (!user) return;
    
    const loadSession = async () => {
      try {
        setLoading(true);
        
        // Initialize services if needed
        if (!aiCoachSession.initialized) {
          await aiCoachSession.initialize(user.id);
        }
        
        if (!aiCoachProfile.initialized) {
          await aiCoachProfile.initialize(user.id);
        }
        
        // Get coach profile
        const coachProfile = await aiCoachProfile.getCoachProfile();
        setProfile(coachProfile);
        
        // Get or create session
        const activeSession = await aiCoachSession.getOrCreateActiveSession(sessionType);
        setSession(activeSession);
        
        if (onSessionCreated) {
          onSessionCreated(activeSession);
        }
        
        // Get messages
        const sessionMessages = await aiCoachSession.getSessionMessages(activeSession.id);
        setMessages(sessionMessages);
      } catch (error) {
        console.error('Error loading coach session:', error);
        toast({
          title: 'Error',
          description: 'Failed to load coach session',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSession();
  }, [user, aiCoachSession, aiCoachProfile, sessionType, onSessionCreated]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle send message
  const handleSendMessage = async () => {
    if (!user || !session || !input.trim()) return;
    
    try {
      setSending(true);
      
      // Add user message to UI immediately for better UX
      const userMessage = {
        id: 'temp-' + Date.now(),
        session_id: session.id,
        sender: 'user',
        content: input.trim(),
        message_type: 'text',
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      // Generate coach response
      const coachMessage = await aiCoachSession.generateCoachResponse(session.id, input.trim());
      
      // Update messages
      setMessages(prev => {
        // Replace temporary message with actual one and add coach response
        const filtered = prev.filter(m => m.id !== userMessage.id);
        return [...filtered, {
          id: 'user-' + Date.now(),
          session_id: session.id,
          sender: 'user',
          content: input.trim(),
          message_type: 'text',
          created_at: new Date().toISOString()
        }, coachMessage];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };
  
  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get avatar fallback text
  const getAvatarFallback = (name) => {
    if (!name) return 'SC';
    
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-16 w-64" />
              </div>
            </div>
            <div className="flex items-start space-x-4 justify-end">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 ml-auto" />
                <Skeleton className="h-12 w-48" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center space-x-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>
              {profile ? profile.coach_name : 'Study Coach'}
            </CardTitle>
            <CardDescription>
              {session?.session_type === 'goal_setting' && 'Setting and tracking your learning goals'}
              {session?.session_type === 'study_planning' && 'Planning your study sessions effectively'}
              {session?.session_type === 'progress_review' && 'Reviewing your learning progress'}
              {session?.session_type === 'motivation' && 'Keeping you motivated and focused'}
              {session?.session_type === 'learning_strategy' && 'Developing effective learning strategies'}
              {session?.session_type === 'general' && 'Your personal AI study coach'}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              // TODO: Implement session options
              toast({
                title: 'Session Options',
                description: 'This feature is not yet implemented',
              });
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Sparkles className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">Start Chatting with Your Coach</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Ask questions, get study tips, or discuss your learning goals. Your AI coach is here to help!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={message.id || index}
                className={`flex items-start space-x-4 ${message.sender === 'user' ? 'justify-end' : ''}`}
              >
                {message.sender !== 'user' && (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.settings?.coach_avatar_url || ''} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getAvatarFallback(profile?.coach_name)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`space-y-1 max-w-[80%] ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-muted-foreground">
                      {message.sender === 'user' ? 'You' : profile?.coach_name || 'Coach'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(message.created_at)}
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
                
                {message.sender === 'user' && (
                  <Avatar className="h-10 w-10 order-3">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                    <AvatarFallback className="bg-secondary">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {sending && (
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.settings?.coach_avatar_url || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getAvatarFallback(profile?.coach_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-muted-foreground">
                      {profile?.coach_name || 'Coach'}
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!input.trim() || sending}
            size="icon"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CoachChatInterface;
