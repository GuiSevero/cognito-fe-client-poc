import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";
import { useState } from "react";

const TokensDisplay = ({ AccessToken, IdToken, RefreshToken }: AuthenticationResultType) => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = async (text: string | undefined, tokenType: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedToken(tokenType);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const TokenField = ({ token, label }: { token: string | undefined; label: string }) => (
    <div className="token-field" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0 }}>{label}</h4>
        <button onClick={() => copyToClipboard(token, label)}>
          {copiedToken === label ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <textarea 
        readOnly
        value={token || 'Not available'}
        style={{ width: '100%', minHeight: '60px' }}
      />
    </div>
  );

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Authentication Tokens</h3>
      <TokenField token={AccessToken} label="Access Token" />
      <TokenField token={IdToken} label="ID Token" />
      <TokenField token={RefreshToken} label="Refresh Token" />
    </div>
  );
};

export default TokensDisplay;
