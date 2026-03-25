import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Camera, MapPin, Mic, Upload, CheckCircle, Loader2, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { submitComplaint } from '../../services/api';

export function ReportIssue() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    images: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { id: 'road', label: 'Road', icon: '🛣️' },
    { id: 'garbage', label: 'Garbage', icon: '🗑️' },
    { id: 'electricity', label: 'Electricity', icon: '⚡' },
    { id: 'water', label: 'Water', icon: '💧' },
    { id: 'drainage', label: 'Drainage', icon: '🌊' },
    { id: 'streetlight', label: 'Streetlight', icon: '💡' },
    { id: 'park', label: 'Park', icon: '🌳' },
    { id: 'traffic', label: 'Traffic', icon: '🚦' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await submitComplaint({
        title: formData.title,
        description: formData.description,
        category: formData.category.toUpperCase(),
        latitude: 28.6139, // Static for now, in real app use geolocation
        longitude: 77.2090,
        address: formData.location || 'Main Street, Connaught Place, New Delhi',
        images: formData.images,
        anonymous: false
      });
      
      setSubmitted(true);
      setTimeout(() => {
        navigate('/citizen');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData({ ...formData, images: [...formData.images, ...urls] });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 text-center shadow-2xl max-w-md border border-slate-200"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Report Submitted!</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Thank you for your contribution. Your report has been successfully filed and routed to the correct department.
          </p>
          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
            <p className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wider">Tracking Status</p>
            <div className="flex items-center justify-center gap-2 text-blue-900 font-bold text-xl">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Awaiting Acknowledgment</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-8 font-medium italic">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/citizen')}
            className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Report Civic Issue</h1>
            <p className="text-slate-600 font-medium">Step {step} of 3</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 flex">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <form onSubmit={handleSubmit} className="p-8 sm:p-12">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Choose a Category</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, category: cat.id });
                        setStep(2);
                      }}
                      className={`group p-6 rounded-2xl border-2 transition-all duration-300 text-center flex flex-col items-center gap-4 hover:-translate-y-1 ${
                        formData.category === cat.id
                          ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-500/10'
                          : 'border-slate-100 bg-slate-50/50 hover:border-blue-200 hover:bg-white hover:shadow-xl'
                      }`}
                    >
                      <div className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</div>
                      <div className="font-bold text-slate-800">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-lg">2</span>
                  Issue Details
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">
                      Issue Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg font-medium"
                      placeholder="e.g., Pothole on Sector 4 Main Road"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">
                      Detailed Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg"
                      placeholder="Describe the problem in detail to help our field workers..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">
                      Supporting Photos
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200">
                          <img src={img} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer bg-slate-50">
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
                        <span className="text-xs font-bold text-slate-500 mt-2">Add Photo</span>
                        <input type="file" multiple className="hidden" onChange={handleFileUpload} accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!formData.title || !formData.description}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    Continue
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-lg">3</span>
                  Location & Routing
                </h2>

                <div className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4">
                      <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        Verified GPS
                      </div>
                    </div>
                    <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
                    <p className="text-xl font-bold text-slate-900 mb-2">Auto-detected Location</p>
                    <p className="text-slate-600 font-medium">Main Street, Connaught Place, New Delhi</p>
                    <div className="mt-6 flex items-center justify-center gap-2 text-blue-600 font-bold text-sm bg-blue-50 rounded-xl px-4 py-2 w-fit mx-auto border border-blue-100">
                      <Target className="w-4 h-4" />
                      Assigned Ward: WARD-CP
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">
                      Specific Address / Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                      placeholder="Near the metro station exit..."
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-bold flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-2xl font-bold shadow-2xl shadow-blue-500/30 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>File Official Report</span>
                        <Send className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function Target({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
