import React from 'react';
import { Badge } from '@/components/ui/badge';

interface IProps {
  text: string;
  classes?: string;
}

function SuccessBadge({ text, classes }: IProps) {
  return (
    <Badge
      className={`bg-[#027a481a] hover:bg-[#027a481a] text-[#027A48] ${
        classes ? classes : ''
      }`}
    >
      <svg
        width='8'
        height='8'
        viewBox='0 0 8 8'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle cx='4' cy='4' r='3' fill='#027A48' />
      </svg>
      <span className='ml-1'>{text}</span>
    </Badge>
  );
}

export default SuccessBadge;
