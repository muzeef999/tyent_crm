"use client";

import React, { useEffect, useRef, useState } from "react";

type TypeSearchProps = {
    onSearch?: (searchText: string) => void;

  texts?: string[];           // phrases to type (we use single by default)
  typingSpeed?: number;       // ms per char when typing
  deletingSpeed?: number;     // ms per char when deleting
  pauseAfterTyping?: number;  // ms pause after a phrase is typed
  className?: string;         // extra classes for input
  inputName?: string;
};

export default function TypeSearch({
  onSearch,
  texts = ["What are you looking for?"],
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseAfterTyping = 1400,
  inputName = "search",
}: TypeSearchProps) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [caretVisible, setCaretVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [userValue, setUserValue] = useState("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // caret toggle
  useEffect(() => {
    const iv = setInterval(() => setCaretVisible((v) => !v), 500);
    return () => clearInterval(iv);
  }, []);

  // typing effect
  useEffect(() => {
    if (!mountedRef.current) return;

    // don't show the typing overlay while user is typing or focused
    if (isFocused || userValue) {
      return;
    }

    const currentText = texts[textIndex] || "";
    let timeout = typingSpeed;

    if (isDeleting) {
      timeout = deletingSpeed;
    } else {
      timeout = typingSpeed;
    }

    const timer = window.setTimeout(() => {
      if (isDeleting) {
        const nextCharIndex = Math.max(charIndex - 1, 0);
        setCharIndex(nextCharIndex);
        setDisplayText(currentText.slice(0, nextCharIndex));
        if (nextCharIndex === 0) {
          setIsDeleting(false);
          setTextIndex((i) => (i + 1) % texts.length);
        }
      } else {
        const nextCharIndex = Math.min(charIndex + 1, currentText.length);
        setCharIndex(nextCharIndex);
        setDisplayText(currentText.slice(0, nextCharIndex));
        if (nextCharIndex === currentText.length) {
          // pause then delete
          setTimeout(() => {
            if (!mountedRef.current) return;
            setIsDeleting(true);
          }, pauseAfterTyping);
        }
      }
    }, timeout);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charIndex, isDeleting, textIndex, isFocused, userValue, texts, typingSpeed, deletingSpeed, pauseAfterTyping]);

  return (
    <div className="relative w-full max-w-xl">
      {/* actual input */}
      <input
        name={inputName}
        type="search"
        value={userValue}
        onChange={(e) => { setUserValue(e.target.value);
           if(onSearch) onSearch(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-[350px] h-[38px] rounded-md  bg-card-background  p-2 focus:outline-none`}
        placeholder="" // keep empty; overlay shows typing text
        aria-label="Search"
      />

      {/* overlay placeholder (shown only when input empty and not focused) */}
      {(!userValue && !isFocused) && (
        <div
          className="pointer-events-none absolute inset-y-0 flex items-center text-md p-2 text-gray-500"
          style={{ transform: "translateY(0)" }}
        >
          <span>{displayText}</span>
          <span
            aria-hidden
            className="ml-1"
            style={{ opacity: caretVisible ? 1 : 0 }}
          >
            |
          </span>
        </div>
      )}
    </div>
  );
}
