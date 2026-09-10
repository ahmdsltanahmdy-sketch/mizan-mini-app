const Parser = require('rss-parser');
const parser = new Parser({
  customFields: {
    item: ['media:content', 'enclosure', 'image']
  }
});

const rssFeeds = {
  all: 'https://www.mizanonline.ir/fa/rss/allnews',
  home: 'https://www.mizanonline.ir/fa/rss/allnews',
  judicial: 'https://www.mizanonline.ir/fa/rss/17',
  humanRights: 'https://www.mizanonline.ir/fa/rss/7',
  legalMag: 'https://www.mizanonline.ir/fa/rss/16',
  politics: 'https://www.mizanonline.ir/fa/rss/10',
  photos: 'https://www.mizanonline.ir/fa/rss/4',
  society: 'https://www.mizanonline.ir/fa/rss/9',
  economy: 'https://www.mizanonline.ir/fa/rss/11',
  culture: 'https://www.mizanonline.ir/fa/rss/12',
  sports: 'https://www.mizanonline.ir/fa/rss/13',
  world: 'https://www.mizanonline.ir/fa/rss/14',
  multimedia: 'https://www.mizanonline.ir/fa/rss/2',
  infographic: 'https://www.mizanonline.ir/fa/rss/3'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { category = 'home' } = req.query;
  const feedUrl = rssFeeds[category] || rssFeeds.home;

  try {
    const feed = await parser.parseURL(feedUrl);
    const items = feed.items.map(item => ({
      id: item.guid || item.link,
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet || '',
      imageUrl: item.enclosure?.url || item['media:content']?.$.url || extractImageFromContent(item.content) || null
    }));

    return res.status(200).json({ success: true, items });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'خطا در دریافت اطلاعات از خبرگزاری میزان' });
  }
}

function extractImageFromContent(htmlContent) {
  if (!htmlContent) return null;
  const match = htmlContent.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}
