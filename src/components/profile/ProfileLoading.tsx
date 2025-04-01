
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const ProfileLoading = () => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
};

export default ProfileLoading;
