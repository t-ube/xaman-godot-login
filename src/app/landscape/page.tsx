// page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './GodotWebView.module.css';
import { Xumm } from 'xumm';

const GodotWebView: React.FC = () => {
  const webviewRef = useRef<HTMLIFrameElement>(null);
  const [windowSize, setWindowSize] = useState({ width: '100vw', height: '100vh' });
  const [bearer, setBearer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [xumm, setXumm] = useState<Xumm | null>(null);

  useEffect(() => {
    const initializeXumm = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const xAppToken = urlParams.get('xAppToken');

        if (!xAppToken) {
          throw new Error("No xAppToken found in URL");
        }

        const xumm = new Xumm(process.env.NEXT_PUBLIC_XUMM_API_KEY, xAppToken);
        
        await xumm.authorize();

        const bearerToken = await xumm.environment.bearer;
        if (bearerToken) {
          setBearer(bearerToken);
        } else {
          throw new Error("Failed to obtain bearer token");
        }

        setXumm(xumm);

      } catch (error) {
        console.error('Initialization error:', error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      }
    };

    const handleOrientation = () => {
      const container = document.getElementById('game-container');
      if (container) {
        if (window.orientation === 0 || window.orientation === 180) {
          container.classList.add(styles.portrait);
        } else {
          container.classList.remove(styles.portrait);
        }
      }
    };

    window.addEventListener('orientationchange', handleOrientation);
    handleOrientation(); // 初期方向を設定

    /*
    const handleResize = () => {
      setWindowSize({ width: `${window.innerWidth}px`, height: `${window.innerHeight}px` });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 初期サイズを設定
    */
   
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'FROM_GODOT') {
        console.log('Received message from Godot:', event.data.message);
        // Godotからのメッセージを処理
        if (event.data.message === 'payment') {
          console.log("Bearer token obtained");
          xumm?.payload?.create({
            TransactionType: 'Payment',
            Destination: 'rPJuukGFu7Awm2c2fBY8jcAndfEZQngbpD',
            Amount: String(1)
          }).then((payload:any) => {
            xumm.xapp?.openSignRequest(payload)
          })
        } else if (bearer) {
          sendMessageToGodot(bearer);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    initializeXumm();

    return () => {
      window.removeEventListener('orientationchange', handleOrientation);
      window.removeEventListener('message', handleMessage);
    };
    /*
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('message', handleMessage);
    };
    */
  }, [xumm,bearer]);

  const sendMessageToGodot = (message: string) => {
    if (webviewRef.current) {
      webviewRef.current.contentWindow?.postMessage({ type: 'FROM_NEXTJS', message }, '*');
    }
  };

  return (
    <div id="game-container" className={styles.fullscreen}>
      <iframe
        ref={webviewRef}
        src="https://xaman-godot.pages.dev"
        className={styles.fullscreenIframe}
        allow="autoplay; fullscreen; encrypted-media"
      />
    </div>
  );
};

export default GodotWebView;