import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface RelatedContentItem {
  title: string;
  snippet: string;
  url: string;
  domain?: string;
  source?: string;
  relevance: number;
  thumbnail?: string;
}

interface RelatedContentCarouselProps {
  items: RelatedContentItem[];
  title: string;
  type: 'image' | 'video' | 'text' | 'document';
}

const RelatedContentCarousel: React.FC<RelatedContentCarouselProps> = ({ 
  items, 
  title, 
  type 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, items.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ExternalLink className="w-5 h-5 text-primary-600 mr-2" />
          {title}
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium mb-2">No se encontró contenido relacionado</p>
          <p className="text-gray-400 text-sm">
            No se pudieron encontrar referencias relacionadas con este análisis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ExternalLink className="w-5 h-5 text-primary-600 mr-2" />
          {title}
        </h3>
        {items.length > itemsPerView && (
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 px-2">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors h-full">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {/* Thumbnail for images and videos */}
                  {(type === 'image' || type === 'video') && item.thumbnail && (
                    <div className="mb-3">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <h4 className="font-medium text-primary-600 hover:text-primary-700 mb-2 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {item.snippet}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{item.domain || item.source || 'Fuente desconocida'}</span>
                    <span className="text-xs text-primary-600">
                      Relevancia: {Math.round((item.relevance || 0) * 100)}%
                    </span>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      {items.length > itemsPerView && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedContentCarousel;
