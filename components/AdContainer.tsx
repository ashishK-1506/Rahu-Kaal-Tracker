import React, { useEffect, useRef } from 'react';

interface Props {
  className?: string;
  slotId?: string; // The specific ad slot ID from AdSense
  clientId?: string; // The publisher ID (e.g., ca-pub-XXXX)
  format?: 'auto' | 'fluid' | 'rectangle';
}

export const AdContainer: React.FC<Props> = ({ 
  className = "", 
  slotId = "1234567890", // Placeholder: Replace with your actual Ad Slot ID
  clientId = "ca-pub-XXXXXXXXXXXXXXXX", // Placeholder: Replace with your actual Client ID
  format = "auto" 
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // 1. Dynamic Script Injection (Lazy Loading)
    // We only inject the script once when this component first mounts.
    const scriptId = 'adsense-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    // 2. Push the ad request
    try {
      const w = window as any;
      w.adsbygoogle = w.adsbygoogle || [];
      // Use a small timeout to ensure script tag injection has processed in DOM
      setTimeout(() => {
          if (adRef.current && adRef.current.innerHTML === "") {
             w.adsbygoogle.push({});
          }
      }, 100);
    } catch (e) {
      console.error("AdSense push error:", e);
    }
  }, [clientId]);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-6 ${className}`}>
      <div className="text-[10px] text-slate-500 dark:text-slate-500 font-medium uppercase tracking-widest mb-1 self-start ml-1">Advertisement</div>
      {/* 
         Min-height set to 280px to reserve space for the most common mobile ad size (300x250) + padding.
         This prevents the layout from shifting when the ad loads.
      */}
      <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden min-h-[280px] flex items-center justify-center border border-slate-200 dark:border-slate-800">
          <ins className="adsbygoogle"
               style={{ display: 'block', width: '100%', textAlign: 'center' }}
               data-ad-client={clientId}
               data-ad-slot={slotId}
               data-ad-format={format}
               data-full-width-responsive="true"
               ref={adRef}
          ></ins>
      </div>
    </div>
  );
};