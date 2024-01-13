import React, { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import gsap from 'gsap';

import { Logo, VideosList } from '@components';

import { useGeneralStore } from '@data/generalStore';

import Styles from './Layout.module.scss';

const queryClient = new QueryClient();

const Layout = ({ content }) => {
  // Stores
  const { loadingData } = useGeneralStore();

  // Refs
  const $background = useRef();
  const $logo = useRef();

  useEffect(() => {
    if (!loadingData) {
      // Animate Loader Background
      gsap.to($background.current, {
        opacity: 0,
        pointerEvents: 'none',
        delay: 2, // Delay to make sure loader doesn't show just some miliseconds
        duration: 1,
      });
      // Animate Logo
      gsap.to($logo.current, {
        pointerEvents: 'none',
        xPercent: 0,
        yPercent: 0,
        top: '20px',
        left: '20px',
        animation: 'initial',
        opacity: 1,
        delay: 1,
        duration: 1,
      });
    }
  }, [loadingData]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={Styles.loader}>
        {' '}
        {/* Show loader while loading data */}
        <div ref={$background} className={Styles.background} />
        <div ref={$logo} className={Styles.logo}>
          <Logo />
        </div>
      </div>
      <main className={Styles.main}>
        <VideosList content={content} />
      </main>
    </QueryClientProvider>
  );
};

export default Layout;
