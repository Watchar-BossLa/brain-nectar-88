import React, { useState, useEffect } from 'react';
import { useDocumentAnalysis } from '@/services/documents';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Trash2, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * Document List Component
 * Displays a list of user's documents
 * @param {Object} props - Component props
 * @param {Function} props.onSelectDocument - Callback when a document is selected
 * @returns {React.ReactElement} Document list component
 */
const DocumentList = ({ onSelectDocument }) => {
  const { user } = useAuth();
  const documentAnalysis = useDocumentAnalysis();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  // Fetch user documents
  useEffect(() => {
    if (!user) return;
    
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const data = await documentAnalysis.getUserDocuments(user.id);
        setDocuments(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError(err.message || 'Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [user, documentAnalysis]);
  
  // Handle document selection
  const handleSelectDocument = (document) => {
    if (onSelectDocument) {
      onSelectDocument(document);
    }
  };
  
  // Handle document deletion
  const handleDeleteDocument = async (documentId, event) => {
    event.stopPropagation();
    
    if (!user || !documentId) return;
    
    try {
      setDeletingId(documentId);
      await documentAnalysis.deleteDocument(documentId, user.id);
      setDocuments(documents.filter(doc => doc.id !== documentId));
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document: ' + (err.message || 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };
  
  // Get status badge for document
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      case 'uploaded':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Uploaded
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>Loading your documents...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Failed to load your documents</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Documents</CardTitle>
        <CardDescription>
          {documents.length === 0
            ? 'You haven\'t uploaded any documents yet'
            : `You have ${documents.length} document${documents.length === 1 ? '' : 's'}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Documents</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a document to get started with advanced document analysis.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((document) => (
              <div
                key={document.id}
                className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSelectDocument(document)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">{document.file_name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(document.status)}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteDocument(document.id, e)}
                      disabled={deletingId === document.id}
                    >
                      {deletingId === document.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Size: </span>
                    {(document.file_size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  {document.public_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={document.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Original
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentList;
