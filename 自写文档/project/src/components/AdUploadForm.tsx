import React, { useState } from 'react';
import { Upload, Link2, MessageCircle } from 'lucide-react';
import type { Advertisement } from '../types';

interface AdUploadFormProps {
  onSubmit: (ad: Omit<Advertisement, 'id'>) => void;
}

export function AdUploadForm({ onSubmit }: AdUploadFormProps) {
  const [linkType, setLinkType] = useState<'webpage' | 'wechat'>('webpage');
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSubmit({
      image: formData.get('image') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      link: formData.get('link') as string,
      linkType,
    });
    
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          图片链接
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="image"
            required
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="请输入图片URL"
          />
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            上传图片
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          标题
        </label>
        <input
          type="text"
          name="title"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="请输入广告标题"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          描述
        </label>
        <textarea
          name="description"
          required
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="请输入广告描述"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          链接类型
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setLinkType('webpage')}
            className={`flex-1 inline-flex items-center justify-center px-4 py-2 border rounded-lg ${
              linkType === 'webpage'
                ? 'border-blue-500 text-blue-500 bg-blue-50'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Link2 className="w-4 h-4 mr-2" />
            销售页面
          </button>
          <button
            type="button"
            onClick={() => setLinkType('wechat')}
            className={`flex-1 inline-flex items-center justify-center px-4 py-2 border rounded-lg ${
              linkType === 'wechat'
                ? 'border-blue-500 text-blue-500 bg-blue-50'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            微信公众号
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          目标链接
        </label>
        <input
          type="text"
          name="link"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder={linkType === 'webpage' ? '请输入销售页面URL' : '请输入微信公众号链接'}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        发布广告
      </button>
    </form>
  );
}