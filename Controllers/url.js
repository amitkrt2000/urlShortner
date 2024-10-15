let nanoid;

async function loadNanoid() {
  const { nanoid: importedNanoid } = await import('nanoid');
  nanoid = importedNanoid;
}

loadNanoid();

const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Normalize the URL to avoid issues like 'http://example.com' vs 'https://example.com'
  let normalizedURL = body.url;
  if (!normalizedURL.startsWith('http://') && !normalizedURL.startsWith('https://')) {
    normalizedURL = 'http://' + normalizedURL;
  }

  // Check if the URL already exists in the database
  const existingURL = await URL.findOne({ redirectURL: normalizedURL });

  if (existingURL) {
    // If the URL already exists, fetch all URLs and render the view with the existing shortId
    const allurls = await URL.find({});
    return res.render("home", { id: existingURL.shortId, urls: allurls });
  }

  // If URL is new, generate a new shortId using nanoid
  const shortID = nanoid();  // Use nanoid

  await URL.create({
    shortId: shortID,
    redirectURL: normalizedURL,
    visitHistory: [],
  });

  // Fetch all URLs after creating the new one and pass them to the view
  const allurls = await URL.find({});
  return res.render("home", { id: shortID, urls: allurls });
}


async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  if (!result) {
    return res.status(404).json({ message: 'Short URL not found' });
  }

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
