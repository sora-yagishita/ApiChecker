import React, { useState, useEffect } from 'react';

function StatusDisplay() {
  const [apiInfo, setApiInfo] = useState([]);
  const [statusCodes, setStatusCodes] = useState({});
  const [lastApiRequestTime, setLastApiRequestTime] = useState(null);

  useEffect(() => {
    const endpointData = require('./endpoints.json');
    const apiInfo = endpointData.apiInfo;

    setApiInfo(apiInfo);

    apiInfo.forEach((api) => {
      fetchStatusCode(api);
    });

    const intervalId = setInterval(() => {
      apiInfo.forEach((api) => {
        fetchStatusCode(api);
      });
    }, 3600000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchStatusCode = async (api) => {
    try {
      const response = await fetch(api.apiEndpoint, {
        method: 'GET',
      });

      const status = response.status;
      setStatusCodes((prevStatusCodes) => ({
        ...prevStatusCodes,
        [api.apiName]: status,
      }));

      setLastApiRequestTime(new Date());
    } catch (error) {
      console.error(`${api.apiName} API呼び出し中にエラーが発生しました`, error);
      setStatusCodes((prevStatusCodes) => ({
        ...prevStatusCodes,
        [api.apiName]: 'Error',
      }));
    }
  };

  return (
    <div>
      {apiInfo.map((api) => (
        <div key={api.apiName}>
          <p>API名: {api.apiName}</p>
          <p>ステータスコード: {statusCodes[api.apiName]}</p>
        </div>
      ))}
      <p>最終更新時間: {lastApiRequestTime ? lastApiRequestTime.toLocaleTimeString() : 'まだ送信されていません'}</p>
    </div>
  );
}

export default StatusDisplay;
