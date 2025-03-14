import { useState } from "react";
import api from "./libs/api/api";

const BffComponent = () => {
  const [response, setResponse] = useState<string>('');

  const callBff = async () => {
    const response = await api.get('/auth/usertoken');
    setResponse(JSON.stringify(response.data, null, 2));
  }

  return (
    <>
    <div>
      <button onClick={callBff}>
       Call BFF
      </button>
      {response && <pre>{response}</pre>}
    </div>
    </>
  )
};

export default BffComponent;
