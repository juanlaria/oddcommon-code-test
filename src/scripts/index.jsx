import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import data from '@data';

import Styles from './index.module.scss';

// Import Components
import { Logo, Layout } from '@components';

// App
const App = () => {
  return (
    <StrictMode>
      <Logo className={Styles.logo} />
      <Layout content={data} />
    </StrictMode>
  );
};

// Create root and render
const domContainer = document.querySelector('#app');
const root = createRoot(domContainer);
root.render(<App />);
