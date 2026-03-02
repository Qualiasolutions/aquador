'use client';

import { useState, useEffect } from 'react';

interface RichDescriptionProps {
  description: string;
}

export default function RichDescription({ description }: RichDescriptionProps) {
  const isHTML = /<[a-z][\s\S]*>/i.test(description);
  const [sanitizedHTML, setSanitizedHTML] = useState('');

  useEffect(() => {
    if (isHTML) {
      import('dompurify').then(mod => {
        setSanitizedHTML(mod.default.sanitize(description));
      });
    }
  }, [description, isHTML]);

  if (!isHTML) {
    return (
      <div className="space-y-2">
        {description.split('\n').filter(Boolean).map((para, i) => (
          <p key={i} className="text-gray-300 leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    );
  }

  if (!sanitizedHTML) {
    return (
      <div className="space-y-2">
        {description.replace(/<[^>]*>/g, '').split('\n').filter(Boolean).map((para, i) => (
          <p key={i} className="text-gray-300 leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div
      className="product-description"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}
