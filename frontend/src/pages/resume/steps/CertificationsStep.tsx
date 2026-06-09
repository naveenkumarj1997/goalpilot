import { Plus, Trash2 } from 'lucide-react';

export default function CertificationsStep({ data, updateData }: { data: any, updateData: any }) {
  const certs = data.certifications || [];

  const addCert = () => {
    updateData({ certifications: [...certs, { name: '', issuer: '', date: '', link: '' }] });
  };

  const updateCert = (index: number, field: string, value: string) => {
    const newCerts = [...certs];
    newCerts[index] = { ...newCerts[index], [field]: value };
    updateData({ certifications: newCerts });
  };

  const removeCert = (index: number) => {
    updateData({ certifications: certs.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Certifications & Licenses</h2>
      
      {certs.map((cert: any, index: number) => (
        <div key={index} className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative">
          <button 
            onClick={() => removeCert(index)}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Certification Name</label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCert(index, 'name', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g. AWS Certified Solutions Architect"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Issuing Organization</label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCert(index, 'issuer', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g. Amazon Web Services"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Date Earned</label>
              <input
                type="text"
                value={cert.date}
                onChange={(e) => updateCert(index, 'date', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g. Aug 2023"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Credential URL (Optional)</label>
              <input
                type="text"
                value={cert.link}
                onChange={(e) => updateCert(index, 'link', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g. https://credly.com/..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addCert}
        className="w-full py-4 border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl flex items-center justify-center text-slate-400 hover:text-purple-400 transition-colors"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Certification
      </button>
    </div>
  );
}
