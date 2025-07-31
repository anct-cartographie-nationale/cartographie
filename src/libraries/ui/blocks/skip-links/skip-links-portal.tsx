'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { defaultSkipLinks, SkipLinks } from './skip-links';

const SkipLinksPortal = ({
  links = defaultSkipLinks,
  elementId = 'skip-links'
}: {
  links?: { label: string; anchor: string }[];
  elementId?: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  return isMounted ? createPortal(<SkipLinks links={links} />, document.getElementById(elementId) ?? document.body) : null;
};
export default SkipLinksPortal;
