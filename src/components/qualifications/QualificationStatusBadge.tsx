
import React from 'react';
import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string): React.ReactNode => {
  switch (status) {
    case 'passed':
      return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Passed</Badge>;
    case 'in-progress':
      return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">In Progress</Badge>;
    case 'scheduled':
      return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">Scheduled</Badge>;
    case 'not-started':
      return <Badge variant="outline">Not Started</Badge>;
    default:
      return null;
  }
};

export default getStatusBadge;
