import Parser from 'rss-parser';
import crypto from 'crypto';
import MarketNews from '../models/MarketNews';
import MarketNewsInteraction from '../models/MarketNewsInteraction';
import { analyzeNews } from './marketAiService';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'enclosure', 'content:encoded']
  }
});

const FEEDS = [
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', category: 'Finance' }, // CNBC Finance
  { url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', category: 'Global Markets' }, // WSJ Markets
  { url: 'https://techcrunch.com/category/startups/feed/', category: 'Startups' },
  { url: 'https://news.google.com/rss/search?q="tech+layoffs"&hl=en-US&gl=US&ceid=US:en', category: 'Layoffs' },
  { url: 'https://news.google.com/rss/search?q="crypto"&hl=en-US&gl=US&ceid=US:en', category: 'Crypto' }
];

const cleanUpOldNews = async () => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const oldNews = await MarketNews.find({ createdAt: { $lt: threeDaysAgo } }, '_id');
    const oldNewsIds = oldNews.map(n => n._id);

    const savedInteractions = await MarketNewsInteraction.find({ newsItem: { $in: oldNewsIds }, isSaved: true });
    const savedNewsIds = savedInteractions.map(i => i.newsItem.toString());

    const idsToDelete = oldNewsIds.filter(id => !savedNewsIds.includes(id.toString()));

    const result = await MarketNews.deleteMany({ _id: { $in: idsToDelete } });
    await MarketNewsInteraction.deleteMany({ newsItem: { $in: idsToDelete } });
    
    console.log(`[MARKET CLEANUP] Deleted ${result.deletedCount} old, unsaved news items.`);
  } catch (err) {
    console.error('[MARKET CLEANUP] Error:', err);
  }
};

export const aggregateMarketNews = async () => {
  console.log('[MARKET] Starting Market News Aggregation...');
  let itemsAdded = 0;

  for (const feedConfig of FEEDS) {
    try {
      const feed = await parser.parseURL(feedConfig.url);
      
      // Top 5 from each feed to save API quota!
      const items = feed.items.slice(0, 5);
      
      for (const item of items) {
        if (!item.title || !item.link) continue;

        const hash = crypto.createHash('md5').update(`${item.title}_${item.link}`).digest('hex');
        const exists = await MarketNews.findOne({ hash });

        if (!exists) {
          let imageUrl = '';
          if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
            imageUrl = item['media:content'].$.url;
          } else if (item.enclosure && item.enclosure.url) {
            imageUrl = item.enclosure.url;
          }

          let summary = item.contentSnippet || item.summary || '';
          if (summary.length > 500) summary = summary.substring(0, 500) + '...';

          const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

          // AI Analysis (handles fallback internally)
          const aiData = await analyzeNews(item.title, summary);

          await MarketNews.create({
            title: item.title.trim(),
            source: feed.title || 'Unknown Source',
            link: item.link,
            summary: summary.trim(),
            pubDate,
            categories: [feedConfig.category],
            imageUrl,
            hash,
            ...aiData
          });
          itemsAdded++;
        } else {
          if (!exists.categories.includes(feedConfig.category)) {
            exists.categories.push(feedConfig.category);
            await exists.save();
          }
        }
      }
    } catch (err) {
      console.error(`[MARKET] Error parsing feed ${feedConfig.url}:`, err);
    }
  }

  console.log(`[MARKET] Aggregation complete. Added ${itemsAdded} new items.`);
  await cleanUpOldNews();
};
