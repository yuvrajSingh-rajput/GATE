import React from 'react';
import { EmptyState } from '@/components/shared/EmptyState';
import { Construction } from 'lucide-react';

export default function Page() {
  return (
    <div className='flex h-[calc(100vh-8rem)] items-center justify-center'>
      <EmptyState
        icon={Construction}
        title='Coming Soon'
        description='This feature is currently under development. Check back later.'
      />
    </div>
  );
}
