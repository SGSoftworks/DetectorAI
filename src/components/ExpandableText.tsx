import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ 
  text, 
  maxLength = 150, 
  className = "text-gray-700" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate ? text : text.slice(0, maxLength) + '...';
  
  if (!shouldTruncate) {
    return <p className={className}>{text}</p>;
  }
  
  return (
    <div className={className}>
      <p>{displayText}</p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 transition-colors"
      >
        {isExpanded ? (
          <>
            <span>Ver menos</span>
            <ChevronUp className="w-4 h-4 ml-1" />
          </>
        ) : (
          <>
            <span>Ver más</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </>
        )}
      </button>
    </div>
  );
};

export default ExpandableText;
