import React, { useState } from 'react';
import { ExternalLink, MessageCircle } from 'lucide-react';
import type { Advertisement } from '../types';

interface AdCardProps {
  ad: Advertisement;
}

export function AdCard({ ad }: AdCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a href={ad.link} target="_blank" rel="noopener noreferrer">
        <div className="relative aspect-video">
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-white text-center p-4">
              {ad.linkType === 'wechat' ? (
                <MessageCircle className="w-8 h-8 mx-auto mb-2" />
              ) : (
                <ExternalLink className="w-8 h-8 mx-auto mb-2" />
              )}
              <p className="text-sm">
                {ad.linkType === 'wechat' ? '打开微信公众号' : '访问销售页面'}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">{ad.title}</h3>
          <p className="text-gray-600 text-sm">{ad.description}</p>
        </div>
      </a>
    </div>
  );
}