import React, { useState, useEffect } from 'react';

export const ImplementationView: React.FC = () => {
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mode = isMobileScreen ? 'mobile' : 'desktop';
  const targetUrl = 'https://www.instagram.com/stie.wikara/embed/';
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(targetUrl)}&mode=${mode}`;

  return (
    <div className="w-full h-[calc(100vh-105px)] bg-black overflow-hidden relative">
      <iframe
        key={mode}
        src={proxyUrl}
        title="Instagram Profile @stie.wikara"
        className="w-full h-full border-0 outline-none"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>
  );
};
