import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // アプリケーションのルートコンポーネントをインポート

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // ルート要素のID（通常は "root"）にコンポーネントをレンダリング
);