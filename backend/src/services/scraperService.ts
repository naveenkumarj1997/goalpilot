import * as cheerio from 'cheerio';
import { chromium } from 'playwright';
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

export async function fetchBroadJobs(role: string, locationStr?: string): Promise<any[]> {
  try {
    const searchTerms = [role];
    if (locationStr) searchTerms.push(locationStr);
    
    // Remotive API is a free, authentic job API
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
      sourceUrl: 'remotive.com',
      hash: job.id.toString(),
      discoveredAt: new Date()
    }));
    
    return jobs;
  } catch (err) {
    console.error('Error fetching broad jobs from Remotive API:', err);
    return [];
  }
}

export async function fetchTargetedJobs(companyName: string, companyUrl: string, role: string, locationStr?: string): Promise<any[]> {
  const jobs: any[] = [];
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    if (companyName.toLowerCase().includes('infosys') || companyName.toLowerCase().includes('infosis')) {
      const url = `https://digitalcareers.infosys.com/infosys/global-careers?location=&keyword=${encodeURIComponent(role)}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(5000); // Wait a bit longer for dynamic content
      
      const links = await page.$$eval('a', anchors => {
        return anchors
          .map(a => ({ text: a.textContent?.trim() || '', href: a.href }))
          .filter(a => a.href && a.href.includes('description/reqid'));
      });
      
      // Parse the results
      for (const link of links) {
        // Text is messy, split by newline and filter out empty lines
        const lines = link.text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const title = lines[0] || 'Unknown Title';
        
        // The second line in Infosys's text block is usually the location
        let parsedLocation = locationStr || 'Not specified';
        if (!locationStr && lines.length > 1) {
          // Clean up the location string (remove extra tabs/dashes)
          parsedLocation = lines[1].replace(/[\t-]+/g, ' ').trim();
        }

        jobs.push({
          title,
          company: 'Infosys',
          location: parsedLocation,
          experience: 'Not specified',
          link: link.href,
          sourceUrl: companyUrl,
          hash: generateHash('Infosys', title, link.href),
          discoveredAt: new Date()
        });
      }
    } else if (companyName.toLowerCase() === 'tcs') {
      try {
        const payload = {
          "jobCity": locationStr || "",
          "jobFunction": "",
          "jobExperience": "",
          "jobSkill": null,
          "pageNumber": "1",
          "userText": role,
          "jobTitleOrder": null,
          "jobCityOrder": null,
          "jobFunctionOrder": null,
          "jobExperienceOrder": null,
          "applyByOrder": null,
          "regular": true,
          "walkin": true
        };

        const response = await fetch("https://ibegin.tcsapps.com/candidate/api/v1/jobs/searchJ", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const json = await response.json();
        if (json.data && json.data.jobs) {
          for (const job of json.data.jobs.slice(0, 10)) {
            const title = job.jobTitle || 'Unknown Title';
            const loc = job.location || locationStr || 'Not specified';
            const exp = job.experience ? `${job.experience} Years` : 'Not specified';
            const link = `https://ibegin.tcsapps.com/candidate/#/job-details/${job.id}`;
            
            jobs.push({
              title,
              company: 'TCS',
              location: loc,
              experience: exp,
              link: link,
              sourceUrl: companyUrl,
              hash: generateHash('TCS', title, link),
              discoveredAt: new Date()
            });
          }
        }
      } catch (err) {
        console.error('Error fetching TCS jobs via API:', err);
      }
    } else {
      // Generic fallback for any other company
      const searchUrl = `${companyUrl.replace(/\/$/, '')}/search?q=${encodeURIComponent(role)}`;
      try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(4000);
        const links = await page.$$eval('a', anchors => {
          return anchors
            .map(a => ({ text: a.textContent?.trim() || '', href: a.href }))
            .filter(a => a.href && (a.href.toLowerCase().includes('job') || a.href.toLowerCase().includes('career')) && a.text.trim().length > 5);
        });
        
        for (const link of links.slice(0, 5)) {
          const title = link.text.split('\n')[0].trim();
          jobs.push({
            title,
            company: companyName,
            location: locationStr || 'Not specified',
            experience: 'Not specified',
            link: link.href,
            sourceUrl: companyUrl,
            hash: generateHash(companyName, title, link.href),
            discoveredAt: new Date()
          });
        }
      } catch (e) {
        console.warn(`Generic fallback scraping failed for ${companyName}:`, e);
      }
    }

    await browser.close();
    return jobs;
  } catch (err) {
    console.error(`Error fetching targeted jobs for ${companyName}:`, err);
    return [];
  }
}

export const runScrapers = async () => {
  const sources = await CompanySource.find({ isActive: true });
  const KeywordModel = (await import('../models/JobKeyword')).default;
  const keywordsFromDb = await KeywordModel.find({ isActive: true });
  
  let rolesToSearch = COMMON_ROLES;
  if (keywordsFromDb.length > 0) {
    rolesToSearch = keywordsFromDb.map(k => k.keyword);
  } else {
    // Seed defaults if empty
    for (const r of COMMON_ROLES) {
      await KeywordModel.create({ keyword: r });
    }
  }
  
  // 1. Broad Search Sweep
  console.log('Running Broad Job Search...');
  try {
    for (const role of rolesToSearch) {
      const foundJobs = await fetchBroadJobs(role);
      let jobsAdded = 0;
      for (const job of foundJobs) {
        const hash = generateHash(job.company, job.title, job.link);
        const exists = await Job.findOne({ hash });
        if (!exists) {
          await Job.create({
            title: job.title,
            company: job.company,
            location: job.location,
            experience: job.experience,
            link: job.link,
            hash,
            sourceId: undefined, // Broad jobs won't have a specific sourceId
          });
          jobsAdded++;
        }
      }
      console.log(`Broad search for ${role}: Added ${jobsAdded} jobs.`);
      await new Promise(r => setTimeout(r, 2000));
    }
  } catch (err) {
    console.error('Error during broad job search:', err);
  }

  // 2. Targeted Search Sweep
  if (sources.length === 0) {
    console.log('No active company sources found for targeted search.');
    return;
  }

  for (const source of sources) {
    console.log(`Scraping targeted links for ${source.name}...`);
    let jobsAdded = 0;
    
    try {
      for (const role of rolesToSearch) {
        const foundJobs = await fetchTargetedJobs(source.name, source.careerUrl, role);
        
        for (const job of foundJobs) {
          const hash = job.hash;
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

  console.log('Finished background job scan with Google Search integration.');
};
