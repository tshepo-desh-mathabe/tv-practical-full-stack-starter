'use client';
import { useState } from 'react';
import { login } from '../../../utils/api';
import { useRouter } from 'next/navigation';
import { isErrorResponse } from '../../../utils/generic.helper';
import { AppRotes } from '../../../utils/app.route';
import { Wrapper } from '../../../component/wrapper';

export default function VerifyPage() {
    const [otp, setOtp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const router = useRouter();

    const handleSignIn = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        login(phoneNumber, otp).then(res => {
            const isError = isErrorResponse(res);
            if (!isError) {
                const token = res.token?.startsWith('Bearer ') ? res.token.slice(7) : res.token;
                router.push(`${AppRotes.TV_CONNCECT}?token=${encodeURIComponent(token)}&phoneNumber=${encodeURIComponent(phoneNumber)}`);
            }
        }).catch(error => {
            console.error('Something went wrong:', error);
            alert('Sorry you could not verify yourself');
        });
    };

    return (
        <Wrapper>
            <form>
                <div className='mb-3'>
                    <label htmlFor='otp' className='form-label'>OTP:</label>
                    <input
                        id='otp'
                        type='text'
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder='Enter OTP'
                        className='form-control'
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor='phoneNumber' className='form-label'>Phone Number:</label>
                    <input
                        type='text'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder='e.g. +27602796353'
                        className='form-control'
                    />
                </div>

                <button type='submit' onClick={handleSignIn} className='btn btn-primary' style={{marginRight: '5px'}}>Verify</button>
                <button type='button' className='btn btn-secondary' onClick={() => router.push(`${AppRotes.MOBILE_HOME}`)}>Back</button>
            </form>
        </Wrapper>
    );
}