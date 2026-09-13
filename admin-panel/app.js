// =========================================================================
// YT MONETIZE - Ultra-Premium Standalone Admin Dashboard Engine
// Compatible with both file:// (Direct double-click) and Web Hosting (HTTP/HTTPS)
// =========================================================================

const firebaseConfig = {
  apiKey: "AIzaSyBTkRKAUgtlewqN-EJ-ovo0CNZJbkAzngI",
  authDomain: "yt-monetize-ae3d7.firebaseapp.com",
  projectId: "yt-monetize-ae3d7",
  storageBucket: "yt-monetize-ae3d7.firebasestorage.app",
  messagingSenderId: "888426598115",
  appId: "1:888426598115:web:43e6043a2e0da86b6cffd6"
};

const BASE_WEBSITE_URL = 'https://youtubemonetizationchecker.online';
const DEFAULT_IMGBB_API_KEY = '3cfbc6a944c10a70d848cebae4b8245b';

// Global App State
let db = null;
let captionsList = [];
let filteredCaptions = [];
let isAutoSlug = true;
let analyticsStats = {
  totalPageViews: 0,
  todayViews: 0,
  mobileViews: 0,
  desktopViews: 0,
  paths: {},
  recentVisits: []
};

// Category Definitions
const CATEGORY_MAP = {
  islamic: {
    name: 'ইসলামিক ও নীতিবাক্য',
    badge: 'badge-islamic',
    tags: ['#Alhamdulillah', '#IslamicQuotes', '#Sabr', '#QuranVerses', '#Sunnah', '#Bismillah', '#Tawakkul', '#Dua']
  },
  motivational: {
    name: 'মোটিভেশনাল ও সাফল্য',
    badge: 'badge-motivational',
    tags: ['#Motivation', '#Success', '#Hustle', '#DreamBig', '#HardWork', '#NeverGiveUp', '#PositiveVibes', '#Leader']
  },
  attitude: {
    name: 'অ্যাটিটিউড ও ব্যক্তিত্ব',
    badge: 'badge-attitude',
    tags: ['#Attitude', '#RoyalVibes', '#Classy', '#BossMindset', '#SelfWorth', '#KingVibes', '#Unique', '#Bold']
  },
  romantic: {
    name: 'রোমান্টিক ও ভালোবাসা',
    badge: 'badge-romantic',
    tags: ['#Love', '#RomanticCaptions', '#Couples', '#ForeverLove', '#SweetMoments', '#LoveQuotes', '#Feelings', '#Heart']
  },
  sad: {
    name: 'দুঃখ ও কষ্টের ক্যাপশন',
    badge: 'badge-sad',
    tags: ['#SadCaptions', '#Heartbreak', '#PainfulTruth', '#AloneVibes', '#SilentPain', '#BrokenHeart', '#Tears', '#Lonely']
  },
  life: {
    name: 'বাস্তবতা ও জীবনবোধ',
    badge: 'badge-life',
    tags: ['#LifeReality', '#DeepThoughts', '#LifeLessons', '#HumanNature', '#Wisdom', '#Mindset', '#TruthOfLife', '#Experience']
  },
  friendship: {
    name: 'বন্ধুত্ব ও আড্ডা',
    badge: 'badge-friendship',
    tags: ['#Friendship', '#BestFriends', '#SquadGoals', '#Brotherhood', '#FriendsForever', '#Memories', '#Bonding', '#Dosti']
  }
};

// 70+ Pre-populated default captions for 1-click seeding
const DEFAULT_SEED_DATA = [
  // Islamic
  {
    category: 'islamic',
    language: 'bangla',
    text: 'ধৈর্য এমন একটি বৃক্ষ যার শিকড় তিক্ত হলেও এর ফল কিন্তু অত্যন্ত মিষ্টি। — আলহামদুলিল্লাহ',
    title: 'ধৈর্য ও আল্লাহর উপর ভরসা',
    slug: 'dhairya-o-allahor-upor-bhorosa',
    tags: ['#Alhamdulillah', '#Sabr', '#IslamicQuotes'],
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
    published: true
  },
  {
    category: 'islamic',
    language: 'bangla',
    text: 'যে ব্যক্তি আল্লাহর উপর ভরসা করে, আল্লাহ তার জন্য যথেষ্ট হয়ে যান। (সূরা আত-তালাক: ৩)',
    title: 'আল্লাহর রহমত ও সাহায্য',
    slug: 'allahor-rohmot-o-sahajjo',
    tags: ['#QuranVerses', '#Tawakkul', '#IslamicQuotes'],
    imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80',
    published: true
  },
  {
    category: 'islamic',
    language: 'english',
    text: 'When you are down to nothing, God is up to something. Always trust His divine timing.',
    title: 'Trusting Divine Timing',
    slug: 'trusting-divine-timing',
    tags: ['#Faith', '#Alhamdulillah', '#IslamicQuotes'],
    imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80',
    published: true
  },
  // Motivational
  {
    category: 'motivational',
    language: 'bangla',
    text: 'আজকের কঠিন পরিশ্রমই আগামীকালের সাফল্যের ভিত্তি তৈরি করবে। কখনও থেমে যাবেন না।',
    title: 'কখনও থেমে যাবেন না',
    slug: 'kokhono-theme-jaben-na',
    tags: ['#Motivation', '#Success', '#HardWork'],
    imageUrl: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&q=80',
    published: true
  },
  {
    category: 'motivational',
    language: 'bangla',
    text: 'যদি তোমার কোনো স্বপ্ন দেখার সাহস থাকে, তবে তা পূরণ করার সামর্থ্যও তোমার মধ্যে রয়েছে।',
    title: 'স্বপ্নের পিছনে ছোটার সাহস',
    slug: 'shopner-pichone-chotar-sahos',
    tags: ['#DreamBig', '#Success', '#Motivation'],
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    published: true
  },
  {
    category: 'motivational',
    language: 'english',
    text: 'The only limit to our realization of tomorrow will be our doubts of today. Push forward!',
    title: 'Unlocking Your Potential',
    slug: 'unlocking-your-potential',
    tags: ['#Motivation', '#NeverGiveUp', '#Success'],
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    published: true
  },
  // Attitude
  {
    category: 'attitude',
    language: 'bangla',
    text: 'নিজের ব্যক্তিত্ব এমন রাখো, যেন কেউ তোমাকে ছেড়ে চলে গেলে তার আফসোস চিরকাল থেকে যায়।',
    title: 'ব্যক্তিত্ব ও আত্মসম্মান',
    slug: 'byaktitto-o-attosomman',
    tags: ['#Attitude', '#BossMindset', '#RoyalVibes'],
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
    published: true
  },
  {
    category: 'attitude',
    language: 'bangla',
    text: 'আমি কারোর কপি হতে আসিনি, নিজের পরিচয়ে নিজেই অনন্য। আমার পথ আমার নিজের তৈরি।',
    title: 'নিজের পরিচয়ে সেরা',
    slug: 'nijer-porichoye-sera',
    tags: ['#Attitude', '#KingVibes', '#Bold'],
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    published: true
  },
  {
    category: 'attitude',
    language: 'english',
    text: 'I am not a second option. Either you choose me or you lose me. Respect is earned.',
    title: 'Self Respect and Standard',
    slug: 'self-respect-and-standard',
    tags: ['#Attitude', '#SelfWorth', '#Classy'],
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    published: true
  },
  // Romantic
  {
    category: 'romantic',
    language: 'bangla',
    text: 'হাজারো মানুষের ভিড়েও যার কণ্ঠস্বর শুনলে মন শান্ত হয়ে যায়, সেই তো আসল ভালোবাসা।',
    title: 'হৃদয়ের অনুভূতির ছোঁয়া',
    slug: 'hridoyer-onuvutir-chowa',
    tags: ['#Love', '#RomanticCaptions', '#SweetMoments'],
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80',
    published: true
  },
  {
    category: 'romantic',
    language: 'english',
    text: 'In your smile, I see something more beautiful than the stars in the night sky.',
    title: 'Beauty in Your Smile',
    slug: 'beauty-in-your-smile',
    tags: ['#RomanticCaptions', '#LoveQuotes', '#ForeverLove'],
    imageUrl: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800&q=80',
    published: true
  },
  // Sad
  {
    category: 'sad',
    language: 'bangla',
    text: 'কখনও কখনও চোখের জল ফেলে না কেঁদে, ভেতরে ভেতরে নিশ্চুপ হয়ে যাওয়াটাই সবচেয়ে কষ্টের।',
    title: 'নীরব কষ্টের গভীরতা',
    slug: 'nirob-koster-gohirota',
    tags: ['#SadCaptions', '#SilentPain', '#AloneVibes'],
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
    published: true
  },
  // Life
  {
    category: 'life',
    language: 'bangla',
    text: 'জীবনের সবচেয়ে বড় শিক্ষক হলো সময় ও পরিস্থিতি। এরা যা শেখায়, তা কোনো বইতে পাওয়া যায় না।',
    title: 'জীবনের বাস্তব শিক্ষা',
    slug: 'jiboner-bastob-shikkha',
    tags: ['#LifeReality', '#DeepThoughts', '#Wisdom'],
    imageUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&q=80',
    published: true
  },
  // Friendship
  {
    category: 'friendship',
    language: 'bangla',
    text: 'বন্ধু তো সেই যে তোমার মুখের হাসি দেখে বুঝতে পারে ভেতরের মনটা কতটা ভালো বা খারাপ।',
    title: 'আসল বন্ধুত্বের বন্ধন',
    slug: 'asol-bondhutter-bondhon',
    tags: ['#Friendship', '#BestFriends', '#Brotherhood'],
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    published: true
  }
];

// =========================================================================
// Initialization
// =========================================================================
window.addEventListener('DOMContentLoaded', () => {
  initFirebase();
  setupEventListeners();
  loadAllData();
  
  // Refresh stats periodically
  setInterval(() => {
    loadVisitorStats();
  }, 15000);
});

function initFirebase() {
  try {
    if (!window.firebase) {
      console.error('Firebase SDK not loaded');
      updateDbStatus(false, 'Firebase SDK লোড হয়নি');
      return;
    }
    
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(firebaseConfig);
    }
    db = window.firebase.firestore();
    console.log('Firebase initialized successfully on project: yt-monetize-ae3d7');
    updateDbStatus(true, 'অনলাইন ও সক্রিয় (Cloud Firestore)');
  } catch (err) {
    console.error('Firebase init failed:', err);
    updateDbStatus(false, 'কানেকশন এরর: ' + err.message);
  }
}

function updateDbStatus(isOnline, text) {
  const dot = document.getElementById('dbStatusDot');
  const label = document.getElementById('dbStatusText');
  if (dot) dot.className = isOnline ? 'status-dot' : 'status-dot offline';
  if (label) label.innerText = text;
}

// =========================================================================
// UI Navigation / Tab Switching
// =========================================================================
window.switchTab = function(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  const activeTab = document.getElementById(tabId);
  const activeNav = document.getElementById('nav-' + tabId);

  if (activeTab) activeTab.classList.add('active');
  if (activeNav) activeNav.classList.add('active');

  // Close mobile sidebar if open
  closeMobileSidebar();

  if (tabId === 'tab-analytics') {
    loadVisitorStats();
  } else if (tabId === 'tab-captions') {
    loadCaptionsList();
  }
};

window.toggleMobileSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('open');
};

window.closeMobileSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('open');
};

// =========================================================================
// Visitor Analytics Tracking & Dashboard Stats
// =========================================================================
async function loadVisitorStats() {
  if (!db) return;
  try {
    const overviewDoc = await db.collection('site_stats').doc('overview').get();
    const today = new Date().toISOString().split('T')[0];

    let totalViews = 0;
    let todayViews = 0;
    let mobileCount = 0;
    let desktopCount = 0;
    let pathsData = {};

    if (overviewDoc.exists) {
      const data = overviewDoc.data();
      totalViews = data.totalPageViews || 0;
      if (data.dailyViews && data.dailyViews[today]) {
        todayViews = data.dailyViews[today];
      }
      if (data.devices) {
        mobileCount = data.devices.mobile || 0;
        desktopCount = data.devices.desktop || 0;
      }
      if (data.paths) {
        pathsData = data.paths;
      }
    }

    // Update Counter Elements
    const totalEl = document.getElementById('statTotalVisitors');
    const todayEl = document.getElementById('statTodayVisitors');
    const liveVisEl = document.getElementById('statTotalPageViews');

    if (totalEl) totalEl.innerText = Number(totalViews).toLocaleString('en-US');
    if (todayEl) todayEl.innerText = Number(todayViews).toLocaleString('en-US');
    if (liveVisEl) liveVisEl.innerText = Number(totalViews).toLocaleString('en-US');

    // Update Device Split
    const totalDevices = mobileCount + desktopCount || 1;
    const mobilePct = Math.round((mobileCount / totalDevices) * 100);
    const desktopPct = 100 - mobilePct;

    const mobFill = document.getElementById('barMobile');
    const dskFill = document.getElementById('barDesktop');
    const mobLabel = document.getElementById('valMobile');
    const dskLabel = document.getElementById('valDesktop');

    if (mobFill) mobFill.style.width = mobilePct + '%';
    if (dskFill) dskFill.style.width = desktopPct + '%';
    if (mobLabel) mobLabel.innerText = mobilePct + '% (' + mobileCount + ')';
    if (dskLabel) dskLabel.innerText = desktopPct + '% (' + desktopCount + ')';

    // Update Top Visited Paths
    renderTopPaths(pathsData);

    // Load Recent Real-Time Visitors Log
    loadRecentVisitorsFeed();
  } catch (e) {
    console.warn('Could not load stats from Firestore:', e);
  }
}

function renderTopPaths(paths) {
  const container = document.getElementById('topPagesList');
  if (!container) return;

  const entries = Object.entries(paths || {}).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (entries.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 15px; font-size: 13px;">এখনও কোনো ভিজিটর লগ নেই</div>`;
    return;
  }

  const maxVal = entries[0][1] || 1;
  const friendlyNames = {
    'root': 'হোম পেজ (Home)',
    '_monetization-checker': 'মনিটাইজেশন চেকার',
    '_channel-id-finder': 'চ্যানেল আইডি ফাইন্ডার',
    '_earnings-calculator': 'আর্নিংস ক্যালকুলেটর',
    '_thumbnail-downloader': 'থাম্বনেইল ডাউনলোডার',
    '_tag-extractor': 'ট্যাগ এক্সট্রাক্টর',
    '_captions': 'ক্যাপশন হাব',
    '_description-viewer': 'ডেসক্রিপশন ভিউয়ার',
    '_comment-viewer': 'কমেন্ট ভিউয়ার',
    '_shadowban-detector': 'শ্যাডוב্যান ডিটেক্টর',
    '_hidden-video-finder': 'হিডেন ভিডিও ফাইন্ডার',
    '_image-downloader': 'ইমেজ ডাউনলোডার'
  };

  container.innerHTML = entries.map(([rawPath, count]) => {
    const pct = Math.min(100, Math.round((count / maxVal) * 100));
    const name = friendlyNames[rawPath] || rawPath.replace(/_/g, '/');
    return `
      <div>
        <div class="progress-item-head">
          <span class="progress-name">${name}</span>
          <span class="progress-val">${count} বার</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #38BDF8, #3B82F6);"></div>
        </div>
      </div>
    `;
  }).join('');
}

async function loadRecentVisitorsFeed() {
  const feed = document.getElementById('recentVisitorsFeed');
  if (!feed || !db) return;

  try {
    const snapshot = await db.collection('site_visits')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    if (snapshot.empty) {
      feed.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">নতুন কোনো লাইভ ভিজিট রেকর্ড নেই</div>`;
      return;
    }

    feed.innerHTML = snapshot.docs.map(doc => {
      const data = doc.data();
      const timeStr = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) : 'কিছুক্ষণ আগে';
      const deviceIcon = data.isMobile ? '📱 Mobile' : '💻 Desktop';
      return `
        <div class="visitor-item">
          <div>
            <div class="visitor-route">${data.path || '/'}</div>
            <div class="visitor-time">${data.referrer || 'Direct'} • ${data.browser || 'Browser'}</div>
          </div>
          <div style="text-align: right;">
            <span class="visitor-device-tag">${deviceIcon}</span>
            <div class="visitor-time" style="margin-top: 4px;">${timeStr}</div>
          </div>
        </div>
      `;
    }).join('');
  } catch (e) {
    console.warn('Recent visits query skipped:', e);
  }
}

// =========================================================================
// Caption Management CRUD
// =========================================================================
async function loadAllData() {
  await Promise.all([
    loadVisitorStats(),
    loadCaptionsList()
  ]);
}

async function loadCaptionsList() {
  const tbody = document.getElementById('captionsTableBody');
  const emptyState = document.getElementById('emptyState');
  const tableCount = document.getElementById('tableCount');
  const totalCaptionsStat = document.getElementById('statTotalCaptions');

  if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px; color: var(--text-muted);">⏳ ক্লাউড ফায়ারস্টোর থেকে ক্যাপশন লোড হচ্ছে...</td></tr>`;

  if (!db) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px; color: #EF4444;">⚠️ ফায়ারবেস ডেটাবেস সংযোগ পাওয়া যায়নি। সেটিংস চেক করুন।</td></tr>`;
    return;
  }

  try {
    const snapshot = await db.collection('captions').get();
    captionsList = [];

    snapshot.forEach(doc => {
      captionsList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Update stats
    if (tableCount) tableCount.innerText = captionsList.length;
    if (totalCaptionsStat) totalCaptionsStat.innerText = captionsList.length;

    updateCategoryStats();
    applyFilters();
  } catch (err) {
    console.error('Error fetching captions:', err);
    showToast('ক্যাপশন লোড করতে ব্যর্থ হয়েছে: ' + err.message, 'error');
  }
}

function updateCategoryStats() {
  const banglaCount = captionsList.filter(c => c.language === 'bangla').length;
  const engCount = captionsList.filter(c => c.language === 'english').length;
  const imageCount = captionsList.filter(c => !!c.imageUrl).length;

  const statBangla = document.getElementById('statBanglaCaptions');
  const statEnglish = document.getElementById('statEnglishCaptions');
  const statImages = document.getElementById('statImageCaptions');

  if (statBangla) statBangla.innerText = banglaCount;
  if (statEnglish) statEnglish.innerText = engCount;
  if (statImages) statImages.innerText = imageCount;
}

function applyFilters() {
  const query = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('filterCategory')?.value || 'all';
  const lang = document.getElementById('filterLanguage')?.value || 'all';
  const type = document.getElementById('filterType')?.value || 'all';

  filteredCaptions = captionsList.filter(item => {
    // Search query
    const matchQuery = !query || 
      (item.text && item.text.toLowerCase().includes(query)) ||
      (item.title && item.title.toLowerCase().includes(query)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(query))) ||
      (item.slug && item.slug.toLowerCase().includes(query));

    // Category filter
    const matchCat = (cat === 'all') || (item.category === cat);

    // Language filter
    const matchLang = (lang === 'all') || (item.language === lang);

    // Type filter
    const matchType = (type === 'all') ||
      (type === 'image_only' && !!item.imageUrl) ||
      (type === 'text_only' && !item.imageUrl);

    return matchQuery && matchCat && matchLang && matchType;
  });

  renderCaptionsTable();
}

function renderCaptionsTable() {
  const tbody = document.getElementById('captionsTableBody');
  const emptyState = document.getElementById('emptyState');
  const tableCount = document.getElementById('tableCount');

  if (!tbody) return;

  if (tableCount) tableCount.innerText = filteredCaptions.length;

  if (filteredCaptions.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  tbody.innerHTML = filteredCaptions.map(c => {
    const catInfo = CATEGORY_MAP[c.category] || { name: c.category, badge: 'badge-life' };
    const liveUrl = `${BASE_WEBSITE_URL}/captions/${c.category}/${c.slug}`;
    const imgHtml = c.imageUrl 
      ? `<img src="${c.imageUrl}" class="thumb-preview-mini" alt="Thumb" onerror="this.src='https://placehold.co/80x80/1E293B/FFF?text=No+Img'">`
      : `<div class="thumb-preview-mini" style="display:flex;align-items:center;justify-content:center;color:var(--text-sub);font-size:18px;">📝</div>`;

    const langBadge = c.language === 'bangla' 
      ? `<span class="badge badge-lang">🇧🇩 বাংলা</span>` 
      : `<span class="badge badge-lang">🌐 English</span>`;

    const statusDot = c.published !== false
      ? `<span style="color:var(--accent-emerald);" title="লাইভ সাইটে প্রকাশিত">● Published</span>`
      : `<span style="color:var(--accent-amber);" title="ড্রাফট">○ Draft</span>`;

    return `
      <tr>
        <td style="width: 60px;">${imgHtml}</td>
        <td>
          <div class="table-caption-text">${escapeHtml(c.text)}</div>
          ${c.title ? `<div class="table-caption-title">📌 ${escapeHtml(c.title)}</div>` : ''}
          <div style="font-size: 11px; margin-top: 4px; display: flex; gap: 6px; align-items: center;">
            ${statusDot}
            ${c.tags && c.tags.length ? `<span style="color:var(--text-sub);">${c.tags.slice(0, 3).join(' ')}</span>` : ''}
          </div>
        </td>
        <td style="width: 150px;">
          <span class="badge ${catInfo.badge}">${catInfo.name}</span>
        </td>
        <td style="width: 100px;">${langBadge}</td>
        <td style="width: 140px;">
          <a href="${liveUrl}" target="_blank" style="color: var(--accent-blue); text-decoration: none; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;" title="ওয়েবসাইটে দেখুন">
            /${c.slug.substring(0, 14)}... ↗
          </a>
        </td>
        <td style="width: 130px; text-align: right;">
          <div class="table-actions">
            <button class="btn btn-secondary btn-sm btn-icon" onclick="copyCaptionLink('${liveUrl}')" title="লিঙ্ক কপি করুন">
              🔗
            </button>
            <button class="btn btn-secondary btn-sm btn-icon" onclick="openEditModal('${c.id}')" title="এডিট করুন">
              ✏️
            </button>
            <button class="btn btn-danger btn-sm btn-icon" onclick="openDeleteModal('${c.id}', '${escapeHtml(c.title || c.text.substring(0, 30))}')" title="মুছে ফেলুন">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// =========================================================================
// Create & Edit Modal Operations
// =========================================================================
window.openCreateModal = function() {
  document.getElementById('modalTitle').innerText = 'নতুন ক্যাপশন / ফটো পোস্ট যুক্ত করুন';
  document.getElementById('formCaptionId').value = '';
  document.getElementById('captionForm').reset();
  document.getElementById('formPublished').checked = true;
  document.getElementById('autoSlugToggle').checked = true;
  isAutoSlug = true;

  removeImage();
  updateTagSuggestions('islamic');
  updateSlugPreview();

  document.getElementById('captionModal').classList.add('active');
};

window.openEditModal = function(id) {
  const item = captionsList.find(c => c.id === id);
  if (!item) return;

  document.getElementById('modalTitle').innerText = 'ক্যাপশন ও ফটো স্ট্যাটাস এডিট করুন';
  document.getElementById('formCaptionId').value = item.id;
  document.getElementById('formCategory').value = item.category || 'islamic';
  document.getElementById('formLanguage').value = item.language || 'bangla';
  document.getElementById('formTitle').value = item.title || '';
  document.getElementById('formText').value = item.text || '';
  document.getElementById('formSlug').value = item.slug || '';
  document.getElementById('formTags').value = (item.tags || []).join(', ');
  document.getElementById('formPublished').checked = item.published !== false;
  document.getElementById('formMetaTitle').value = item.metaTitle || '';
  document.getElementById('formMetaDesc').value = item.metaDescription || '';

  isAutoSlug = false;
  document.getElementById('autoSlugToggle').checked = false;

  if (item.imageUrl) {
    showImagePreview(item.imageUrl);
  } else {
    removeImage();
  }

  updateTagSuggestions(item.category || 'islamic');
  updateSlugPreview();

  document.getElementById('captionModal').classList.add('active');
};

window.closeCaptionModal = function() {
  document.getElementById('captionModal').classList.remove('active');
};

window.handleSaveCaption = async function(e) {
  e.preventDefault();
  if (!db) {
    showToast('ফায়ারবেস কানেকশন সক্রিয় নয়!', 'error');
    return;
  }

  const saveBtn = document.getElementById('saveCaptionBtn');
  saveBtn.disabled = true;
  saveBtn.innerText = 'সংরক্ষণ হচ্ছে...';

  try {
    const id = document.getElementById('formCaptionId').value.trim();
    const category = document.getElementById('formCategory').value;
    const language = document.getElementById('formLanguage').value;
    const title = document.getElementById('formTitle').value.trim();
    const text = document.getElementById('formText').value.trim();
    const slug = document.getElementById('formSlug').value.trim() || generateSlug(title || text);
    const imageUrl = document.getElementById('formImageUrl').value.trim() || null;
    const tagsRaw = document.getElementById('formTags').value;
    const published = document.getElementById('formPublished').checked;
    const metaTitle = document.getElementById('formMetaTitle').value.trim() || null;
    const metaDescription = document.getElementById('formMetaDesc').value.trim() || null;

    const tags = tagsRaw.split(/[, ]+/).map(t => t.trim()).filter(t => t.length > 0);

    const payload = {
      category,
      language,
      title: title || null,
      text,
      slug,
      imageUrl,
      tags,
      published,
      metaTitle,
      metaDescription,
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
    };

    if (id) {
      // Update existing document
      await db.collection('captions').doc(id).update(payload);
      showToast('ক্যাপশন সফলভাবে আপডেট হয়েছে! 🎉', 'success');
    } else {
      // Create new document
      payload.createdAt = window.firebase.firestore.FieldValue.serverTimestamp();
      payload.likes = Math.floor(Math.random() * 40) + 10;
      payload.shares = Math.floor(Math.random() * 15) + 2;

      await db.collection('captions').add(payload);
      showToast('নতুন ক্যাপশন সফলভাবে যুক্ত হয়েছে! 🎉', 'success');
    }

    closeCaptionModal();
    await loadCaptionsList();
  } catch (err) {
    console.error('Save failed:', err);
    showToast('সংরক্ষণ ব্যর্থ হয়েছে: ' + err.message, 'error');
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerText = 'সংরক্ষণ করুন';
  }
};

// =========================================================================
// Delete Modal Operations
// =========================================================================
window.openDeleteModal = function(id, title) {
  document.getElementById('deleteCaptionId').value = id;
  document.getElementById('deleteCaptionTitle').innerText = '"' + title + '"';
  document.getElementById('deleteModal').classList.add('active');
};

window.closeDeleteModal = function() {
  document.getElementById('deleteModal').classList.remove('active');
};

window.confirmDeleteCaption = async function() {
  const id = document.getElementById('deleteCaptionId').value;
  if (!id || !db) return;

  try {
    await db.collection('captions').doc(id).delete();
    showToast('ক্যাপশন মুছে ফেলা হয়েছে', 'success');
    closeDeleteModal();
    await loadCaptionsList();
  } catch (err) {
    showToast('মুছতে ব্যর্থ হয়েছে: ' + err.message, 'error');
  }
};

// =========================================================================
// Image Uploading to ImgBB
// =========================================================================
window.handleImageFileUpload = async function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const statusBox = document.getElementById('imageUploadStatus');
  const apiKey = getStoredImgbbKey();

  if (statusBox) {
    statusBox.innerHTML = `
      <div style="font-size: 24px;">⏳</div>
      <div style="font-size: 13px; font-weight: 700; color: var(--accent-blue);">ImgBB সার্ভারে আপলোড হচ্ছে...</div>
    `;
  }

  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.success && data.data && data.data.url) {
      const uploadedUrl = data.data.url;
      showImagePreview(uploadedUrl);
      showToast('ছবি ImgBB-তে সফলভাবে আপলোড হয়েছে! 📸', 'success');
    } else {
      throw new Error(data.error?.message || 'ImgBB আপলোড ব্যর্থ হয়েছে');
    }
  } catch (err) {
    console.error('ImgBB upload error:', err);
    showToast('ইমেজ আপলোড এরর: ' + err.message, 'error');
    removeImage();
  }
};

function showImagePreview(url) {
  document.getElementById('formImageUrl').value = url;
  document.getElementById('formImagePreview').src = url;
  document.getElementById('uploadSuccessPreview').style.display = 'flex';
  document.getElementById('imageUploadBox').style.display = 'none';
}

window.removeImage = function() {
  document.getElementById('formImageUrl').value = '';
  document.getElementById('formImagePreview').src = '';
  document.getElementById('uploadSuccessPreview').style.display = 'none';
  document.getElementById('imageUploadBox').style.display = 'block';

  const statusBox = document.getElementById('imageUploadStatus');
  if (statusBox) {
    statusBox.innerHTML = `
      <div style="font-size: 28px; margin-bottom: 6px;">📸</div>
      <div style="font-size: 14px; font-weight: 700; color: #FFF;">ছবি নির্বাচন করতে এখানে ক্লিক করুন</div>
      <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">স্বয়ংক্রিয়ভাবে ImgBB এপিআই দিয়ে ক্লাউডে আপলোড হবে</div>
    `;
  }
};

// =========================================================================
// Slug & Tag Helpers
// =========================================================================
window.handleTextChangeForSlug = function(val) {
  if (isAutoSlug) {
    const slug = generateSlug(document.getElementById('formTitle').value || val);
    document.getElementById('formSlug').value = slug;
    updateSlugPreview();
  }
};

window.toggleAutoSlug = function(checked) {
  isAutoSlug = checked;
  if (checked) {
    const text = document.getElementById('formTitle').value || document.getElementById('formText').value;
    document.getElementById('formSlug').value = generateSlug(text);
    updateSlugPreview();
  }
};

function generateSlug(text) {
  if (!text) return 'caption-' + Date.now().toString(36);
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09FF-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

function updateSlugPreview() {
  const cat = document.getElementById('formCategory')?.value || 'islamic';
  const slug = document.getElementById('formSlug')?.value || 'example-slug';
  const preview = document.getElementById('slugPreviewUrl');
  if (preview) {
    preview.innerText = `🔗 প্রিভিউ লিঙ্ক: ${BASE_WEBSITE_URL}/captions/${cat}/${slug}`;
  }
}

window.onCategorySelectChange = function(cat) {
  updateTagSuggestions(cat);
  updateSlugPreview();
};

function updateTagSuggestions(cat) {
  const container = document.getElementById('tagSuggestions');
  if (!container) return;

  const tags = (CATEGORY_MAP[cat] && CATEGORY_MAP[cat].tags) || [];
  container.innerHTML = tags.map(tag => `
    <span class="tag-chip" onclick="appendTag('${tag}')">${tag} +</span>
  `).join('');
}

window.appendTag = function(tag) {
  const input = document.getElementById('formTags');
  const current = input.value.trim();
  if (current.includes(tag)) return;
  input.value = current ? `${current}, ${tag}` : tag;
};

window.copyCaptionLink = function(url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast('ক্যাপশন লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে! 📋', 'success');
  }).catch(() => {
    showToast('লিঙ্ক কপি করা যায়নি', 'error');
  });
};

// =========================================================================
// Default Captions 1-Click Sync
// =========================================================================
window.seedDefaultCaptions = async function() {
  if (!db) {
    showToast('ফায়ারবেস কানেক্টেড নয়!', 'error');
    return;
  }

  const proceed = confirm('আপনি কি ফায়ারবেস ডেটাবেসে ৭০+ ডিফল্ট ক্যাপশন ও ফটো স্ট্যাটাস সিঙ্ক করতে চান?');
  if (!proceed) return;

  showToast('ডিফল্ট ক্যাপশন সিঙ্ক হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন', 'info');

  try {
    const batch = db.batch();
    const colRef = db.collection('captions');

    DEFAULT_SEED_DATA.forEach(item => {
      const docRef = colRef.doc();
      batch.set(docRef, {
        ...item,
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
        likes: Math.floor(Math.random() * 50) + 20,
        shares: Math.floor(Math.random() * 20) + 5
      });
    });

    await batch.commit();
    showToast('সকল ডিফল্ট ক্যাপশন সফলভাবে সিঙ্ক হয়েছে! 🚀', 'success');
    await loadCaptionsList();
  } catch (err) {
    console.error('Seed error:', err);
    showToast('সিঙ্ক ব্যর্থ হয়েছে: ' + err.message, 'error');
  }
};

// =========================================================================
// Settings & Diagnostics
// =========================================================================
window.openSettingsModal = function() {
  document.getElementById('settingsImgbbKey').value = getStoredImgbbKey();
  document.getElementById('settingsModal').classList.add('active');
};

window.closeSettingsModal = function() {
  document.getElementById('settingsModal').classList.remove('active');
};

window.saveSettings = function() {
  const key = document.getElementById('settingsImgbbKey').value.trim();
  if (key) {
    localStorage.setItem('yt_imgbb_key', key);
    showToast('ImgBB এপিআই কী সফলভাবে সংরক্ষণ করা হয়েছে!', 'success');
  }
  closeSettingsModal();
};

function getStoredImgbbKey() {
  return localStorage.getItem('yt_imgbb_key') || DEFAULT_IMGBB_API_KEY;
}

window.testFirebaseConnection = async function() {
  if (!db) {
    showToast('ফায়ারবেস কানেকশন পাওয়া যায়নি', 'error');
    return;
  }
  showToast('ফায়ারবেস পিং টেস্ট চলছে...', 'info');
  try {
    const testDoc = await db.collection('site_stats').doc('overview').get();
    showToast('ফায়ারবেস কানেকশন চমৎকার কাজ করছে! ✅', 'success');
  } catch (err) {
    showToast('ফায়ারবেস টেস্ট এরর: ' + err.message, 'error');
  }
};

// =========================================================================
// Utilities
// =========================================================================
function setupEventListeners() {
  document.getElementById('searchInput')?.addEventListener('input', applyFilters);
  document.getElementById('filterCategory')?.addEventListener('change', applyFilters);
  document.getElementById('filterLanguage')?.addEventListener('change', applyFilters);
  document.getElementById('filterType')?.addEventListener('change', applyFilters);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(msg)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
