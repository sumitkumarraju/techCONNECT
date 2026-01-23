import React from 'react';

export const LoaderOne = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] w-full h-full">
            <div className="w-16 h-16 relative">
                <img
                    src="/jules-pixelated.png"
                    alt="Squid agent"
                    width={64}
                    height={64}
                    className="aspect-square will-change-opacity will-change-transform pixelated-img w-full h-full animate-pulse object-contain drop-shadow-[0_0_15px_rgba(42,10,85,0.8)]"
                />
            </div>
            <p className="mt-4 text-jules-accent font-bold animate-pulse tracking-widest text-xs">INITIALIZING WORKSPACE...</p>
        </div>
    );
};

// Default export if needed elsewhere
export default LoaderOne;
