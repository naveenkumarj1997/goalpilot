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

export const fetchExactJobLinks = async (companyUrl: string, jobTitle: string, location?: string) => {
  try {
    let hostname = '';
    try {
      hostname = new URL(companyUrl).hostname;
    } catch(e) {
      hostname = companyUrl; // fallback
    }
    
    const query = `site:${hostname} "${jobTitle}" ${location || ''} job`;
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const jobs: any[] = [];
    
    $('.result__url').each((i, el) => {
      if (i >= 5) return;
      const ddgUrl = $(el).attr('href');
      if (ddgUrl) {
        try {
          const uddgMatch = ddgUrl.match(/uddg=([^&]+)/);
          if (uddgMatch && uddgMatch[1]) {
            const realUrl = decodeURIComponent(uddgMatch[1]);
            jobs.push({
              title: jobTitle,
              location: location || 'Remote/Various',
              link: realUrl,
              experience: 'Check Listing'
            });
          }
        } catch (e) {
          console.error("Error decoding DDG URL", e);
        }
      }
    });
    
    return jobs;
  } catch (err) {
    console.error("Search integration failed:", err);
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
