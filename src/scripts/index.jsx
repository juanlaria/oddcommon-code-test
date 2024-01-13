import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import data from '@data';

// Import Components
import { Layout } from '@components';

// App
const App = () => {
  return (
    <StrictMode>
      <Layout content={data} />
    </StrictMode>
  );
};

// Create root and render
const domContainer = document.querySelector('#app');
const root = createRoot(domContainer);
root.render(<App />);
