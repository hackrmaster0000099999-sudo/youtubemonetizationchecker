// YT MONETIZE - Standalone Admin Panel Logic (Pure ESM)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Firebase Configuration (Configured with project: yt-monetize-ae3d7)
const firebaseConfig = {
  apiKey: "AIzaSyBTkRKAUgtlewqN-EJ-ovo0CNZJbkAzngI",
  authDomain: "yt-monetize-ae3d7.firebaseapp.com",
  projectId: "yt-monetize-ae3d7",
  storageBucket: "yt-monetize-ae3d7.firebasestorage.app",
  messagingSenderId: "888426598115",
  appId: "1:888426598115:web:43e6043a2e0da86b6cffd6"
};

// Initialize Firebase App & Firestore
let app;
let db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (e) {
  console.error('Firebase init error:', e);
}

// Global State
let captionsList = [];
let isAutoSlugEnabled = true;
const BASE_WEBSITE_URL = 'https://youtubemonetizationchecker.online';
const DEFAULT_IMGBB_API_KEY = '3cfbc6a944c10a70d848cebae4b8245b';

// Category Definitions & Suggested Tags
const CATEGORY_MAP = {
  islamic: {
    name: 'ইসলামিক ও নীতিবাক্য',
    badge: 'badge-islamic',
    tags: ['#Alhamdulillah', '#IslamicQuotes', '#Sabr', '#QuranVerses', '#Sunnah', '#Bismillah'],
  },
  motivational: {
    name: 'মোটিভেশনাল ও সাফল্য',
    badge: 'badge-motivational',
    tags: ['#Motivation', '#Success', '#Hustle', '#DreamBig', '#HardWork', '#NeverGiveUp'],
  },
  attitude: {
    name: 'অ্যাটিটিউড ও ব্যক্তিত্ব',
    badge: 'badge-attitude',
    tags: ['#Attitude', '#RoyalVibes', '#Classy', '#BossMindset', '#SelfWorth', '#KingVibes'],
  },
  romantic: {
    name: 'রোমান্টিক ও ভালোবাসা',
    badge: 'badge-romantic',
    tags: ['#Love', '#RomanticCaptions', '#Couples', '#ForeverLove', '#SweetMoments', '#LoveQuotes'],
  },
  sad: {
    name: 'দুঃখ ও কষ্টের ক্যাপশন',
    badge: 'badge-sad',
    tags: ['#SadCaptions', '#Heartbreak', '#PainfulTruth', '#AloneVibes', '#SilentPain', '#Broken'],
  },
  life: {
    name: 'বাস্তবতা ও জীবনবোধ',
    badge: 'badge-life',
    tags: ['#LifeReality', '#DeepThoughts', '#LifeLessons', '#HumanNature', '#Wisdom', '#Mindset'],
  },
  friendship: {
    name: 'বন্ধুত্ব ও আড্ডা',
    badge: 'badge-friendship',
    tags: ['#Friendship', '#BestFriends', '#SquadGoals', '#Brotherhood', '#FriendsForever', '#Memories'],
  },
};

// -------------------------------------------------------------
// Direct Admin Access (No Authentication required)
// -------------------------------------------------------------
window.handleUnlock = function(e) {
  if (e) e.preventDefault();
  return false;
};

window.lockAdmin = function() {
  // No-op since authentication is disabled by user preference
  showToast('লক ফিচারটি নিষ্ক্রিয় রাখা হয়েছে');
};

// Automatically show admin app and load data immediately
function initAdminApp() {
  const lockScreen = document.getElementById('lockScreen');
  if (lockScreen) lockScreen.style.display = 'none';
  const adminApp = document.getElementById('adminApp');
  if (adminApp) adminApp.style.display = 'block';
  loadCaptionsFromFirestore();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminApp);
} else {
  initAdminApp();
}

// -------------------------------------------------------------
// Firestore CRUD & Data Fetching
// -------------------------------------------------------------
async function loadCaptionsFromFirestore() {
  const tableBody = document.getElementById('captionsTableBody');
  tableBody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
        ফায়ারস্টোর থেকে ডাটা লোড হচ্ছে...
      </td>
    </tr>
  `;

  try {
    const colRef = collection(db, 'captions');
    const snapshot = await getDocs(colRef);
    captionsList = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      captionsList.push({
        id: docSnap.id,
        ...data,
      });
    });

    updateStats();
    renderCaptionsTable();
    updateConnectionStatus(true);
  } catch (error) {
    console.error('Firestore load error:', error);
    updateConnectionStatus(false);
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px; color: var(--danger);">
          ফায়ারস্টোর কানেকশন সমস্যা: ${error.message}
        </td>
      </tr>
    `;
  }
}

function updateConnectionStatus(isConnected) {
  const pill = document.getElementById('firebaseStatusPill');
  const text = document.getElementById('firebaseStatusText');
  if (isConnected) {
    pill.className = 'status-pill connected';
    text.textContent = 'ফায়ারবেস: লাইভ সংযুক্ত';
  } else {
    pill.className = 'status-pill';
    pill.style.background = '#FEE2E2';
    pill.style.color = '#DC2626';
    text.textContent = 'ফায়ারবেস: ডিসকানেক্টেড';
  }
}

function updateStats() {
  const total = captionsList.length;
  const bangla = captionsList.filter(c => c.language === 'bangla').length;
  const english = captionsList.filter(c => c.language === 'english').length;
  const images = captionsList.filter(c => Boolean(c.imageUrl)).length;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statBangla').textContent = bangla;
  document.getElementById('statEnglish').textContent = english;
  document.getElementById('statImages').textContent = images;
}

// -------------------------------------------------------------
// Render Table & Filters
// -------------------------------------------------------------
function renderCaptionsTable() {
  const search = (document.getElementById('searchInput').value || '').toLowerCase().trim();
  const catFilter = document.getElementById('categoryFilter').value;
  const langFilter = document.getElementById('languageFilter').value;
  const imgFilter = document.getElementById('imageFilter').value;

  const filtered = captionsList.filter(c => {
    if (catFilter !== 'all' && c.category !== catFilter) return false;
    if (langFilter !== 'all' && c.language !== langFilter) return false;
    if (imgFilter === 'with_image' && !c.imageUrl) return false;
    if (imgFilter === 'text_only' && c.imageUrl) return false;

    if (search) {
      const matchText = (c.text || '').toLowerCase().includes(search);
      const matchTitle = (c.title || '').toLowerCase().includes(search);
      const matchSlug = (c.slug || '').toLowerCase().includes(search);
      const matchTags = Array.isArray(c.tags) && c.tags.some(t => t.toLowerCase().includes(search));
      if (!matchText && !matchTitle && !matchSlug && !matchTags) return false;
    }

    return true;
  });

  document.getElementById('filteredCountText').textContent = `দেখাচ্ছে: ${filtered.length} টি`;

  const tbody = document.getElementById('captionsTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
          কোনো ক্যাপশন পাওয়া যায়নি। নতুন ক্যাপশন তৈরি করতে ওপরের "＋ নতুন ক্যাপশন" বাটনে ক্লিক করুন।
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const catInfo = CATEGORY_MAP[item.category] || { name: item.category, badge: 'badge-islamic' };
    const liveUrl = `${BASE_WEBSITE_URL}/captions/${item.category}/${item.slug || item.id}`;
    const relativeUrl = `/captions/${item.category}/${item.slug || item.id}`;

    return `
      <tr>
        <td>
          ${item.imageUrl 
            ? `<img src="${item.imageUrl}" class="thumbnail-preview" alt="Thumb" onerror="this.src='/favicon.ico'">`
            : `<div style="width: 48px; height: 48px; border-radius: 6px; background: #F3F4F6; display: flex; align-items: center; justify-content: center; font-size: 20px;">💬</div>`
          }
        </td>
        <td>
          ${item.title ? `<div style="font-weight: 700; font-size: 13px; color: var(--primary); margin-bottom: 2px;">${escapeHtml(item.title)}</div>` : ''}
          <div class="caption-cell-text">${escapeHtml(item.text)}</div>
          <div class="caption-cell-meta">
            <span>${Array.isArray(item.tags) && item.tags.length > 0 ? item.tags.slice(0, 3).join(' ') : '#Caption'}</span>
            ${item.metaTitle ? `<span title="${escapeHtml(item.metaTitle)}">🔍 SEO সেট</span>` : ''}
          </div>
        </td>
        <td>
          <span class="badge ${catInfo.badge}">${catInfo.name}</span>
        </td>
        <td>
          <span style="font-size: 12px; font-weight: 600; text-transform: uppercase;">${item.language || 'bangla'}</span>
        </td>
        <td>
          <div>
            <span class="slug-code">/${item.slug || item.id}</span>
          </div>
          <div style="margin-top: 4px;">
            <a href="${relativeUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; color: var(--primary); text-decoration: none; font-weight: 600;">
              লাইভ পেজ দেখুন ↗
            </a>
            <button onclick="copyToClipboard('${liveUrl}')" style="background: none; border: none; font-size: 11px; color: var(--text-muted); cursor: pointer; margin-left: 8px;">
              কপি লিংক
            </button>
          </div>
        </td>
        <td style="text-align: right;">
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
            <button class="btn btn-outline btn-sm" onclick="openEditModal('${item.id}')">
              এডিট
            </button>
            <button class="btn btn-danger btn-sm" onclick="handleDeleteCaption('${item.id}')">
              মুছুন
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.handleSearch = function() {
  renderCaptionsTable();
};

window.handleFilterChange = function() {
  renderCaptionsTable();
};

// -------------------------------------------------------------
// Slug Generator & Live Preview
// -------------------------------------------------------------
function generateSlug(text) {
  if (!text) return '';
  // Transliterate or normalize to clean URL-safe slug
  const normalized = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0980-\u09FF-]/g, '') // keep alphanumeric, spaces, and bangla
    .replace(/[\s_]+/g, '-') // spaces to hyphen
    .replace(/^-+|-+$/g, '');

  if (normalized.length > 0) {
    // Slice to reasonable URL length
    return normalized.slice(0, 50);
  }
  return 'post-' + Math.random().toString(36).substring(2, 8);
}

window.toggleAutoSlug = function() {
  isAutoSlugEnabled = document.getElementById('autoSlugCheckbox').checked;
};

window.handleTitleInput = function() {
  const title = document.getElementById('formTitle').value;
  if (isAutoSlugEnabled && title.trim()) {
    const slug = generateSlug(title);
    document.getElementById('formSlug').value = slug;
    updateLiveUrlPreview();
  }
  updateSeoDefaults();
};

window.handleTextInput = function() {
  const text = document.getElementById('formText').value;
  const title = document.getElementById('formTitle').value;

  // Character and word counts
  document.getElementById('charCount').textContent = `অক্ষর: ${text.length}`;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  document.getElementById('wordCount').textContent = `শব্দ: ${words}`;

  if (isAutoSlugEnabled && !title.trim() && text.trim()) {
    const firstFewWords = text.trim().split(/\s+/).slice(0, 5).join(' ');
    const slug = generateSlug(firstFewWords);
    document.getElementById('formSlug').value = slug;
    updateLiveUrlPreview();
  }
  updateSeoDefaults();
};

window.handleSlugInput = function() {
  updateLiveUrlPreview();
};

window.handleFormCategoryChange = function() {
  updateLiveUrlPreview();
  renderTagSuggestions();
  updateSeoDefaults();
};

function updateLiveUrlPreview() {
  const category = document.getElementById('formCategory').value || 'islamic';
  const slug = document.getElementById('formSlug').value.trim() || 'example-slug';
  const preview = `${BASE_WEBSITE_URL}/captions/${category}/${slug}`;
  document.getElementById('liveUrlPreview').textContent = preview;
  document.getElementById('serpPreviewUrl').textContent = `${BASE_WEBSITE_URL} > captions > ${category} > ${slug}`;
}

function updateSeoDefaults() {
  const title = document.getElementById('formTitle').value.trim();
  const text = document.getElementById('formText').value.trim();
  const category = document.getElementById('formCategory').value;
  const catInfo = CATEGORY_MAP[category] || { name: category };

  const metaTitleField = document.getElementById('formMetaTitle');
  if (!metaTitleField.dataset.customized || !metaTitleField.value) {
    if (title) {
      metaTitleField.value = `${title} - ${catInfo.name} ক্যাপশন | YT MONETIZE`;
    } else if (text) {
      const snippet = text.slice(0, 45);
      metaTitleField.value = `${snippet}... | ${catInfo.name} ক্যাপশন`;
    }
  }

  const metaDescField = document.getElementById('formMetaDescription');
  if (!metaDescField.dataset.customized || !metaDescField.value) {
    if (text) {
      metaDescField.value = text.slice(0, 150);
    }
  }

  updateSeoPreview();
}

window.updateSeoPreview = function() {
  const metaTitle = document.getElementById('formMetaTitle').value.trim();
  const metaDesc = document.getElementById('formMetaDescription').value.trim();

  document.getElementById('metaTitleCount').textContent = `${metaTitle.length} / 60`;
  document.getElementById('metaDescCount').textContent = `${metaDesc.length} / 160`;

  document.getElementById('serpPreviewTitle').textContent = metaTitle || 'পোস্টের এসইও টাইটেল এখানে প্রদর্শিত হবে';
  document.getElementById('serpPreviewDesc').textContent = metaDesc || 'পোস্টের এসইও বিবরণ এখানে গুগলের সার্চ রেজাল্টের মত প্রিভিউ দেখাবে...';
};

// -------------------------------------------------------------
// Tag Suggestions
// -------------------------------------------------------------
function renderTagSuggestions() {
  const category = document.getElementById('formCategory').value || 'islamic';
  const catInfo = CATEGORY_MAP[category];
  const container = document.getElementById('quickTagSuggestions');
  if (!container || !catInfo) return;

  container.innerHTML = catInfo.tags.map(tag => `
    <button type="button" onclick="addTag('${tag}')" style="background: white; border: 1px solid var(--border-color); font-size: 11px; padding: 2px 8px; border-radius: 9999px; cursor: pointer; color: var(--text-dark);">
      + ${tag}
    </button>
  `).join('');
}

window.addTag = function(tag) {
  const tagsInput = document.getElementById('formTags');
  const current = tagsInput.value.trim();
  if (!current) {
    tagsInput.value = tag;
  } else if (!current.includes(tag)) {
    tagsInput.value = `${current}, ${tag}`;
  }
};

// -------------------------------------------------------------
// ImgBB API Integration & Direct Image Upload
// -------------------------------------------------------------
window.triggerFileInput = function() {
  document.getElementById('imageFileInput').click();
};

window.handleImageFileSelected = async function(files) {
  if (!files || files.length === 0) return;
  const file = files[0];

  const imgbbKey = localStorage.getItem('yt_imgbb_api_key') || DEFAULT_IMGBB_API_KEY;

  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const uploadSuccessPreview = document.getElementById('uploadSuccessPreview');

  uploadPlaceholder.innerHTML = `
    <div style="font-size: 24px; margin-bottom: 4px;">⏳</div>
    <div style="font-size: 13px; font-weight: 600; color: var(--primary);">ছবি আপলোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন</div>
  `;

  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(imgbbKey)}`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.success && result.data && result.data.url) {
      const directUrl = result.data.url;
      document.getElementById('formImageUrl').value = directUrl;
      document.getElementById('formImagePreview').src = directUrl;

      uploadPlaceholder.style.display = 'none';
      uploadSuccessPreview.style.display = 'flex';
      showToast('ছবি সফলভাবে আপলোড ও সরাসরি লিংক তৈরি হয়েছে!');
    } else {
      throw new Error(result.error?.message || 'ছবি আপলোড সম্পন্ন হয়নি');
    }
  } catch (error) {
    console.error('Upload error:', error);
    showToast('ছবি আপলোড ব্যর্থ হয়েছে: ' + error.message);
    uploadPlaceholder.innerHTML = `
      <div style="font-size: 24px; margin-bottom: 4px;">❌</div>
      <div style="font-size: 13px; font-weight: 600; color: var(--danger);">আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন</div>
    `;
  }
};

window.removeUploadedImage = function(e) {
  if (e) e.stopPropagation();
  document.getElementById('formImageUrl').value = '';
  document.getElementById('imageFileInput').value = '';
  document.getElementById('uploadPlaceholder').style.display = 'block';
  document.getElementById('uploadPlaceholder').innerHTML = `
    <div style="font-size: 24px; margin-bottom: 4px;">🖼️</div>
    <div style="font-size: 13px; font-weight: 600; color: var(--text-dark);">ছবি আপলোড করতে ক্লিক করুন বা টেনে আনুন</div>
    <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">সরাসরি উচ্চমানের ছবির লিংক তৈরি হবে</div>
  `;
  document.getElementById('uploadSuccessPreview').style.display = 'none';
};

window.handleImageUrlInput = function() {
  const url = document.getElementById('formImageUrl').value.trim();
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const uploadSuccessPreview = document.getElementById('uploadSuccessPreview');

  if (url) {
    document.getElementById('formImagePreview').src = url;
    uploadPlaceholder.style.display = 'none';
    uploadSuccessPreview.style.display = 'flex';
  } else {
    uploadPlaceholder.style.display = 'block';
    uploadSuccessPreview.style.display = 'none';
  }
};

// -------------------------------------------------------------
// Modal Management (Create / Edit)
// -------------------------------------------------------------
window.openCreateModal = function() {
  document.getElementById('modalFormTitle').textContent = 'নতুন ক্যাপশন বা ফটো স্ট্যাটাস তৈরি করুন';
  document.getElementById('captionForm').reset();
  document.getElementById('editCaptionId').value = '';
  document.getElementById('formCategory').value = 'islamic';
  document.getElementById('formLanguage').value = 'bangla';
  document.getElementById('autoSlugCheckbox').checked = true;
  isAutoSlugEnabled = true;

  document.getElementById('formMetaTitle').dataset.customized = '';
  document.getElementById('formMetaDescription').dataset.customized = '';

  removeUploadedImage();
  renderTagSuggestions();
  updateLiveUrlPreview();
  updateSeoPreview();

  document.getElementById('captionModal').classList.add('active');
};

window.openEditModal = function(id) {
  const item = captionsList.find(c => c.id === id);
  if (!item) return;

  document.getElementById('modalFormTitle').textContent = 'ক্যাপশন এডিট করুন';
  document.getElementById('editCaptionId').value = item.id;
  document.getElementById('formCategory').value = item.category || 'islamic';
  document.getElementById('formLanguage').value = item.language || 'bangla';
  document.getElementById('formTitle').value = item.title || '';
  document.getElementById('formText').value = item.text || '';
  document.getElementById('formTags').value = Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '');
  document.getElementById('formSlug').value = item.slug || item.id;
  document.getElementById('formImageUrl').value = item.imageUrl || '';
  document.getElementById('formMetaTitle').value = item.metaTitle || '';
  document.getElementById('formMetaDescription').value = item.metaDescription || '';
  document.getElementById('formMetaKeywords').value = item.metaKeywords || '';
  document.getElementById('formPublished').checked = item.published !== false;

  document.getElementById('autoSlugCheckbox').checked = false;
  isAutoSlugEnabled = false;

  if (item.imageUrl) {
    document.getElementById('formImagePreview').src = item.imageUrl;
    document.getElementById('uploadPlaceholder').style.display = 'none';
    document.getElementById('uploadSuccessPreview').style.display = 'flex';
  } else {
    removeUploadedImage();
  }

  handleTextInput();
  renderTagSuggestions();
  updateLiveUrlPreview();
  updateSeoPreview();

  document.getElementById('captionModal').classList.add('active');
};

window.closeCaptionModal = function() {
  document.getElementById('captionModal').classList.remove('active');
};

// -------------------------------------------------------------
// Save / Update to Firestore
// -------------------------------------------------------------
window.handleSaveCaption = async function(e) {
  e.preventDefault();
  const saveBtn = document.getElementById('btnSaveSubmit');
  saveBtn.disabled = true;
  saveBtn.textContent = 'সংরক্ষণ হচ্ছে...';

  const editId = document.getElementById('editCaptionId').value;
  const category = document.getElementById('formCategory').value;
  const language = document.getElementById('formLanguage').value;
  const title = document.getElementById('formTitle').value.trim();
  const text = document.getElementById('formText').value.trim();
  const rawTags = document.getElementById('formTags').value;
  const tags = rawTags
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
    .map(t => t.startsWith('#') ? t : `#${t}`);

  const slug = (document.getElementById('formSlug').value.trim() || generateSlug(title || text)).toLowerCase();
  const imageUrl = document.getElementById('formImageUrl').value.trim();
  const metaTitle = document.getElementById('formMetaTitle').value.trim();
  const metaDescription = document.getElementById('formMetaDescription').value.trim();
  const metaKeywords = document.getElementById('formMetaKeywords').value.trim();
  const published = document.getElementById('formPublished').checked;

  const payload = {
    category,
    language,
    title,
    text,
    tags,
    slug,
    imageUrl: imageUrl || null,
    metaTitle: metaTitle || null,
    metaDescription: metaDescription || null,
    metaKeywords: metaKeywords || null,
    published,
    updatedAt: serverTimestamp(),
  };

  try {
    if (editId) {
      // Update existing document
      const docRef = doc(db, 'captions', editId);
      await updateDoc(docRef, payload);
      showToast('ক্যাপশন সফলভাবে আপডেট করা হয়েছে!');
    } else {
      // Create new document
      payload.createdAt = serverTimestamp();
      payload.likes = 0;
      payload.shares = 0;
      const colRef = collection(db, 'captions');
      await addDoc(colRef, payload);
      showToast('নতুন ক্যাপশন ও URL সফলভাবে তৈরি হয়েছে!');
    }

    closeCaptionModal();
    await loadCaptionsFromFirestore();
  } catch (error) {
    console.error('Save caption error:', error);
    showToast('সংরক্ষণে ত্রুটি হয়েছে: ' + error.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'সংরক্ষণ করুন';
  }
};

// -------------------------------------------------------------
// Delete Caption from Firestore
// -------------------------------------------------------------
window.handleDeleteCaption = async function(id) {
  const item = captionsList.find(c => c.id === id);
  const confirmMsg = `আপনি কি নিশ্চিতভাবে এই ক্যাপশনটি মুছে ফেলতে চান?\n\n"${(item?.title || item?.text || '').slice(0, 50)}..."`;
  if (!confirm(confirmMsg)) return;

  try {
    const docRef = doc(db, 'captions', id);
    await deleteDoc(docRef);
    showToast('ক্যাপশন মুছে ফেলা হয়েছে');
    await loadCaptionsFromFirestore();
  } catch (error) {
    console.error('Delete error:', error);
    showToast('মুছতে ব্যর্থ হয়েছে: ' + error.message);
  }
};

// -------------------------------------------------------------
// Seed Default Curated Captions to Firestore
// -------------------------------------------------------------
window.seedDefaultCaptions = async function() {
  const confirmSeed = confirm('আপনি কি ডাটাবেসে ডিফল্ট ক্যাপশনগুলো সিঙ্ক করতে চান? (এটি ফায়ারস্টোরে প্রারম্ভিক ক্যাপশন আপলোড করবে)');
  if (!confirmSeed) return;

  const seedBtn = document.getElementById('btnSeed');
  seedBtn.disabled = true;
  seedBtn.textContent = 'সিঙ্ক হচ্ছে...';

  try {
    // Fetch default list from app endpoint or static data
    const res = await fetch('/api/captions/seed', { method: 'POST' });
    const json = await res.json();

    if (json.success) {
      showToast(`সফলভাবে ${json.count} টি ক্যাপশন ফায়ারস্টোরে সিঙ্ক হয়েছে!`);
      await loadCaptionsFromFirestore();
    } else {
      showToast('সিঙ্ক ত্রুটি: ' + (json.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Seed error:', error);
    showToast('সিঙ্ক ব্যর্থ হয়েছে: ' + error.message);
  } finally {
    seedBtn.disabled = false;
    seedBtn.textContent = '📥 ডিফল্ট ডেটা সিঙ্ক';
  }
};

// -------------------------------------------------------------
// Settings Modal (ImgBB & Configurations)
// -------------------------------------------------------------
window.openSettingsModal = function() {
  const keyInput = document.getElementById('settingsImgbbKey');
  if (keyInput) {
    keyInput.value = localStorage.getItem('yt_imgbb_api_key') || DEFAULT_IMGBB_API_KEY;
  }
  document.getElementById('settingsModal').classList.add('active');
};

window.closeSettingsModal = function() {
  document.getElementById('settingsModal').classList.remove('active');
};

window.saveSettings = function() {
  const keyInput = document.getElementById('settingsImgbbKey');
  const key = keyInput ? keyInput.value.trim() : '';

  if (key) {
    localStorage.setItem('yt_imgbb_api_key', key);
  }
  showToast('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  closeSettingsModal();
};

// -------------------------------------------------------------
// Utilities: Toast & Clipboard
// -------------------------------------------------------------
window.copyToClipboard = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('লিংক কপি করা হয়েছে: ' + text);
  }).catch(() => {
    showToast('কপি করতে ব্যর্থ হয়েছে');
  });
};

function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
