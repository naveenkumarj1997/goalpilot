import React from 'react';

export default function PersonalInfoStep({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-slate-400 mb-2 font-medium">Full Name</label>
          <input type="text" name="fullName" value={data.fullName || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-slate-400 mb-2 font-medium">Email Address</label>
          <input type="email" name="email" value={data.email || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="john@example.com" />
        </div>
        <div>
          <label className="block text-slate-400 mb-2 font-medium">Phone Number</label>
          <input type="tel" name="phone" value={data.phone || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="+1 234 567 8900" />
        </div>
        <div>
          <label className="block text-slate-400 mb-2 font-medium">Location</label>
          <input type="text" name="location" value={data.location || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="New York, NY" />
        </div>
        <div>
          <label className="block text-slate-400 mb-2 font-medium">LinkedIn URL</label>
          <input type="url" name="linkedin" value={data.linkedin || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="linkedin.com/in/johndoe" />
        </div>
        <div>
          <label className="block text-slate-400 mb-2 font-medium">GitHub URL</label>
          <input type="url" name="github" value={data.github || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="github.com/johndoe" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-slate-400 mb-2 font-medium">Portfolio Website (Optional)</label>
          <input type="url" name="portfolio" value={data.portfolio || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="https://johndoe.com" />
        </div>
      </div>
    </div>
  );
}
