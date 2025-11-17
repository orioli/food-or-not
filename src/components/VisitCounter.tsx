import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';

const VisitCounter = () => {
  const [hasRecorded, setHasRecorded] = useState(false);

  const { data: visitData } = useQuery({
    queryKey: ['visit-count'],
    queryFn: async () => {
      if (!hasRecorded) {
        // Record the visit and get the count
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-visit`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ page_path: window.location.pathname })
          }
        );

        if (!response.ok) {
          throw new Error('Failed to track visit');
        }

        const data = await response.json();
        setHasRecorded(true);
        return data;
      }

      // If already recorded, return cached data
      return null;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 30000,
  });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg z-50">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Eye className="h-4 w-4" />
        <span>
          {visitData?.total_visits 
            ? `${formatNumber(visitData.total_visits)} visit${visitData.total_visits === 1 ? '' : 's'}`
            : 'Loading...'}
        </span>
      </div>
    </div>
  );
};

export default VisitCounter;
