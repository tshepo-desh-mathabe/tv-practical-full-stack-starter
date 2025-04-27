'use client';
import { useState, Fragment, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { connectDevice, getDevice } from '../../../utils/api';
import { isErrorResponse } from '../../../utils/generic.helper';
import { AppRotes } from '../../../utils/app.route';
import { Wrapper } from '../../../component/wrapper';

function ConnectContent() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phoneNumber') || '';
  const bearerToken = searchParams.get('token') || '';

  const handleConnect = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!code || code.length < 4) {
      alert('Please enter a valid device code (at least 4 characters)');
      return;
    }

    setIsLoading(true);

    getDevice(code, bearerToken)
      .then((response) => {
        if (isErrorResponse(response)) {
          throw new Error('Device not found');
        }
        return connectDevice(code, phoneNumber, bearerToken);
      })
      .then((response) => {
        if (isErrorResponse(response)) {
          throw new Error('Connection failed');
        }
        setTimeout(() => {
          router.push(
            `${AppRotes.CONNECTION_DETAILS}?token=${encodeURIComponent(bearerToken)}&code=${encodeURIComponent(code)}`
          );
        }, 5000);
      })
      .catch((error) => {
        console.error('Connection error:', error);
        alert(error.message || 'Sorry! We cannot connect your device right now');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Fragment>
          <div className='spinner-border text-light' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
          <span>Connecting your TV...</span>
        </Fragment>
      ) : (
        <form>
          <div className='mb-3'>
            <label htmlFor='code' className='form-label'>
              Device Code:
            </label>
            <input
              id='code'
              type='text'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder='Enter 4-digit code'
              className='form-control'
              minLength={4}
              maxLength={6}
              required
            />
          </div>

          <button 
            type='submit' 
            onClick={handleConnect} 
            className='btn btn-primary'
            disabled={!code || code.length < 4}
          >
            Connect
          </button>
        </form>
      )}
    </Wrapper>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={
      <Wrapper>
        <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      </Wrapper>
    }>
      <ConnectContent />
    </Suspense>
  );
}