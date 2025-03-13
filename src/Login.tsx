import React, { useState } from 'react';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const SignUpWithOTP: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [session, setSession] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [tokens, setTokens] = useState<any>(null);

  // Configure the Cognito client using your environment variables
  const client = new CognitoIdentityProviderClient({
    region: import.meta.env.VITE_AWS_REGION,
  });
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string;

  // Step 1: Initiate the custom auth flow (send OTP)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'CUSTOM_AUTH',
        ClientId: clientId,
        AuthParameters: { USERNAME: email },
      });
      const response = await client.send(command);
      setSession(response.Session || null);
      setMessage('OTP has been sent to your email. Please check your inbox.');
    } catch (error) {
      console.error('Error initiating auth:', error);
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
      const command = new RespondToAuthChallengeCommand({
        ChallengeName: 'CUSTOM_CHALLENGE',
        ClientId: clientId,
        Session: session,
        ChallengeResponses: {
          USERNAME: email,
          ANSWER: otp,
        },
      });
      const response = await client.send(command);
      if (response.AuthenticationResult) {
        setTokens(response.AuthenticationResult);
        setMessage('Authentication successful!');
      } else {
        setMessage('Authentication failed or further challenges required.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
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
      {tokens && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Authentication Tokens</h3>
          <pre>{JSON.stringify(tokens, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SignUpWithOTP;
