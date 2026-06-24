import Parser from 'rss-parser';
import crypto from 'crypto';
import IntelligenceItem from '../models/IntelligenceItem';
import IntelligenceBookmark from '../models/IntelligenceBookmark';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'enclosure', 'content:encoded']
  }
});

const FEEDS = [
  { url: 'https://techcrunch.com/feed/', category: 'Technology' },
  { url: 'https://news.ycombinator.com/rss', category: 'Startups' },
  { url: 'https://news.google.com/rss/search?q=AI+OR+"Artificial+Intelligence"&hl=en-US&gl=US&ceid=US:en', category: 'AI' },
  { url: 'https://news.google.com/rss/search?q="tech+layoffs"+OR+"startup+layoffs"&hl=en-US&gl=US&ceid=US:en', category: 'Layoffs' },
  { url: 'https://news.google.com/rss/search?q="software+developer+hiring"+OR+"tech+jobs"&hl=en-US&gl=US&ceid=US:en', category: 'Hiring' },
  { url: 'https://news.google.com/rss/search?q="developer+salary"&hl=en-US&gl=US&ceid=US:en', category: 'Salaries' },
  { url: 'https://news.google.com/rss/search?q="world+news"&hl=en-US&gl=US&ceid=US:en', category: 'World News' },
  { url: 'https://news.google.com/rss/search?q="india+technology"+OR+"india+IT+news"&hl=en-IN&gl=IN&ceid=IN:en', category: 'Indian Tech' },
  { url: 'https://news.google.com/rss/search?q="tamil+nadu+technology"+OR+"chennai+IT+news"&hl=en-IN&gl=IN&ceid=IN:en', category: 'Tamil Nadu Tech' }
];

export const aggregateIntelligence = async () => {
  console.log('[INTELLIGENCE] Starting RSS Aggregation...');
  let itemsAdded = 0;

  for (const feedConfig of FEEDS) {
    try {
      const feed = await parser.parseURL(feedConfig.url);
      
      // Get top 20 items to avoid flooding
      const items = feed.items.slice(0, 20);
      
      for (const item of items) {
        if (!item.title || !item.link) continue;

        const hash = crypto.createHash('md5').update(`${item.title}_${item.link}`).digest('hex');
        const exists = await IntelligenceItem.findOne({ hash });

        if (!exists) {
          // Extract an image if available
          let imageUrl = '';
          if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
            imageUrl = item['media:content'].$.url;
          } else if (item.enclosure && item.enclosure.url) {
            imageUrl = item.enclosure.url;
          } else {
            // regex to extract img tag from content:encoded
            const content = item['content:encoded'] || item.content || '';
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch && imgMatch[1]) {
              imageUrl = imgMatch[1];
            }
          }

          let summary = item.contentSnippet || item.summary || '';
          if (summary.length > 500) summary = summary.substring(0, 500) + '...';

          const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

          await IntelligenceItem.create({
            title: item.title.trim(),
            source: feed.title || 'Unknown Source',
            link: item.link,
            summary: summary.trim(),
            pubDate,
            categories: [feedConfig.category],
            imageUrl,
            hash
          });
          itemsAdded++;
        } else {
          // If exists, just ensure the category is included
          if (!exists.categories.includes(feedConfig.category)) {
            exists.categories.push(feedConfig.category);
            await exists.save();
          }
        }
      }
    } catch (err) {
      console.error(`[INTELLIGENCE] Error parsing feed ${feedConfig.url}:`, err);
    }
  }

  console.log(`[INTELLIGENCE] Aggregation complete. Added ${itemsAdded} new items.`);
};

export const cleanupOldIntelligence = async () => {
  console.log('[INTELLIGENCE] Starting 30-day cleanup...');
  try {
    // Date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all bookmarked items so we don't delete them
    const bookmarks = await IntelligenceBookmark.find().select('item');
    const bookmarkedItemIds = bookmarks.map(b => b.item);

    // Delete items older than 30 days that are NOT bookmarked
    const result = await IntelligenceItem.deleteMany({
      pubDate: { $lt: thirtyDaysAgo },
      _id: { $nin: bookmarkedItemIds }
    });

    console.log(`[INTELLIGENCE] Cleanup complete. Deleted ${result.deletedCount} old items.`);
  } catch (err) {
    console.error('[INTELLIGENCE] Error during cleanup:', err);
  }
};
