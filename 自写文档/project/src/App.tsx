import React, { useState } from 'react';
import { AdCard } from './components/AdCard';
import { AdUploadForm } from './components/AdUploadForm';
import type { Advertisement } from './types';
import { PlusCircle } from 'lucide-react';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [ads, setAds] = useState<Advertisement[]>([
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      title: '数字营销解决方案',
      description: '为您的企业提供全方位的数字营销策略，助力业务增长',
      link: 'https://example.com/digital-marketing',
      linkType: 'webpage'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d',
      title: '企业微信营销',
      description: '关注我们的微信公众号，获取最新优惠和产品资讯',
      link: 'https://example.com/wechat',
      linkType: 'wechat'
    }
  ]);

  const handleSubmit = (newAd: Omit<Advertisement, 'id'>) => {
    setAds([...ads, { ...newAd, id: Date.now().toString() }]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">广告管理系统</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {showForm ? '取消' : '新建广告'}
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <AdUploadForm onSubmit={handleSubmit} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;