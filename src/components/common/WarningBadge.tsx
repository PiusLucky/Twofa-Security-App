import React from 'react';
import { Badge } from '@/components/ui/badge';

interface IProps {
  text: string;
}

function WarningBadge({ text }: IProps) {
  return (
    <Badge className='bg-[#d355551a] hover:bg-[#d355551a] text-[#D35555]'>
      {' '}
      <svg
        width='8'
        height='8'
        viewBox='0 0 8 8'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle cx='4' cy='4' r='3' fill='#D35555' />
      </svg>
      <span className='ml-1'>{text}</span>
    </Badge>
  );
}

export default WarningBadge;
