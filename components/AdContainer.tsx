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
    try {
      const w = window as any;
      if (w.adsbygoogle) {
        // Push the ad request
        w.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("AdSense push error:", e);
    }
  }, []);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-6 ${className}`}>
      <div className="text-[10px] text-slate-500 dark:text-slate-500 font-medium uppercase tracking-widest mb-1 self-start ml-1">Advertisement</div>
      <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden min-h-[100px] flex items-center justify-center border border-slate-200 dark:border-slate-800">
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