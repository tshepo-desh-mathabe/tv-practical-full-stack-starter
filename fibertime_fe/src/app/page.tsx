'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppRotes } from '../utils/app.route';

export default function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`${AppRotes.MOBILE_HOME}`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Please wait while we connect you...
    </div>
  );
}