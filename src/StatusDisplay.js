import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ConvertJson(api) {
  const apiParams = {};
  api.apiParams.forEach((param) => {
    apiParams[param.key] = param.value;
  });
  console.log(apiParams);
  return apiParams;
}

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
    const params = ConvertJson(api);
    await axios.get(
      api.apiEndpoint,
      {
        params: {
          params
        }
      }
    ).then(response => {
      setStatusCodes((prevStatusCodes) => ({
        ...prevStatusCodes,
        [api.apiName]: response.status,
      }));
      setLastApiRequestTime(new Date());
    }).catch(error => {
      console.error(`${api.apiName} API呼び出し中にエラーが発生しました`, error);
      setStatusCodes((prevStatusCodes) => ({
        ...prevStatusCodes,
        [api.apiName]: error.response.status,
      }));
    })
  };

  return (
    <div>
      {apiInfo.map((api) => (
        <div key={api.apiName}>
          <p>API名: {api.apiName}</p>
          <p>ステータスコード: {statusCodes[api.apiName]}</p>
          <p>最終更新時間: {lastApiRequestTime ? lastApiRequestTime.toLocaleTimeString() : 'まだ送信されていません'}</p>
        </div>
      ))}
    </div>
  );
}

export default StatusDisplay;
