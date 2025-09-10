'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { defaultSkipLinks, SkipLinks, skipLinksId } from './skip-links';

const SkipLinksPortal = ({
  links = defaultSkipLinks,
  elementId = skipLinksId
}: {
  links?: { label: string; anchor: string }[];
  elementId?: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  return isMounted ? createPortal(<SkipLinks links={links} />, document.getElementById(elementId) ?? document.body) : null;
};

export default SkipLinksPortal;
