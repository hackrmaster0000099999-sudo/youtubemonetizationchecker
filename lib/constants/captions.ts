export interface CaptionFaq {
  question: string;
  answer: string;
}

export interface CaptionCategory {
  id: string;
  name: string;
  banglaName: string;
  icon: string;
  description: string;
  color: string;
  badge?: string;
  shortDesc?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  faqs: CaptionFaq[];
  suggestedTags: string[];
}

export interface CaptionItem {
  id: string;
  text: string;
  language: 'bangla' | 'english';
  category: string;
  tags: string[];
  popular?: boolean;
  slug?: string;
  imageUrl?: string;
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  published?: boolean;
  likes?: number;
  shares?: number;
}

export const CAPTION_CATEGORIES: CaptionCategory[] = [
  {
    id: 'islamic',
    name: 'Islamic & Moral',
    banglaName: 'ইসলামিক ও নীতিবাক্য',
    icon: 'Moon',
    description: 'শান্তিপূর্ণ ইসলামিক বাণী, পবিত্র কুরআনের আয়াত, হাদিসের উদ্ধৃতি, হেদায়েতমূলক উক্তি ও ফটো স্ট্যাটাস।',
    color: '#059669',
    badge: 'PEACE',
    shortDesc: 'শান্তির বাণী, মোরাল শিক্ষা ও হেদায়েত',
    seoTitle: 'Islamic Captions & Images Bangla & English (ইসলামিক ক্যাপশন ও ছবি) - Quotes & Photo Status',
    seoDescription: 'Peaceful Bangla & English Islamic captions, Quranic reflections, Hadith quotes, and high-definition photo status images for Facebook, Instagram, and WhatsApp. Free 1-click copy & download.',
    seoKeywords: [
      'islamic captions bangla',
      'bangla islamic status image',
      'jummah mubarak captions and photo',
      'ইসলামিক ক্যাপশন ও ছবি',
      'নীতিবাক্য ও হাদিসের উক্তি',
      'quranic quotes english',
      'alhamdulillah status bangla',
      'islamic bio for instagram',
      'islamic quotes images bangla english',
      'ইসলামিক ফটো স্ট্যাটাস',
    ],
    suggestedTags: ['#Alhamdulillah', '#IslamicQuotes', '#Sabr', '#QuranVerses', '#Sunnah', '#Bismillah'],
    faqs: [
      {
        question: 'ইসলামিক ক্যাপশন ও ফটো স্ট্যাটাস কীভাবে সোশ্যাল মিডিয়ায় ব্যবহার করবেন?',
        answer: 'যেকোনো ইসলামিক ক্যাপশনের নিচে থাকা "কপি করুন" বাটনে ক্লিক করলে ক্যাপশন কপি হবে। এছাড়াও "Image" অপশন থেকে আকর্ষণীয় ইসলামিক কোট ছবি ও ফটো স্ট্যাটাস সরাসরি ফেসবুক বা হোয়াটসঅ্যাপে শেয়ার করতে পারবেন।',
      },
      {
        question: 'ক্যাপশনের সাথে কি প্রাসঙ্গিক ইসলামিক হ্যাশট্যাগ যোগ করা যায়?',
        answer: 'হ্যাঁ, "+ট্যাগসহ কপি" বাটনে ক্লিক করলে ক্যাপশনের পাশাপাশি ট্রেন্ডিং ইসলামিক হ্যাশট্যাগ যেমন #Alhamdulillah, #Sabr ইত্যাদি একসাথে কপি হবে।',
      },
      {
        question: 'এই ক্যাপশন ও ছবিগুলো কি সম্পূর্ণ বিনামূল্যে ব্যবহারযোগ্য?',
        answer: 'হ্যাঁ, YT MONETIZE-এর সকল ইসলামিক ক্যাপশন, উক্তি এবং ইমেজ রিসোর্স সম্পূর্ণ বিনামূল্যে ও কপিরাইট মুক্তভাবে যে কেউ ব্যবহার করতে পারেন।',
      },
    ],
  },
  {
    id: 'motivational',
    name: 'Motivational',
    banglaName: 'মোティブেশনাল ও সাফল্য',
    icon: 'Flame',
    description: 'পরিশ্রম, লক্ষ্য এবং বিজয়ের অনুপ্রেরণামূলক উক্তি ও দৃষ্টিনন্দন মোটিভেশনাল ফটো স্ট্যাটাস।',
    color: '#F59E0B',
    badge: 'TRENDING',
    shortDesc: 'সফলতা, পরিশ্রম ও অনুপ্রেরণামূলক উক্তি',
    seoTitle: 'Motivational Captions & Images Bangla & English (মোটিভেশনাল ক্যাপশন ও ছবি) - Inspiring Quotes & Status',
    seoDescription: 'Best collection of Bangla & English motivational captions, success quotes, and inspirational status images for Facebook, Instagram Reels, Shorts, and Stories. Free 1-click copy.',
    seoKeywords: [
      'motivational captions bangla',
      'bangla motivational quotes and images',
      'success captions english',
      'মোটিভেশনাল ক্যাপশন ও ছবি',
      'অনুপ্রেরণামূলক উক্তি ও ফটো',
      'সফলতার স্ট্যাটাস ইমেজ',
      'facebook photo caption bangla',
      'hustle quotes for instagram',
      'hard work captions bangla',
      'motivational status pictures',
    ],
    suggestedTags: ['#Motivation', '#Success', '#Hustle', '#DreamBig', '#HardWork', '#NeverGiveUp'],
    faqs: [
      {
        question: 'মোটিভেশনাল ক্যাপশন ও ছবি কেন পোস্টের রিচ বাড়ায়?',
        answer: 'অনুপ্রেরণামূলক উক্তি ও ফটো কার্ড সোশ্যাল মিডিয়ায় মানুষ সবচেয়ে বেশি শেয়ার ও সেভ করে। সঠিক হ্যাশট্যাগ সহ মোটিভেশনাল ক্যাপশন ও ছবি দিলে ফেসবুক ও ইনস্টাগ্রামে এনগেজমেন্ট বহুগুণ বৃদ্ধি পায়।',
      },
      {
        question: 'ক্যাপশনে কি বাংলা, ইংরেজি এবং ছবি তিনটি মোডেই পরিবর্তন করা যায়?',
        answer: 'হ্যাঁ, আমাদের ফিল্টার বার থেকে "Bangla", "English" এবং "Image" অপশনে ক্লিক করে যেকোনো ফরম্যাটের মোটিভেশনাল রিসোর্স সহজে সংগ্রহ করতে পারবেন।',
      },
    ],
  },
  {
    id: 'attitude',
    name: 'Attitude & Swag',
    banglaName: 'অ্যাটিটিউড ও ব্যক্তিত্ব',
    icon: 'Zap',
    description: 'বোল্ড, আত্মবিশ্বাসী এবং রাজকীয় ব্যক্তিত্ব প্রকাশের সেরা স্টাইলিশ স্ট্যাটাস, উক্তি ও ডিপি ফটো।',
    color: '#EC4899',
    badge: 'POPULAR',
    shortDesc: 'রয়্যাল এটিটিউড ও স্টাইলিশ ব্যক্তিত্ব',
    seoTitle: 'Attitude Captions & Images Bangla & English (অ্যাটিটিউড ক্যাপশন ও ছবি) - Royal Status & DP Quotes',
    seoDescription: 'Killer Bangla & English attitude captions, royal swag status, and bold personality quote images for Facebook DP, Instagram bio, and Stories. Free 1-click copy.',
    seoKeywords: [
      'attitude captions bangla',
      'bangla attitude status images',
      'royal attitude caption and photo',
      'অ্যাটিটিউড ক্যাপশন ও ছবি',
      'ব্যক্তিত্বের উক্তি ও স্ট্যাটাস',
      'swag quotes english',
      'killer attitude status bangla',
      'boss vibes caption for instagram',
      'stylish facebook bio and dp photos',
    ],
    suggestedTags: ['#Attitude', '#RoyalVibes', '#Classy', '#BossMindset', '#SelfWorth', '#KingVibes'],
    faqs: [
      {
        question: 'প্রোফাইল পিকচারের জন্য সেরা অ্যাটিটিউড ক্যাপশন ও ছবি কীভাবে বেছে নেব?',
        answer: 'আপনার ছবির এক্সপ্রেশন ও স্টাইলের সাথে মানানসই যেকোনো বোল্ড উক্তি সিলেক্ট করে "+ট্যাগসহ কপি" করুন অথবা "Image" ট্যাব থেকে আকর্ষণীয় অ্যাটিটিউড স্ট্যাটাস কার্ড ব্যবহার করুন।',
      },
    ],
  },
  {
    id: 'romantic',
    name: 'Romantic & Love',
    banglaName: 'রোমান্টিক ও ভালোবাসা',
    icon: 'Heart',
    description: 'প্রিয়জনের জন্য মিষ্টি ছন্দ, গভীর ভালোবাসা, রোমান্টিক শায়েরি ও কাপল ফটো স্ট্যাটাস।',
    color: '#EF4444',
    badge: 'LOVE',
    shortDesc: 'ভালোবাসা, মিষ্টি ছন্দ ও মনের অনুভূতি',
    seoTitle: 'Romantic Captions & Images Bangla & English (রোমান্টিক ক্যাপশন ও ছবি) - Love Quotes & Couple Photos',
    seoDescription: 'Heart touching Bangla & English romantic captions, sweet love quotes, and couple status images for girlfriend, boyfriend, and crush. Free 1-click copy.',
    seoKeywords: [
      'romantic captions bangla',
      'bangla love status image',
      'romantic quotes english',
      'ভালোবাসার ক্যাপশন ও ছবি',
      'রোমান্টিক স্ট্যাটাস কার্ড',
      'love captions for instagram',
      'bangla romantic shayari with photo',
      'couple photo captions bangla',
      'sweet lines for crush',
    ],
    suggestedTags: ['#Love', '#RomanticCaptions', '#Couples', '#ForeverLove', '#SweetMoments', '#LoveQuotes'],
    faqs: [
      {
        question: 'কাপল ছবির জন্য রোমান্টিক ক্যাপশন ও ছবি কীভাবে ব্যবহার করবেন?',
        answer: 'ভালোবাসার ছন্দ বা গভীর রোমান্টিক ক্যাপশন সিলেক্ট করে এক ক্লিকে কপি করুন এবং ইনস্টাগ্রাম বা ফেসবুক কাপল ছবিতে পেস্ট করুন অথবা ইমেজ গ্যালারি থেকে পছন্দের ছবি ব্যবহার করুন।',
      },
    ],
  },
  {
    id: 'sad',
    name: 'Sad & Pain',
    banglaName: 'দুঃখ ও কষ্টের ক্যাপশন',
    icon: 'CloudRain',
    description: 'মন খারাপ, একাকীত্ব, হৃদয়ভাঙা অনুভূতি ও জীবনের নীরব কষ্টের গভীর শব্দমালা ও ইমেজ।',
    color: '#6366F1',
    badge: 'DEEP',
    shortDesc: 'কষ্ট, মন খারাপ ও একাকীত্বের আবেগ',
    seoTitle: 'Sad Captions & Images Bangla & English (কষ্টের ক্যাপশন ও ছবি) - Emotional & Broken Heart Status',
    seoDescription: 'Deep emotional Bangla & English sad captions, heartbreak status, and lonely quote images for Facebook DP and WhatsApp status. Free 1-click copy.',
    seoKeywords: [
      'sad captions bangla',
      'bangla sad status images',
      'broken heart quotes english',
      'কষ্টের ক্যাপশন ও ছবি',
      'একাকীত্বের স্ট্যাটাস কার্ড',
      'মন খারাপের উক্তি ও ফটো',
      'emotional captions for instagram',
      'painful life quotes bangla',
      'silent tears status picture',
    ],
    suggestedTags: ['#SadCaptions', '#Heartbreak', '#PainfulTruth', '#AloneVibes', '#SilentPain', '#Broken'],
    faqs: [
      {
        question: 'কষ্টের স্ট্যাটাস ও ছবি কি এক ক্লিকে সোশ্যাল মিডিয়ায় শেয়ার করা যায়?',
        answer: 'হ্যাঁ, কার্ডের শেয়ার বাটন চেপে সরাসরি সোশ্যাল মিডিয়া বা মেসেঞ্জারে শেয়ার করতে পারেন অথবা কপি বাটনে ক্লিক করে টেক্সট ও ছবি সংগ্রহ করতে পারেন।',
      },
    ],
  },
  {
    id: 'life',
    name: 'Life & Reality',
    banglaName: 'বাস্তবতা ও জীবনবোধ',
    icon: 'Compass',
    description: 'সমাজ, মানুষের স্বার্থপরতা, সময় এবং জীবনের নির্মম সত্য নিয়ে গভীর উপলব্ধি ও চিন্তাশীল ছবি।',
    color: '#10B981',
    badge: 'REALITY',
    shortDesc: 'বাস্তব জীবনবোধ, সমাজ ও উপলব্ধি',
    seoTitle: 'Life & Reality Captions & Images Bangla & English (বাস্তবতা ক্যাপশন ও ছবি) - Truth of Life Status',
    seoDescription: 'Meaningful Bangla & English life reality captions, deep thoughts, and truth of life quotes & status images for Facebook, WhatsApp, and Instagram. Free 1-click copy.',
    seoKeywords: [
      'life captions bangla',
      'reality of life status images',
      'deep life quotes english',
      'বাস্তব জীবনবোধ ক্যাপশন ও ছবি',
      'কঠিন বাস্তবতা উক্তি ও ফটো',
      'life lessons status picture',
      'human nature quotes',
      'social reality captions bangla',
      'deep thoughts bangla',
    ],
    suggestedTags: ['#LifeReality', '#DeepThoughts', '#LifeLessons', '#HumanNature', '#Wisdom', '#Mindset'],
    faqs: [
      {
        question: 'বাস্তবতা বিষয়ক ক্যাপশন ও ছবি কোন ধরনের পোস্টে ভালো মানায়?',
        answer: 'ট্রাভেল ছবি, চিন্তাশীল পোর্ট্রেট, ফেসবুক স্টোরি অথবা জীবনের কোনো গুরুত্বপূর্ণ উপলব্ধি প্রকাশের ক্ষেত্রে লাইফ অ্যান্ড রিয়ালিটি ক্যাপশন ও ছবি সবচেয়ে বেশি মানানসই।',
      },
    ],
  },
  {
    id: 'friendship',
    name: 'Friendship',
    banglaName: 'বন্ধুত্ব ও আড্ডা',
    icon: 'Users',
    description: 'সত্যিকারের বন্ধু, স্কুলের রঙিন স্মৃতি, খুনসুটি আর বন্ধুদের সেরা আড্ডার ক্যাপশন ও গ্রুপ ফটো স্ট্যাটাস।',
    color: '#06B6D4',
    badge: 'BESTIES',
    shortDesc: 'বন্ধুত্ব, সেরা স্মৃতি ও মাস্তির ক্যাপশন',
    seoTitle: 'Friendship Captions & Images Bangla & English (বন্ধুত্ব ক্যাপশন ও ছবি) - Best Friend Quotes & Squad Status',
    seoDescription: 'Fun, crazy, and emotional Bangla & English friendship captions and squad photo status images for besties, squad photos, school memories, and group pics. Free 1-click copy.',
    seoKeywords: [
      'friendship captions bangla',
      'best friend status images bangla',
      'squad quotes english',
      'বন্ধুত্ব ক্যাপশন ও ছবি',
      'বন্ধুর জন্মদিনের শুভেচ্ছা ও ফটো',
      'school friends memories picture',
      'friendship day status',
      'crazy friends captions',
      'group photo captions bangla',
    ],
    suggestedTags: ['#Friendship', '#BestFriends', '#SquadGoals', '#Brotherhood', '#FriendsForever', '#Memories'],
    faqs: [
      {
        question: 'বন্ধুদের গ্রুপ ছবির জন্য সেরা ক্যাপশন ও ছবি কীভাবে পাব?',
        answer: 'ফ্রেন্ডশিপ ক্যাটাগরিতে গিয়ে আপনার বন্ধুদের আড্ডা বা ট্যুরের মেজাজ অনুযায়ী সেরা ক্যাপশন ও ফটো স্ট্যাটাস বেছে নিয়ে সরাসরি ইনস্টাগ্রাম বা ফেসবুকে পোস্ট করুন।',
      },
    ],
  },
];

// Empty by default as requested: demo posts are cleared
export const CAPTIONS_DATA: CaptionItem[] = [];
