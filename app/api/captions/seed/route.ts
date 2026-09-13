import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const STARTER_CAPTIONS = [
  {
    category: 'islamic',
    language: 'bangla',
    title: 'ধৈর্য এবং আল্লাহর ওপর ভরসা',
    text: 'ধৈর্য ধারণ করো, নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন। কঠিন সময় পেরিয়ে সুন্দর ভোর আসবেই।',
    tags: ['#Alhamdulillah', '#Sabr', '#IslamicQuotes'],
    slug: 'dhairya-o-allahor-upor-bhorosa',
    metaTitle: 'ধৈর্য এবং আল্লাহর ওপর ভরসা - ইসলামিক ক্যাপশন ও স্ট্যাটাস',
    metaDescription: 'ধৈর্য ধারণ করো, নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন। সোশ্যাল মিডিয়ায় শেয়ার করার সেরা ইসলামিক উক্তি ও ক্যাপশন।',
    published: true,
  },
  {
    category: 'islamic',
    language: 'english',
    title: 'Trust Allah in Every Step',
    text: 'When you put your trust in Allah, your heart finds peace that the world cannot take away.',
    tags: ['#Alhamdulillah', '#Faith', '#TrustAllah'],
    slug: 'trust-allah-in-every-step',
    metaTitle: 'Trust Allah in Every Step - Islamic Quotes & Status',
    metaDescription: 'When you put your trust in Allah, your heart finds peace. Beautiful English Islamic caption for Instagram and WhatsApp.',
    published: true,
  },
  {
    category: 'motivational',
    language: 'bangla',
    title: 'কঠিন পরিশ্রমই সাফল্যের চাবিকাঠি',
    text: 'স্বপ্ন সেটা নয় যেটা তুমি ঘুমিয়ে দেখ, স্বপ্ন সেটাই যা তোমাকে ঘুমোতে দেয় না। লেগে থাকো, জয় তোমারই হবে।',
    tags: ['#Motivation', '#Success', '#HardWork'],
    slug: 'kothin-porishrom-safolyo',
    metaTitle: 'কঠিন পরিশ্রমই সাফল্যের চাবিকাঠি - মোটিভেশনাল ক্যাপশন',
    metaDescription: 'স্বপ্ন সেটা নয় যেটা তুমি ঘুমিয়ে দেখ, স্বপ্ন সেটাই যা তোমাকে ঘুমোতে দেয় না। সেরা বাংলা অনুপ্রেরণামূলক উক্তি।',
    published: true,
  },
  {
    category: 'motivational',
    language: 'english',
    title: 'Rise Above Doubts',
    text: 'Do not stop when you are tired. Stop when you are done. Your dreams are worth every drop of sweat.',
    tags: ['#Hustle', '#NeverGiveUp', '#SuccessMindset'],
    slug: 'rise-above-doubts',
    metaTitle: 'Rise Above Doubts - Inspiring Motivational Quotes',
    metaDescription: 'Do not stop when you are tired. Stop when you are done. Powerful motivational status and Instagram caption.',
    published: true,
  },
  {
    category: 'attitude',
    language: 'bangla',
    title: 'স্বকীয় ব্যক্তিত্ব ও আত্মমর্যাদা',
    text: 'কাউকে অনুকরণ নয়, নিজের ছাঁচে নিজেই অনন্য। যারা মূল্য বোঝে তারা পাশে থাকে, বাকিদের বিদায়।',
    tags: ['#Attitude', '#RoyalVibes', '#SelfWorth'],
    slug: 'swokiyo-byaktitto-atmo-morjada',
    metaTitle: 'স্বকীয় ব্যক্তিত্ব ও আত্মমর্যাদা - বাংলা অ্যাটিটিউড স্ট্যাটাস',
    metaDescription: 'কাউকে অনুকরণ নয়, নিজের ছাঁচে নিজেই অনন্য। ফেসবুক ডিপি ও রয়্যাল অ্যাটিটিউড ক্যাপশন।',
    published: true,
  },
  {
    category: 'romantic',
    language: 'bangla',
    title: 'এক জীবনের মায়াময় ভালোবাসা',
    text: 'হাজারো মানুষের ভিড়ে যার দিকে তাকালে পৃথিবীটা শান্ত হয়ে যায়, সেই তো হৃদয়ের একমাত্র আশ্রয়।',
    tags: ['#Love', '#RomanticCaptions', '#ForeverLove'],
    slug: 'ek-jiboner-mayamoy-bhalobasha',
    metaTitle: 'এক জীবনের মায়াময় ভালোবাসা - রোমান্টিক প্রেমের ক্যাপশন',
    metaDescription: 'হাজারো মানুষের ভিড়ে যার দিকে তাকালে পৃথিবী শান্ত হয়ে যায়। ভালোবাসার ছন্দ ও কাপল ফটো ক্যাপশন।',
    published: true,
  },
  {
    category: 'life',
    language: 'bangla',
    title: 'বাস্তব জীবনের কঠিন পাঠ',
    text: 'মানুষ সবসময় স্বার্থ দেখে কাছে আসে, আর সময় এলে সত্য রূপ বুঝিয়ে দিয়ে দূরে চলে যায়। এটাই বাস্তবতা।',
    tags: ['#LifeReality', '#DeepThoughts', '#TruthOfLife'],
    slug: 'bastob-jiboner-kothin-path',
    metaTitle: 'বাস্তব জীবনের কঠিন পাঠ - বাস্তবতা ও জীবনবোধ ক্যাপশন',
    metaDescription: 'মানুষ সবসময় স্বার্থ দেখে কাছে আসে, সময় এলে রূপ বোঝায়। বাস্তব জীবনের গভীর উপলব্ধি ও স্ট্যাটাস।',
    published: true,
  },
];

export async function POST() {
  try {
    const colRef = collection(db, 'captions');
    const existing = await getDocs(colRef);
    if (!existing.empty && existing.size > 0) {
      return NextResponse.json({
        success: true,
        count: existing.size,
        message: 'ডাটাবেসে ইতিমধ্যে ক্যাপশন সংরক্ষিত আছে',
      });
    }

    let addedCount = 0;
    for (const item of STARTER_CAPTIONS) {
      await addDoc(colRef, {
        ...item,
        likes: Math.floor(Math.random() * 50) + 10,
        shares: Math.floor(Math.random() * 20) + 5,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      addedCount++;
    }

    return NextResponse.json({
      success: true,
      count: addedCount,
      message: 'প্রারম্ভিক ক্যাপশন সফলভাবে ফায়ারস্টোরে সিঙ্ক হয়েছে',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
