import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createUpgradeRequest, getSystemConfig } from '../services/adminService';
import { Shield, CheckCircle, ArrowRight, CreditCard } from 'lucide-react';
import { useLocation, Navigate } from 'react-router-dom';

export default function PremiumUpgrade() {
  const location = useLocation();
  const moduleName = location.state?.moduleName;

  const { user, featureFlags } = useAuth();
  const [transactionRef, setTransactionRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [config, setConfig] = useState<any>({});
  const [showZoomedQr, setShowZoomedQr] = useState(false);

  useEffect(() => {
    if (user?.token) {
      getSystemConfig(user.token).then(setConfig).catch(console.error);
    }
  }, [user]);

  if (!moduleName || user?.role === 'Premium' || user?.role === 'Admin' || user?.role === 'SuperAdmin') return <Navigate to="/dashboard" />;

  const flag = featureFlags?.find((f:any) => f.moduleName === moduleName);
  const price = flag?.price || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;
    
    setLoading(true);
    setError('');
    try {
      await createUpgradeRequest(transactionRef, moduleName, price, user.token);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-4">
          Unlock <span className="text-emerald-400">{moduleName}</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Purchase lifetime access to this specific premium module.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 border border-emerald-500/30 p-8 rounded-3xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="w-6 h-6 text-emerald-400 mr-2" />
            Module Benefits
          </h2>
          <ul className="space-y-4">
            <li className="flex items-center text-slate-300">
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
              Full lifetime access to {moduleName}
            </li>
            <li className="flex items-center text-slate-300">
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
              Priority updates and features
            </li>
            <li className="flex items-center text-slate-300">
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
              Unlimited usage
            </li>
          </ul>
          
          <div className="mt-8 p-6 bg-slate-800 rounded-2xl border border-slate-700 text-center">
            <p className="text-slate-400 mb-2">One-time Unlock Fee</p>
            <p className="text-4xl font-black text-white flex items-center justify-center">
              <CreditCard className="w-8 h-8 mr-3 text-emerald-500 opacity-50" />
              ₹{price}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 border border-slate-700 p-8 rounded-3xl"
        >
          {success ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Request Submitted!</h3>
              <p className="text-slate-400">
                An admin will review your payment and upgrade your account shortly.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-6">
                Payment Instructions
              </h2>
              <p className="text-slate-400 mb-6 text-sm">
                1. Scan the QR code below using any UPI app.
                <br/>2. Pay exactly <strong>₹{price}</strong>.
                <br/>3. Enter the transaction reference number below.
              </p>
              
              <div 
                onClick={() => config.paymentQrCode && setShowZoomedQr(true)}
                className="bg-white p-4 rounded-xl w-64 h-64 sm:w-72 sm:h-72 mx-auto mb-8 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-4 hover:ring-emerald-500/50 transition-all relative group"
              >
                {config.paymentQrCode ? (
                  <>
                    <img src={config.paymentQrCode} alt="Payment QR Code" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-bold px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">Click to Zoom</span>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-500 text-center text-sm font-bold">
                    No QR Code available.
                  </div>
                )}
              </div>

              {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-4">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-slate-400 text-sm font-bold mb-2">Transaction Reference ID</label>
                  <input 
                    type="text"
                    required
                    value={transactionRef}
                    onChange={e => setTransactionRef(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. UTR123456789"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center"
                >
                  {loading ? 'Submitting...' : 'I Have Paid'}
                  {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>

      {/* Zoomed QR Modal */}
      {showZoomedQr && config.paymentQrCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setShowZoomedQr(false)}>
          <div className="bg-white p-4 sm:p-8 rounded-3xl max-w-[95vw] max-h-[95vh] relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowZoomedQr(false)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-red-500/50 border-2 border-slate-900 transition-colors"
            >
              ✕
            </button>
            <img 
              src={config.paymentQrCode} 
              alt="Zoomed Payment QR Code" 
              className="w-full h-full max-w-[80vw] max-h-[80vh] object-contain" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
