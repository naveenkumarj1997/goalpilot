import { useState, useEffect } from 'react';
import { DEFAULT_UNLOCKED_MODULES } from '../../utils/modules';

import { useAuth } from '../../context/AuthContext';
import { 
  getStats, 
  getUsers, 
  updateUserStatus, 
  updateUserRole, 
  getFeatureFlags, 
  updateFeatureFlag, 
  getAuditLogs, 
  getUpgradeRequests, 
  processUpgradeRequest,
  getSystemConfig,
  updateSystemConfig,
  updateUserOverrides,
  getSupportConversations,
  replyToSupportMessage,
  getDailyActiveUsers
} from '../../services/adminService';
import { Users, Shield, Settings, Activity, List, CheckCircle, XCircle, CreditCard, MessageCircle, Send, Crown, Lock, ArrowLeft, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [flags, setFlags] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [config, setConfig] = useState<any>({});
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  
  // Module Access Modal
  const [accessModalUser, setAccessModalUser] = useState<any>(null);
  const [tempOverrides, setTempOverrides] = useState<Record<string, boolean>>({});
  const ALL_MODULES = [
    'Dashboard', 'Goals', 'Update Hours', 'Tasks', 'Habits', 
    'Gaming Lounge', 'Chat', 'Resume Builder', 'Home Coach', 
    'Discipline', 'Yoga Coach', 'Meditation', 'Stoicism', 
    'Personal Dev', 'Manifestation', 'Job Discovery'
  ];

  // Users List State
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userSortBy, setUserSortBy] = useState('createdAt');
  const [userSortOrder, setUserSortOrder] = useState('desc');
  const [userTotalPages, setUserTotalPages] = useState(1);

  // Audit Logs State
  const [auditSearch, setAuditSearch] = useState('');
  const [auditPage, setAuditPage] = useState(1);
  const [auditSortBy, setAuditSortBy] = useState('createdAt');
  const [auditSortOrder, setAuditSortOrder] = useState('desc');
  const [auditTotalPages, setAuditTotalPages] = useState(1);

  // Active Users Modal State
  const [showActiveUsersModal, setShowActiveUsersModal] = useState(false);
  const [dailyActiveUsers, setDailyActiveUsers] = useState<any[]>([]);

  const fetchDailyActiveUsers = async () => {
    if (!user?.token) return;
    try {
      const users = await getDailyActiveUsers(user.token);
      setDailyActiveUsers(users);
      setShowActiveUsersModal(true);
    } catch (error) {
      console.error('Failed to fetch daily active users', error);
    }
  };

  const fetchData = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      
      // Always fetch flags as they are needed for modals
      setFlags(await getFeatureFlags(user.token));

      if (activeTab === 'dashboard') {
        setStats(await getStats(user.token));
      } else if (activeTab === 'users') {
        const response = await getUsers(user.token, {
          page: userPage,
          limit: 10,
          search: userSearch,
          sortBy: userSortBy,
          sortOrder: userSortOrder
        });
        setUsersList(response.users || []);
        setUserTotalPages(response.totalPages || 1);
      } else if (activeTab === 'features') {
        setFlags(await getFeatureFlags(user.token));
      } else if (activeTab === 'audit') {
        const response = await getAuditLogs(user.token, { 
          page: auditPage, 
          limit: 10, 
          search: auditSearch, 
          sortBy: auditSortBy, 
          sortOrder: auditSortOrder 
        });
        setLogs(response.logs || []);
        setAuditTotalPages(response.totalPages || 1);
      } else if (activeTab === 'upgrades') {
        setRequests(await getUpgradeRequests(user.token));
      } else if (activeTab === 'pricing') {
        setConfig(await getSystemConfig(user.token));
      } else if (activeTab === 'support') {
        setConversations(await getSupportConversations(user.token));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, user, auditPage, auditSortBy, auditSortOrder, userPage, userSortBy, userSortOrder]);

  const handleAuditSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAuditPage(1); // reset to page 1 on new search
    fetchData();
  };

  const handleUserSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setUserPage(1); // reset to page 1 on new search
    fetchData();
  };

  const handleBlockUser = async (id: string, currentStatus: string) => {
    if (!user?.token) return;
    const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    const reason = newStatus === 'Blocked' ? prompt('Reason for blocking:') : '';
    if (newStatus === 'Blocked' && !reason) return;
    
    await updateUserStatus(id, newStatus, reason || '', user.token);
    fetchData();
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    if (!user?.token) return;
    await updateUserRole(id, newRole, user.token);
    fetchData();
  };

  const handleProcessRequest = async (id: string, status: string) => {
    if (!user?.token) return;
    await processUpgradeRequest(id, status, user.token);
    fetchData();
  };

  const toggleFlag = async (moduleName: string, isEnabled: boolean) => {
    if (!user?.token) return;
    await updateFeatureFlag({ moduleName, isEnabled: !isEnabled }, user.token);
    fetchData();
  };

  const togglePremium = async (moduleName: string, isPremium: boolean) => {
    if (!user?.token) return;
    await updateFeatureFlag({ moduleName, isPremium: !isPremium }, user.token);
    fetchData();
  };

  const handleSaveQrCode = async (url: string) => {
    if (!user?.token) return;
    await updateSystemConfig('paymentQrCode', url, user.token);
    fetchData();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleSaveQrCode(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSetPrice = async (moduleName: string, price: number) => {
    if (!user?.token) return;
    await updateFeatureFlag({ moduleName, price }, user.token);
    fetchData();
  };

  const handleOpenAccessModal = (u: any) => {
    setAccessModalUser(u);
    setTempOverrides(u.moduleOverrides || {});
  };

  const handleSaveAccess = async () => {
    if (!user?.token || !accessModalUser) return;
    await updateUserOverrides(accessModalUser._id, tempOverrides, user.token);
    setAccessModalUser(null);
    fetchData();
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token || !activeConversation || !replyText.trim()) return;
    await replyToSupportMessage(activeConversation.user._id, replyText, user.token);
    setReplyText('');
    
    // Refresh conversations and update active
    const updated = await getSupportConversations(user.token);
    setConversations(updated);
    const newActive = updated.find((c: any) => c.user._id === activeConversation.user._id);
    setActiveConversation(newActive);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center">
            <Shield className="w-8 h-8 text-indigo-500 mr-3" />
            Admin Control Panel
          </h1>
          <p className="text-slate-400 mt-2">Manage platform settings, users, and access control.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
        {[ 
          { id: 'dashboard', label: 'Dashboard', icon: Activity },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'upgrades', label: 'Premium Requests', icon: Shield },
          { id: 'pricing', label: 'Premium & Pricing', icon: CreditCard },
          { id: 'features', label: 'Feature Flags', icon: Settings },
          { id: 'support', label: 'Support Chat', icon: MessageCircle },
          { id: 'audit', label: 'Audit Logs', icon: List }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-xl font-bold transition-colors ${activeTab === tab.id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading admin data...</div>
      ) : (
        <div className="space-y-6">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl">
                <p className="text-slate-400 text-sm font-bold mb-1">Total Users</p>
                <p className="text-4xl font-black text-white">{stats.totalUsers}</p>
              </div>
              <div 
                className="bg-slate-900 border border-slate-700 p-6 rounded-2xl cursor-pointer hover:bg-slate-800 hover:border-emerald-500/50 transition-all group"
                onClick={fetchDailyActiveUsers}
              >
                <div className="flex items-center text-emerald-400 mb-2">
                  <Activity className="w-5 h-5 mr-2" />
                  <span className="font-bold">Online Today</span>
                </div>
                <div className="text-4xl font-black text-white group-hover:text-emerald-400 transition-colors">{stats.activeUsers}</div>
                <div className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Click to view list</div>
              </div>
              <div className="bg-slate-900 border border-red-500/30 p-6 rounded-2xl">
                <p className="text-red-400 text-sm font-bold mb-1">Blocked Users</p>
                <p className="text-4xl font-black text-white">{stats.blockedUsers}</p>
              </div>
              <div className="bg-slate-900 border border-yellow-500/30 p-6 rounded-2xl">
                <p className="text-yellow-400 text-sm font-bold mb-1">Pending Upgrades</p>
                <p className="text-4xl font-black text-white">{stats.pendingUpgrades}</p>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
              {/* Controls Bar */}
              <div className="p-4 border-b border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-800/50">
                <form onSubmit={handleUserSearch} className="flex gap-2 w-full md:w-auto">
                  <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                  />
                  <button type="submit" className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold text-sm transition-colors">
                    Search
                  </button>
                </form>
                <div className="flex gap-2 w-full md:w-auto">
                  <select 
                    value={userSortBy}
                    onChange={(e) => setUserSortBy(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
                  >
                    <option value="createdAt">Date Joined</option>
                    <option value="name">Name</option>
                    <option value="role">Role</option>
                    <option value="status">Status</option>
                  </select>
                  <select 
                    value={userSortOrder}
                    onChange={(e) => setUserSortOrder(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {usersList.map((u: any) => (
                    <tr key={u._id} className="hover:bg-slate-800/50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={u.role || 'Standard'}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-1 outline-none"
                          disabled={u.role === 'SuperAdmin' && user?.role !== 'SuperAdmin'}
                        >
                          <option value="Standard">Standard</option>
                          <option value="Premium">Premium</option>
                          <option value="Admin">Admin</option>
                          {user?.role === 'SuperAdmin' && <option value="SuperAdmin">SuperAdmin</option>}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.status === 'Blocked' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {u.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => handleBlockUser(u._id, u.status || 'Active')}
                            className={`text-sm font-bold w-fit ${u.status === 'Blocked' ? 'text-emerald-400' : 'text-red-400'}`}
                            disabled={u.role === 'SuperAdmin'}
                          >
                            {u.status === 'Blocked' ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            onClick={() => handleOpenAccessModal(u)}
                            className="text-sm font-bold text-indigo-400 hover:text-indigo-300 w-fit"
                          >
                            Manage Access
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {usersList.length === 0 && <p className="text-slate-500 text-center py-8">No users found.</p>}
              
              {/* Pagination */}
              {usersList.length > 0 && (
                <div className="p-4 border-t border-slate-700 flex justify-between items-center bg-slate-800/30">
                  <button 
                    onClick={() => setUserPage(p => Math.max(1, p - 1))}
                    disabled={userPage === 1}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-400 font-bold">
                    Page {userPage} of {userTotalPages}
                  </span>
                  <button 
                    onClick={() => setUserPage(p => Math.min(userTotalPages, p + 1))}
                    disabled={userPage === userTotalPages}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
                  >
                    Next
                  </button>
                </div>
              )}
              </div>
            </div>
          )}

          {/* UPGRADES TAB */}
          {activeTab === 'upgrades' && (
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Premium Upgrade Requests</h2>
              <div className="space-y-4">
                {requests.map((r: any) => (
                  <div key={r._id} className="bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-slate-700">
                    <div>
                      <div className="font-bold text-white">{r.user?.name} <span className="text-slate-400 text-sm font-normal">({r.user?.email})</span></div>
                      <div className="text-emerald-400 font-bold mt-1 text-sm flex items-center">
                        <CreditCard className="w-4 h-4 mr-1" />
                        {r.moduleName} - ₹{r.pricePaid || 0}
                      </div>
                      <div className="text-sm text-indigo-400 mt-1">Txn Ref: {r.transactionReference}</div>
                      <div className="text-xs text-slate-500 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {r.status === 'Pending' ? (
                        <>
                          <button onClick={() => handleProcessRequest(r._id, 'Approved')} className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleProcessRequest(r._id, 'Rejected')} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {r.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {requests.length === 0 && <p className="text-slate-400 text-center py-4">No requests found.</p>}
              </div>
            </div>
          )}

          {/* PRICING TAB */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Payment Configuration</h2>
                <div className="mb-4">
                  <label className="block text-slate-400 text-sm font-bold mb-2">Global UPI QR Code</label>
                  <p className="text-xs text-slate-500 mb-4">Upload an image of your QR code directly to the database, or paste an image URL.</p>
                  
                  <div className="flex flex-col gap-4">
                    {/* URL Input */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input 
                        type="text" 
                        defaultValue={config.paymentQrCode?.startsWith('http') ? config.paymentQrCode : ''}
                        id="qrCodeInput"
                        placeholder="https://example.com/qr-code.png"
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button 
                        onClick={() => handleSaveQrCode((document.getElementById('qrCodeInput') as HTMLInputElement).value)}
                        className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-colors whitespace-nowrap"
                      >
                        Save URL
                      </button>
                    </div>

                    <div className="flex items-center gap-4 py-2">
                      <div className="h-px bg-slate-700 flex-1"></div>
                      <span className="text-slate-500 text-sm font-bold">OR</span>
                      <div className="h-px bg-slate-700 flex-1"></div>
                    </div>

                    {/* File Upload */}
                    <div className="flex items-center">
                      <input 
                        type="file" 
                        accept="image/*"
                        id="qrCodeUpload"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label 
                        htmlFor="qrCodeUpload"
                        className="w-full text-center px-6 py-3 border-2 border-dashed border-emerald-500/50 hover:border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl font-bold cursor-pointer transition-colors"
                      >
                        Upload QR Code Image from Device
                      </label>
                    </div>
                  </div>

                  {config.paymentQrCode && (
                    <div className="mt-6 p-4 bg-slate-800 rounded-xl inline-block border border-slate-700">
                      <p className="text-slate-400 text-sm mb-3 font-bold flex items-center justify-between">
                        Current QR Code
                        <button 
                          onClick={() => handleSaveQrCode('')}
                          className="text-red-400 hover:text-red-300 text-xs ml-4"
                        >
                          Remove
                        </button>
                      </p>
                      <img src={config.paymentQrCode} alt="QR Code" className="w-48 h-48 rounded-xl bg-white object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Module Pricing (INR)</h2>
                <p className="text-slate-400 mb-6 text-sm">Set prices for individual premium modules. Only standard users without access will be prompted to pay this amount.</p>
                <div className="space-y-4">
                  {ALL_MODULES.map(modName => {
                    const flag = flags.find(f => f.moduleName === modName);
                    const isPremium = flag ? flag.isPremium : false;
                    const price = flag ? flag.price || 0 : 0;
                    
                    if (!isPremium) return null;
                    
                    return (
                      <div key={modName} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700 gap-4">
                        <div className="font-bold text-white flex items-center mb-4 sm:mb-0">
                          <Shield className="w-4 h-4 mr-2 text-yellow-500" />
                          {modName}
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="text-slate-400">₹</span>
                          <input 
                            type="number" 
                            defaultValue={price}
                            id={`price-${modName}`}
                            className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-white outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                          />
                          <button 
                            onClick={() => handleSetPrice(modName, Number((document.getElementById(`price-${modName}`) as HTMLInputElement).value))}
                            className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg font-bold text-sm transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {!flags.some(f => f.isPremium) && (
                    <div className="text-center py-8 text-slate-500 italic">No premium modules configured yet. Go to Feature Flags to set modules as Premium.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FEATURES TAB */}
          {activeTab === 'features' && (
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Global Feature Flags</h2>
              <p className="text-slate-400 mb-6">Toggle modules globally. If disabled, Standard/Premium users cannot see or access them.</p>
              
              <div className="space-y-4">
                {ALL_MODULES.map(modName => {
                  const flag = flags.find(f => f.moduleName === modName);
                  const isEnabled = flag ? flag.isEnabled : true;
                  const isPremium = flag ? flag.isPremium : false;
                  return (
                    <div key={modName} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700 gap-4">
                      <div className="font-bold text-white flex items-center">
                        {modName}
                        {isPremium && <Shield className="w-4 h-4 ml-2 text-yellow-500" />}
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => togglePremium(modName, isPremium)}
                          className={`px-4 py-2 rounded-lg font-bold text-sm border ${isPremium ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-slate-700/50 text-slate-400 border-slate-600 hover:text-white'}`}
                        >
                          {isPremium ? 'Premium' : 'Free'}
                        </button>
                        <button 
                          onClick={() => toggleFlag(modName, isEnabled)}
                          className={`px-4 py-2 rounded-lg font-bold text-sm ${isEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}
                        >
                          {isEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AUDIT LOGS TAB */}
          {activeTab === 'audit' && (
            <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
              {/* Controls Bar */}
              <div className="p-4 border-b border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-800/50">
                <form onSubmit={handleAuditSearch} className="flex gap-2 w-full md:w-auto">
                  <input 
                    type="text" 
                    placeholder="Search action or user..." 
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                  />
                  <button type="submit" className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold text-sm transition-colors">
                    Search
                  </button>
                </form>
                <div className="flex gap-2 w-full md:w-auto">
                  <select 
                    value={auditSortBy}
                    onChange={(e) => setAuditSortBy(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
                  >
                    <option value="createdAt">Date</option>
                    <option value="action">Action</option>
                  </select>
                  <select 
                    value={auditSortOrder}
                    onChange={(e) => setAuditSortOrder(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Admin</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Target User</th>
                    <th className="px-6 py-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {logs.map((log: any) => (
                    <tr key={log._id} className="hover:bg-slate-800/50">
                      <td className="px-6 py-4 text-sm text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-bold text-white">{log.adminId?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm font-bold text-indigo-400">{log.action}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{log.targetUserId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{log.details || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {logs.length === 0 && <p className="text-slate-500 text-center py-8">No audit logs found.</p>}
              
              {/* Pagination */}
              {logs.length > 0 && (
                <div className="p-4 border-t border-slate-700 flex justify-between items-center bg-slate-800/30">
                  <button 
                    onClick={() => setAuditPage(p => Math.max(1, p - 1))}
                    disabled={auditPage === 1}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-400 font-bold">
                    Page {auditPage} of {auditTotalPages}
                  </span>
                  <button 
                    onClick={() => setAuditPage(p => Math.min(auditTotalPages, p + 1))}
                    disabled={auditPage === auditTotalPages}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
                  >
                    Next
                  </button>
                </div>
              )}
              </div>
            </div>
          )}

          {/* SUPPORT TAB */}
          {activeTab === 'support' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-14rem)] min-h-[500px]">
              {/* Conversations List */}
              <div className={`bg-slate-900 border border-slate-700 rounded-2xl overflow-y-auto flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                  <h3 className="font-bold text-white">Conversations</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {conversations.map((c: any) => (
                    <button
                      key={c.user._id}
                      onClick={() => setActiveConversation(c)}
                      className={`w-full text-left p-4 border-b border-slate-800 hover:bg-slate-800 transition-colors ${activeConversation?.user._id === c.user._id ? 'bg-slate-800 border-l-4 border-l-indigo-500' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">{c.user.name}</span>
                        {c.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {c.unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {c.messages[c.messages.length - 1].text}
                      </div>
                    </button>
                  ))}
                  {conversations.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No support messages yet.</div>
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className={`md:col-span-2 bg-slate-900 border border-slate-700 rounded-2xl flex-col ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
                {activeConversation ? (
                  <>
                    <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center shrink-0">
                      <div className="flex items-center">
                        <button 
                          onClick={() => setActiveConversation(null)} 
                          className="md:hidden mr-3 text-slate-400 hover:text-white transition-colors"
                        >
                          <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                          <h3 className="font-bold text-white">{activeConversation.user.name}</h3>
                          <p className="text-xs text-slate-400">{activeConversation.user.email}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleOpenAccessModal(activeConversation.user)}
                        className="px-4 py-2 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg text-sm font-bold transition-colors"
                      >
                        Manage Access
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {activeConversation.messages.map((msg: any) => {
                        const isAdmin = msg.sender === 'Admin';
                        return (
                          <div key={msg._id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${isAdmin ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'}`}>
                              {msg.text}
                              <div className={`text-[10px] mt-1 ${isAdmin ? 'text-indigo-200 text-right' : 'text-slate-500'}`}>
                                {new Date(msg.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <form onSubmit={handleReply} className="p-4 border-t border-slate-700 bg-slate-800">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type a reply..."
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          disabled={!replyText.trim()}
                          className="px-6 bg-indigo-500 text-white rounded-xl disabled:opacity-50 hover:bg-indigo-600 font-bold transition-colors flex items-center"
                        >
                          <Send className="w-4 h-4 mr-2" /> Send
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500">
                    Select a conversation to view and reply.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ACCESS MODAL */}
      {accessModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">Manage Module Access</h3>
                <p className="text-sm text-slate-400 mt-1">User: <span className="font-bold text-white">{accessModalUser.name}</span></p>
              </div>
              <button onClick={() => setAccessModalUser(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-sm text-slate-400 mb-4">
                You can explicitly lock or unlock free modules for this user. Premium modules are shown here for reference but their access is managed via Premium Requests.
              </p>
              
              {ALL_MODULES.filter(modName => {
                const flag = flags.find(f => f.moduleName === modName);
                if (!flag) return true; // If no flag exists, assume it's free and enabled
                return flag.isEnabled;
              }).map(modName => {
                const currentVal = tempOverrides[modName];
                const flag = flags.find(f => f.moduleName === modName);
                const isPremium = flag ? flag.isPremium : false;

                return (
                  <div key={modName} className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="text-white font-bold text-sm">{modName}</span>
                    {isPremium ? (
                      currentVal === true ? (
                        <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-sm bg-yellow-500/10 px-3 py-1 rounded-lg border border-yellow-500/20">
                          <Crown className="w-4 h-4" /> Purchased
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-sm bg-slate-900 px-3 py-1 rounded-lg border border-slate-700/50">
                          <Lock className="w-3.5 h-3.5" /> Premium (Locked)
                        </div>
                      )
                    ) : (
                      <select
                        value={currentVal === true ? 'true' : currentVal === false ? 'false' : 'default'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTempOverrides(prev => {
                            const next = { ...prev };
                            if (val === 'default') delete next[modName];
                            else if (val === 'true') next[modName] = true;
                            else if (val === 'false') next[modName] = false;
                            return next;
                          });
                        }}
                        className={`text-sm rounded-lg px-3 py-1 outline-none font-bold ${currentVal === true ? 'bg-emerald-500/20 text-emerald-400' : currentVal === false ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'}`}
                      >
                        <option value="default">
                          Default ({DEFAULT_UNLOCKED_MODULES.includes(modName) ? 'Unlocked' : 'Locked'})
                        </option>
                        <option value="true">Force Unlock</option>
                        <option value="false">Force Lock</option>
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-800/50">
              <button
                onClick={() => setAccessModalUser(null)}
                className="px-6 py-2 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAccess}
                className="px-6 py-2 rounded-xl font-bold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DAILY ACTIVE USERS MODAL */}
      {showActiveUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-emerald-400" />
                  Users Online Today
                </h3>
                <p className="text-sm text-slate-400 mt-1">Total: <span className="font-bold text-white">{dailyActiveUsers.length}</span></p>
              </div>
              <button onClick={() => setShowActiveUsersModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-0 overflow-y-auto">
              {dailyActiveUsers.length > 0 ? (
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-800/50 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 font-bold text-slate-300">User</th>
                      <th className="px-6 py-4 font-bold text-slate-300">Role</th>
                      <th className="px-6 py-4 font-bold text-slate-300">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {dailyActiveUsers.map((u: any) => (
                      <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                            u.role === 'Admin' || u.role === 'SuperAdmin' ? 'bg-purple-500/20 text-purple-400' :
                            u.role === 'Premium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-500/70" />
                            <span>
                              {new Date(u.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {new Date(u.lastActiveAt).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-slate-500">
                  <Activity className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p>No users have been active today.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-800/50 flex justify-end">
              <button
                onClick={() => setShowActiveUsersModal(false)}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
