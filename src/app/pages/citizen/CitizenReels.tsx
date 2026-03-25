import { useState } from 'react';
import { Play, Heart, MessageCircle, Share2, TrendingUp, CheckCircle, Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface Reel {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  likes: number;
  comments: number;
  type: 'issue' | 'resolved';
  category: string;
  location: string;
  date: string;
}

export function CitizenReels() {
  const [filter, setFilter] = useState<'all' | 'issue' | 'resolved'>('all');

  const reels: Reel[] = [
    {
      id: '1',
      title: 'Pothole on Highway - Urgent Fix Needed',
      creator: 'Rajesh Kumar',
      thumbnail: 'https://images.unsplash.com/photo-1625726411847-8cbb60cc71e6?w=400',
      likes: 342,
      comments: 45,
      type: 'issue',
      category: 'Infrastructure',
      location: 'Highway 24',
      date: '2026-03-12'
    },
    {
      id: '2',
      title: 'Park Cleaning Drive - Before & After',
      creator: 'Priya Sharma',
      thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
      likes: 891,
      comments: 123,
      type: 'resolved',
      category: 'Sanitation',
      location: 'Central Park',
      date: '2026-03-11'
    },
    {
      id: '3',
      title: 'Street Light Fixed - Thanks Team!',
      creator: 'Amit Patel',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      likes: 567,
      comments: 67,
      type: 'resolved',
      category: 'Infrastructure',
      location: 'MG Road',
      date: '2026-03-10'
    },
    {
      id: '4',
      title: 'Water Leakage in Main Street',
      creator: 'Meera Singh',
      thumbnail: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400',
      likes: 234,
      comments: 34,
      type: 'issue',
      category: 'Water Supply',
      location: 'Main Street',
      date: '2026-03-09'
    },
    {
      id: '5',
      title: 'New Traffic Signal Installation Complete',
      creator: 'Suresh Reddy',
      thumbnail: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=400',
      likes: 445,
      comments: 56,
      type: 'resolved',
      category: 'Traffic',
      location: 'Junction 5',
      date: '2026-03-08'
    },
    {
      id: '6',
      title: 'Garbage Pile Near School - Health Hazard',
      creator: 'Kavita Joshi',
      thumbnail: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400',
      likes: 678,
      comments: 89,
      type: 'issue',
      category: 'Sanitation',
      location: 'School Road',
      date: '2026-03-07'
    }
  ];

  const filteredReels = filter === 'all' 
    ? reels 
    : reels.filter(reel => reel.type === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Civic Reels</h1>
          <p className="text-gray-600">Share and discover civic issues and success stories</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Reels
          </button>
          <button
            onClick={() => setFilter('issue')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all ${
              filter === 'issue'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Issues
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all ${
              filter === 'resolved'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Resolved
          </button>
        </div>

        {/* Upload Button */}
        <button className="mb-8 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
          + Upload New Reel
        </button>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[9/16] max-h-96 bg-gray-900">
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Play className="w-8 h-8 text-gray-900 ml-1" />
                  </div>
                </div>

                {/* Type Badge */}
                <div className="absolute top-4 right-4">
                  {reel.type === 'resolved' ? (
                    <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Resolved
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Issue
                    </span>
                  )}
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold mb-1 line-clamp-2">{reel.title}</h3>
                  <p className="text-sm text-gray-200 mb-2">@{reel.creator}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {reel.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {reel.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                    {reel.category}
                  </span>
                  <span>{reel.location}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(reel.date).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReels.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reels found</h3>
            <p className="text-gray-600">Be the first to share a reel!</p>
          </div>
        )}
      </div>
    </div>
  );
}
