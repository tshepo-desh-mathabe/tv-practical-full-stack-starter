'use client';
import { Fragment, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { isNull } from '../../../../utils/generic.helper';
import { Wrapper } from '../../../../component/wrapper';
import { checkConnectionStatus } from '../../../../utils/api';

function BundleDetailContent() {
  const [bundle, setBundle] = useState<{
    deviceCode: string;
    deviceExpiresAt: string;
    bundle: {
      remainingDays: number;
      remainingHours: number;
    };
  } | null>(null);
  
  const searchParams = useSearchParams();
  const bearerToken = searchParams.get('token') || '';
  const code = searchParams.get('code') || '';

  useEffect(() => {
    if (bearerToken.length > 0 && code.length > 0) {
      checkConnectionStatus(code, bearerToken)
        .then(res => {
          if (!isNull(res.message)) {
            const errorMessage = Array.isArray(res.message) 
              ? res.message[0] 
              : res.message;
            alert(errorMessage);
          } else {
            setBundle(res);
          }
        })
        .catch(error => {
          console.error('Connection check failed:', error);
          alert('Failed to check connection status');
        });
    }
  }, [bearerToken, code]);

  function formatDate(dateString: string) {
    try {
      const date = new Date(dateString);
      const day = date.getUTCDate();
      const month = date.toLocaleString('en-GB', { 
        month: 'short', 
        timeZone: 'UTC' 
      });
      const year = date.getUTCFullYear();
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      
      return `${day} ${month} ${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  }

  return (
    <Wrapper>
      {bundle === null ? (
        <span className="text-gray-500">
          We could not retrieve your bundle info. If the TV is connected, 
          you should be good for now!
        </span>
      ) : (
        <Fragment>
          <div className="mb-4">
            <span className="block">Device successfully paired to:</span>
            <strong className="text-green-600">{bundle.deviceCode}</strong>
          </div>
          
          <div className="mb-4">
            <span className="block">Connection expires at:</span>
            <strong>{formatDate(bundle.deviceExpiresAt)}</strong>
          </div>
          
          <div>
            <span className="block">Remaining subscription:</span>
            <strong>
              {bundle.bundle.remainingDays} days and {bundle.bundle.remainingHours} hours
            </strong>
          </div>
        </Fragment>
      )}
    </Wrapper>
  );
}

export default function BundleDetailPage() {
  return (
    <Suspense fallback={
      <Wrapper>
        <div className="text-center py-8">
          <span className="animate-pulse">Loading connection details...</span>
        </div>
      </Wrapper>
    }>
      <BundleDetailContent />
    </Suspense>
  );
}