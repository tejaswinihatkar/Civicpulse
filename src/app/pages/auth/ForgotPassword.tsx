import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { forgotPassword } from '../../services/api';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-2xl overflow-hidden">
           <div className="p-8 sm:p-10">
             <div className="text-center mb-10">
               <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password</h1>
               <p className="text-slate-600">Enter your email and we'll send you a reset link</p>
             </div>

             {error && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium"
               >
                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
                 {error}
               </motion.div>
             )}

             {success ? (
               <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-700 text-sm font-medium"
               >
                 <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
                 <div>Check your email for the reset link!</div>
               </motion.div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                     Email Address
                   </label>
                   <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                       <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                     </div>
                     <input
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                       placeholder="name@example.com"
                       required
                     />
                   </div>
                 </div>

                 <button
                   type="submit"
                   disabled={loading}
                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                 >
                   {loading ? (
                     <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                     <>
                       <span>Send Reset Link</span>
                       <ArrowRight className="w-5 h-5" />
                     </>
                   )}
                 </button>
               </form>
             )}
           </div>

           <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-center">
             <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold ml-1">
               Back to Login
             </Link>
           </div>
         </div>
      </motion.div>
    </div>
  );
}
