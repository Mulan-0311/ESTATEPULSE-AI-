import React, { useEffect, useRef, useState } from 'react';
import { animate, stagger, splitText } from 'animejs';

interface AnimatedSplitTextProps {
  text: string;
  className?: string;
}

export function AnimatedSplitText({ text, className = '' }: AnimatedSplitTextProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const splitRef = useRef<any>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (!textRef.current) return;

    // 1. Initialize the splitText on our paragraph reference
    const split = splitText(textRef.current, {
      words: { wrap: 'clip' },
      debug: true, // Adds debug borders, you can remove this later
    });
    
    splitRef.current = split;

    // 2. Add the animation effect directly to the split words
    split.addEffect((self: any) => animate(self.words, {
      y: ['100%', '0%'],
      duration: 1250,
      ease: 'out(3)',
      delay: stagger(100),
      loop: true,
      alternate: true,
    }));

    // Cleanup when component unmounts
    return () => {
      split.revert();
    };
  }, []);

  const handleRevert = () => {
    if (splitRef.current) {
      splitRef.current.revert();
      setIsDisabled(true);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 my-10">
      {/* The Text Target */}
      <p ref={textRef} className={`text-4xl md:text-5xl font-bold overflow-hidden text-center ${className}`}>
        {text}
      </p>
      
      {/* The Trigger Button */}
      <button 
        onClick={handleRevert} 
        disabled={isDisabled}
        className="px-6 py-3 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 font-medium border border-blue-500/50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDisabled ? "Animation Reverted" : "Revert Animation"}
      </button>
    </div>
  );
}
