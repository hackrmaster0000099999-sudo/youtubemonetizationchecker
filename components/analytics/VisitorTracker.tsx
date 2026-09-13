'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, setDoc, increment, serverTimestamp } from 'firebase/firestore';

export function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double tracking in strict mode or identical paths in short succession
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    const trackVisit = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
        const referrer = document.referrer ? new URL(document.referrer).hostname : 'Direct';
        const browser = navigator.userAgent.includes('Chrome')
          ? 'Chrome'
          : navigator.userAgent.includes('Safari')
          ? 'Safari'
          : navigator.userAgent.includes('Firefox')
          ? 'Firefox'
          : 'Other';

        // 1. Increment Total & Today visits in summary doc
        const summaryRef = doc(db, 'site_stats', 'overview');
        await setDoc(
          summaryRef,
          {
            totalPageViews: increment(1),
            lastActive: serverTimestamp(),
            [`dailyViews.${today}`]: increment(1),
            [`paths.${pathname.replace(/\//g, '_') || 'root'}`]: increment(1),
            [`devices.${isMobile ? 'mobile' : 'desktop'}`]: increment(1),
          },
          { merge: true }
        );

        // 2. Add recent live visit entry (capped in query)
        const visitsRef = collection(db, 'site_visits');
        await addDoc(visitsRef, {
          path: pathname,
          isMobile,
          referrer,
          browser,
          timestamp: serverTimestamp(),
          createdDate: today,
          userAgent: navigator.userAgent.substring(0, 150),
        });
      } catch (err) {
        // Silently fail if offline or adblocker blocks Firebase
        console.warn('Analytics logging skipped:', err);
      }
    };

    // Small delay so it does not block initial load
    const timer = setTimeout(trackVisit, 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
