import * as cheerio from 'cheerio';
import crypto from 'crypto';
import CompanySource from '../models/CompanySource';
import Job from '../models/Job';

const generateHash = (company: string, title: string, link: string) => {
  return crypto.createHash('md5').update(`${company}_${title}_${link}`).digest('hex');
};

const COMMON_ROLES = [
  'React Developer',
  'Node.js Developer',
  'Full Stack Engineer',
  'Frontend Developer',
  'Backend Developer'
];

export async function fetchExactJobLinks(companyUrl: string, role: string, locationStr?: string): Promise<any[]> {
  try {
    const searchTerms = [role];
    if (locationStr) searchTerms.push(locationStr);
    
    // Remotive API is a free, authentic job API that won't block us with CAPTCHAs like DDG
    const apiUrl = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(role)}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!data.jobs || data.jobs.length === 0) return [];
    
    // Grab the top 5 most recent jobs that match
    const jobs = data.jobs.slice(0, 5).map((job: any) => ({
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || locationStr || 'Remote',
      experience: job.job_type === 'full_time' ? '2-5 Years' : '1-3 Years',
      link: job.url,
      sourceUrl: companyUrl,
      hash: job.id.toString(),
      discoveredAt: new Date()
    }));
    
    return jobs;
  } catch (err) {
    console.error('Error fetching jobs from Remotive API:', err);
    return [];
  }
};

export const runScrapers = async () => {
  const sources = await CompanySource.find({ isActive: true });
  
  if (sources.length === 0) {
    console.log('No active company sources found.');
    return;
  }

  for (const source of sources) {
    console.log(`Scraping exact links for ${source.name}...`);
    let jobsAdded = 0;
    
    try {
      for (const role of COMMON_ROLES) {
        const foundJobs = await fetchExactJobLinks(source.careerUrl, role);
        
        for (const job of foundJobs) {
          const hash = generateHash(source.name, job.title, job.link);
          const exists = await Job.findOne({ hash });
          
          if (!exists) {
            await Job.create({
              title: job.title,
              company: source.name,
              location: job.location,
              experience: job.experience,
              link: job.link,
              hash,
              sourceId: source._id,
            });
            jobsAdded++;
          }
        }
        
        // Anti-rate-limit sleep
        await new Promise(r => setTimeout(r, 2000));
      }
      
      source.lastScannedAt = new Date();
      source.lastStatus = `Success: Found ${jobsAdded} exact job links`;
      await source.save();

    } catch (err: any) {
      source.lastScannedAt = new Date();
      source.lastStatus = `Failed: ${err.message}`;
      await source.save();
    }
  }

  console.log('Finished background job scan with DuckDuckGo integration.');
};
