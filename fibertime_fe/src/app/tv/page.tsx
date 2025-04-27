'use client';
import { useEffect, useState } from 'react';
import { generateTVCode } from '../../utils/api';
import { Wrapper } from '../../component/wrapper';

export default function TVPage() {
    const [code, setCode] = useState<string>('');
    const [origin, setOrigin] = useState<string>('');

    useEffect(() => {
        const fetchCode = async () => {
            try {
                const response = await generateTVCode();
                setCode(response.message);
            } catch (error) {
                console.error('Error generating TV code:', error);
            }
        };
        fetchCode();

        setOrigin(window.location.origin);
    }, []);

    return (
        <Wrapper>
            <div className="card bg-secondary text-white p-4 shadow-lg">
                <p className="fs-3 mb-3">Your Pairing Code:</p>
                <p className="display-3 font-monospace text-center">{code || 'Loading...'}</p>
                <p className="fs-5 mt-4">
                    On your phone, go to{' '}
                    <a
                        href={origin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white text-decoration-underline"
                    >
                        fibertime.tv
                    </a>{' '}
                    and enter this code
                </p>
                <span>Please get in touch with as on WhatsApp for any assistance: +27 60 279 6353</span>
            </div>
        </Wrapper>
    );
}
