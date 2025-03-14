import React, { useState } from 'react';
import { initiateAuth, respondToAuthChallenge } from './libs/cognito/cognito';
import { createLogger } from './libs/logger/logger';
import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import TokensDisplay from './TokenDisplay';
import api, { setApiAccessToken } from './libs/api/api';
import BffComponent from './BffComponent';

const logger = createLogger('Login');

  // Step 1: Initiate the custom auth flow (send OTP)

const SignUpWithOTP: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [session, setSession] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [tokens, setTokens] = useState<AuthenticationResultType | null>(null);


  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await initiateAuth(email);
      
      setSession(response.Session || null);
      setMessage('OTP has been sent to your email. Please check your inbox.');
    } catch (error) {
      logger.error('Error initiating auth:', error);
      setMessage('Failed to initiate authentication.');
    }
  };

  // Step 2: Respond to the OTP challenge
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setMessage('No active session found.');
      return;
    }
    try {

      const response = await respondToAuthChallenge(email, otp, session);
      logger.info({respondToAuthChallenge: response});
      
      if (response.AuthenticationResult) {
        setTokens(response.AuthenticationResult);

        if(response.AuthenticationResult.AccessToken) {
          setApiAccessToken(response.AuthenticationResult.AccessToken);
        }

        setMessage('Authentication successful!');
      } else {
        setMessage('Authentication failed or further challenges required.');
      }
    } catch (error) {
      logger.error('Error verifying OTP:', error);
      setMessage('OTP verification failed.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Passwordless Sign Up / Sign In</h2>
      {message && <p>{message}</p>}
      {!session ? (
        <form onSubmit={handleEmailSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', margin: '8px 0' }}
            />
          </div>
          <button type="submit" style={{ padding: '8px 16px' }}>
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <div>
            <label htmlFor="otp">Enter OTP:</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', margin: '8px 0' }}
            />
          </div>
          <button type="submit" style={{ padding: '8px 16px' }}>
            Verify OTP
          </button>
        </form>
      )}
      {tokens && <BffComponent />}
      {tokens && <TokensDisplay {...tokens} />}
    </div>
  );
};

export default SignUpWithOTP;

