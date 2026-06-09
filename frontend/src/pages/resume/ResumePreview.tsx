import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { getResumeById, scanATS } from '../../services/resumeService';
import { ArrowLeft, Download, Loader2, Target, CheckCircle2, AlertTriangle } from 'lucide-react';
import ModernTemplate from './templates/ModernTemplate';

export default function ResumePreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<any>(null);
  const [atsResult, setAtsResult] = useState<any>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (id) {
      getResumeById(id).then(setResume).catch(console.error);
    }
  }, [id]);

  const handleScanATS = async () => {
    if (!resume) return;
    try {
      setScanning(true);
      const result = await scanATS(resume);
      setAtsResult(result);
      // Update local state so ATS score appears
      setResume({ ...resume, atsScore: result.score });
    } catch (err) {
      console.error(err);
      alert('Failed to run ATS scan.');
    } finally {
      setScanning(false);
    }
  };

  if (!resume) {
    return <div className="p-8 text-white flex justify-center"><Loader2 className="animate-spin w-8 h-8" /></div>;
  }

  const fileName = `${resume.personalInfo?.fullName?.replace(/\s+/g, '_') || 'My'}_Resume.pdf`;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <button onClick={() => navigate(`/resume/${id}/edit`)} className="mr-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <h1 className="text-2xl font-bold text-white">{resume.title} - Preview</h1>
        </div>
        
        <div className="flex gap-3">
          <PDFDownloadLink
            document={<ModernTemplate data={resume} />}
            fileName={fileName}
            className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)]"
          >
            {({ loading }) => (
              <>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                {loading ? 'Preparing PDF...' : 'Download PDF'}
              </>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: ATS Scoring & Tools */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-500" /> ATS Analyzer
            </h2>
            
            {atsResult || resume.atsScore > 0 ? (
              <div className="text-center mb-6">
                <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 bg-slate-900 border-8 border-slate-700">
                  <span className="text-3xl font-bold text-white">{atsResult?.score || resume.atsScore}%</span>
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      className={`${(atsResult?.score || resume.atsScore) >= 80 ? 'text-green-500' : (atsResult?.score || resume.atsScore) >= 60 ? 'text-yellow-500' : 'text-red-500'}`}
                      strokeWidth="8"
                      strokeDasharray="100 100"
                      strokeDashoffset={100 - (atsResult?.score || resume.atsScore)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-300">
                  {(atsResult?.score || resume.atsScore) >= 80 ? 'Excellent Match!' : 'Needs Improvement'}
                </h3>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <p className="mb-4">Scan your resume against ATS tracking algorithms to see your score.</p>
              </div>
            )}

            <button 
              onClick={handleScanATS}
              disabled={scanning}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center"
            >
              {scanning ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {scanning ? 'Analyzing Resume...' : 'Scan Resume with AI'}
            </button>

            {atsResult && atsResult.suggestions && atsResult.suggestions.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-slate-300 mb-3">Improvement Suggestions:</h4>
                <ul className="space-y-2">
                  {atsResult.suggestions.map((sug: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-slate-400">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Templates</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-purple-600/20 border border-purple-500 rounded-lg text-purple-300 flex justify-between items-center">
                Modern ATS
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button disabled className="w-full text-left px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-500 opacity-50">
                Creative Pro (Coming Soon)
              </button>
              <button disabled className="w-full text-left px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-500 opacity-50">
                Executive (Coming Soon)
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Live PDF Preview */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-4 h-[800px] overflow-hidden">
          <PDFViewer width="100%" height="100%" className="rounded-xl border-none">
            <ModernTemplate data={resume} />
          </PDFViewer>
        </div>

      </div>
    </div>
  );
}
