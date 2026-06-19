import { useState, useEffect } from 'react';
import { Briefcase, MapPin, ExternalLink, Zap, Play, CheckCircle2, ChevronRight, AlertCircle, Copy, Check } from 'lucide-react';
import jobService from '../../services/jobService';

export default function JobDashboard() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('jobAutomationPrefs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.webhookUrl) {
          setWebhookUrl(parsed.webhookUrl);
          setStep(2); // Automatically skip setup if URL exists
        }
      } catch (e) {}
    }
  }, []);

  const appsScriptCode = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Title', 'Company', 'Location', 'Experience', 'Source Type', 'Date Discovered', 'Apply Link']);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#f3f4f6');
  }
  
  // Append jobs
  var rows = data.jobs.map(function(job) {
    return [job.title, job.company, job.location, job.experience, job.sourceType || 'Broad', new Date().toLocaleString(), job.link];
  });
  
  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  }
  
  return ContentService.createTextOutput(JSON.stringify({"status": "success", "inserted": rows.length})).setMimeType(ContentService.MimeType.JSON);
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAutomation = async () => {
    if (!title || !webhookUrl) {
      setError('Please fill in the Job Title and Web App URL before starting the automation.');
      return;
    }
    
    if (!webhookUrl.startsWith('https://script.google.com/')) {
      setError('The Web App URL must be a valid Google Apps Script URL starting with https://script.google.com/...');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setStep(3); // Processing step
      
      // Save configuration
      localStorage.setItem('jobAutomationPrefs', JSON.stringify({ title, location, webhookUrl }));

      const response = await jobService.exportJobsToSheet({
        title,
        location,
        webhookUrl
      });
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || 'Failed to export jobs.');
        setStep(2);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'An error occurred while running the automation.');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold flex justify-center items-center text-white mb-4">
          <Briefcase className="w-10 h-10 mr-4 text-emerald-500" /> 
          Job Automation
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Automatically find jobs matching your criteria and push them directly to your personal Google Sheet. No more messy UI, just pure data where you want it.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-xl overflow-hidden relative">
        {/* Progress Bar */}
        <div className="flex border-b border-slate-800 bg-slate-900/50">
          <div className={`flex-1 py-4 text-center font-bold text-sm ${step >= 1 ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-slate-500'}`}>
            1. Setup Google Sheet
          </div>
          <div className={`flex-1 py-4 text-center font-bold text-sm ${step >= 2 ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-slate-500'}`}>
            2. Configure Search
          </div>
          <div className={`flex-1 py-4 text-center font-bold text-sm ${step >= 3 ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-slate-500'}`}>
            3. Run & Export
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-start">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* STEP 1: GOOGLE SHEET SETUP */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl mr-4 border border-emerald-500/30">1</div>
                <h2 className="text-2xl font-bold text-white">Create your Google Sheet Bridge</h2>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4">
                <p className="text-slate-300">To allow GoalPilot to push jobs to your Google Sheet securely without you needing a Google Cloud account, follow these 4 simple steps:</p>
                
                <ol className="list-decimal list-inside space-y-3 text-slate-300 ml-2">
                  <li>Create a new <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center">Google Sheet <ExternalLink className="w-3 h-3 ml-1" /></a></li>
                  <li>In your sheet, click on <strong>Extensions &gt; Apps Script</strong></li>
                  <li>Delete the default code and paste the code below:</li>
                </ol>

                <div className="relative mt-4">
                  <div className="absolute top-0 right-0 p-2">
                    <button 
                      onClick={copyCode}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center"
                    >
                      {copied ? <><Check className="w-3 h-3 mr-1"/> Copied</> : <><Copy className="w-3 h-3 mr-1"/> Copy Code</>}
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm text-emerald-400 border border-slate-800 font-mono">
                    {appsScriptCode}
                  </pre>
                </div>

                <ol className="list-decimal list-inside space-y-3 text-slate-300 ml-2 mt-4" start={4}>
                  <li>Click <strong>Deploy &gt; New deployment</strong>. Select type <strong>Web App</strong>.</li>
                  <li>Set <em>Execute as</em> to <strong>Me</strong>, and <em>Who has access</em> to <strong>Anyone</strong>. Click Deploy.</li>
                  <li>Copy the provided <strong>Web app URL</strong>. You'll need it in the next step!</li>
                </ol>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => setStep(2)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center group"
                >
                  I have my Web App URL <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONFIGURE SEARCH */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl mr-4 border border-emerald-500/30">2</div>
                <h2 className="text-2xl font-bold text-white">Configure Job Search</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 flex items-center"><Briefcase className="w-4 h-4 mr-2" /> Job Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Frontend Developer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Remote, India, New York"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <label className="text-sm font-bold text-slate-400 flex items-center"><Zap className="w-4 h-4 mr-2" /> Google Web App URL (From Step 1)</label>
                <input 
                  type="text" 
                  placeholder="https://script.google.com/macros/s/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-mono text-sm"
                />
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-800">
                <button 
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white font-bold py-3 px-6 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleRunAutomation}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center"
                >
                  <Play className="w-5 h-5 mr-2" /> Start Automation
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING / SUCCESS */}
          {step === 3 && (
            <div className="py-12 animate-fade-in text-center">
              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                    <Briefcase className="absolute inset-0 m-auto w-8 h-8 text-emerald-400 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Automating your Job Search...</h2>
                  <p className="text-slate-400 max-w-md mx-auto">
                    We are currently scanning our database and pushing the latest matching jobs directly to your Google Sheet. This might take a few moments.
                  </p>
                </div>
              ) : success ? (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 border border-emerald-500/50">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Automation Complete!</h2>
                  <p className="text-slate-300 max-w-md mx-auto mb-8">
                    We found matching jobs and pushed them successfully to your Google Sheet. You can now track your applications natively in Sheets!
                  </p>
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => { setStep(2); setSuccess(false); }}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-colors border border-slate-700"
                    >
                      Run Another Search
                    </button>
                    <a 
                      href="https://sheets.google.com" 
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center"
                    >
                      Open Google Sheets <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
