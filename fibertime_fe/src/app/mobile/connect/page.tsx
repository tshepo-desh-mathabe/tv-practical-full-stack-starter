'use client';
import { useState, useEffect } from 'react';
import { connectDevice, getDevice } from '../../../utils/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { isErrorResponse } from '../../../utils/generic.helper';
import { AppRotes } from '../../../utils/app.route';
import { Wrapper } from '../../../component/wrapper';
import io, { Socket } from 'socket.io-client';

export default function ConnectPage() {
  const [code, setCode] = useState('');
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phoneNumber') || '';
  const bearerToken = searchParams.get('token') || '';

  useEffect(() => {
    if (bearerToken && code.length >= 4 && isDeviceConnected) {
      alert('HAHAH')
      // Connect to WebSocket server
      const newSocket = io('http://localhost:5589', {
        path: '/device.code.socket.io',
        // transports: ['polling', 'websocket'], // Prefer polling, fallback to WebSocket
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        console.log(`WebSocket connected successfully (${newSocket.io.engine.transport.name})`);
        newSocket.emit('deviceCode', code);
      });

      newSocket.on('bundle-report', (data) => {
        console.log('Received bundle-report:', data);
        if (data.connectionStatus === 'ACTIVE' && data.deviceCode === code) {
          const bundleExpiry = data.bundle?.expiresAt || '29 days 23 hours remaining';
          // router.push(
          //   `${AppRotes.CONNECTION_DETAILS}?token=${encodeURIComponent(bearerToken)}&code=${encodeURIComponent(code)}&bundle=${encodeURIComponent(bundleExpiry)}`
          // );
        }
      });

      newSocket.on('error', (error: { message: string }) => {
        console.error('WebSocket error:', error.message);
        alert(`WebSocket error: ${error.message}`);
      });

      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
      });

      setSocket(newSocket);

      // Cleanup
      return () => {
        console.log('Disconnecting WebSocket');
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [bearerToken, code, isDeviceConnected, router]);

  const handleConnect = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    getDevice(code, bearerToken)
      .then((response) => {
        const isError = isErrorResponse(response);
        if (!isError) {
          // Found a device
          connectDevice(code, phoneNumber, bearerToken)
            .then((response) => {
              const isError = isErrorResponse(response);
              if (!isError) {
                console.log('Device connected successfully');
                setIsDeviceConnected(true); // Set state to trigger WebSocket
                // router.push(
                //   `${AppRotes.CONNECTION_DETAILS}?token=${encodeURIComponent(bearerToken)}&code=${encodeURIComponent(code)}`
                // );
              }
            })
            .catch((error) => {
              console.error('Connection error:', error);
              alert('Sorry! We cannot connect your device right now');
            });
        }
      })
      .catch((error) => {
        console.error('Device lookup error:', error);
        alert('Please double check the device code.');
      });
  };

  return (
    <Wrapper>
      <form>
        <div className="mb-3">
          <label htmlFor="code" className="form-label">
            Device Code:
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter device code"
            className="form-control"
          />
        </div>

        <button type="submit" onClick={handleConnect} className="btn btn-primary">
          Connect
        </button>
      </form>
    </Wrapper>
  );
}