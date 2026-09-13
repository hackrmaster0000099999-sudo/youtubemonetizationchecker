import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { CaptionItem, CAPTIONS_DATA } from './constants/captions';

// Initialize Firebase App singleton safely
export const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID from config if available
export const db: Firestore =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId.trim() !== ''
    ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId)
    : getFirestore(firebaseApp);

export interface FirestoreCaption {
  id: string;
  title?: string;
  text: string;
  category: string;
  language: 'bangla' | 'english';
  imageUrl?: string;
  slug: string;
  tags?: string[];
  likes?: number;
  shares?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  published?: boolean;
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
}

/**
 * Fetch captions from Firestore with fallback to static constants
 */
export async function getCaptions(options?: {
  category?: string;
  language?: 'bangla' | 'english';
  withImageOnly?: boolean;
}): Promise<CaptionItem[]> {
  try {
    const colRef = collection(db, 'captions');
    let q = query(colRef);

    if (options?.category && options.category !== 'all') {
      q = query(q, where('category', '==', options.category));
    }
    if (options?.language) {
      q = query(q, where('language', '==', options.language));
    }

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const firestoreItems: CaptionItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          text: data.text || '',
          category: data.category,
          language: data.language || 'bangla',
          tags: Array.isArray(data.tags) ? data.tags : [],
          imageUrl: data.imageUrl || undefined,
          slug: data.slug || docSnap.id,
          title: data.title || undefined,
          metaTitle: data.metaTitle || undefined,
          metaDescription: data.metaDescription || undefined,
          likes: typeof data.likes === 'number' ? data.likes : 0,
          shares: typeof data.shares === 'number' ? data.shares : 0,
        };
      });

      if (options?.withImageOnly) {
        return firestoreItems.filter((item) => Boolean(item.imageUrl));
      }
      return firestoreItems;
    }
  } catch (error) {
    console.warn('Firestore fetch failed or offline, using fallback data:', error);
  }

  // Fallback to static data
  let fallback = [...CAPTIONS_DATA];
  if (options?.category && options.category !== 'all') {
    fallback = fallback.filter((c) => c.category === options.category);
  }
  if (options?.language) {
    fallback = fallback.filter((c) => c.language === options.language);
  }
  if (options?.withImageOnly) {
    fallback = fallback.filter((c) => Boolean(c.imageUrl));
  }
  return fallback;
}

/**
 * Get single caption by category and slug
 */
export async function getCaptionBySlug(
  category: string,
  slug: string
): Promise<CaptionItem | null> {
  try {
    const colRef = collection(db, 'captions');
    const q = query(
      colRef,
      where('category', '==', category),
      where('slug', '==', slug),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const data = docSnap.data();
      return {
        id: docSnap.id,
        text: data.text || '',
        category: data.category,
        language: data.language || 'bangla',
        tags: Array.isArray(data.tags) ? data.tags : [],
        imageUrl: data.imageUrl || undefined,
        slug: data.slug || slug,
        title: data.title || undefined,
        metaTitle: data.metaTitle || undefined,
        metaDescription: data.metaDescription || undefined,
        likes: typeof data.likes === 'number' ? data.likes : 0,
        shares: typeof data.shares === 'number' ? data.shares : 0,
      };
    }
  } catch (error) {
    console.warn('Error fetching caption by slug from Firestore:', error);
  }

  // Fallback search
  const found = CAPTIONS_DATA.find(
    (c) => c.category === category && (c.slug === slug || c.id === slug)
  );
  return found || null;
}
