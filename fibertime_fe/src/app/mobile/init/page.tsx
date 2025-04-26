'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestOTP } from '../../../utils/api';
import { isNull } from '../../../utils/generic.helper';
import { AppRotes } from '../../../utils/app.route';
import { Wrapper } from '../../../component/wrapper';

export default function InitPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleRequestOTP = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    requestOTP(phoneNumber).then(res => {
      if (!isNull(res.message)) {
        if (Array.isArray(res.message)) {
          alert(res.message[0]);
        } else {
          alert(`Please remember this OTP: ${res.message}`);
          router.push(`${AppRotes.VERIFY}`);
        }
      }
    }).catch(error => {
      console.error('Something went wrong:', error);
      alert('Error requesting OTP');
    });
  };

  return (
    <Wrapper>
      <form>
        <div className='mb-3'>
          <label htmlFor='init' className='form-label'>Phone Number:</label>
          <input
            id='init'
            type='text'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder='e.g. +27602796353'
            className='form-control'
          />
        </div>
        <button
          type='submit'
          onClick={handleRequestOTP}
          className='btn btn-primary'
        >
          Next
        </button>
      </form>
    </Wrapper>
  );
}