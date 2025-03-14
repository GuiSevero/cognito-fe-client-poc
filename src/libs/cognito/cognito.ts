import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { createLogger } from '../logger/logger';

  // Configure the Cognito client using your environment variables
  const client = new CognitoIdentityProviderClient({
    region: import.meta.env.VITE_AWS_REGION,
  });
  
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string;

  const logger = createLogger('cognito');

  export const initiateAuth = async (email: string) => {
    const command = new InitiateAuthCommand({
      AuthFlow: 'CUSTOM_AUTH',
      ClientId: clientId,
      AuthParameters: { USERNAME: email },
    });
    const response = await client.send(command);
    logger.info({initiateAuth: response});
    return response;
  };

  export const respondToAuthChallenge = async (email: string, otp: string, session: string) => {

    const command = new RespondToAuthChallengeCommand({
      ChallengeName: 'CUSTOM_CHALLENGE',
      ClientId: clientId,
      ChallengeResponses: { USERNAME: email, ANSWER: otp },
      Session: session
    });
    
    const response = await client.send(command);
    logger.info({respondToAuthChallenge: response});
    return response;
  };  
