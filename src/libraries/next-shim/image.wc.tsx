'use client';

import type { ImgHTMLAttributes } from 'react';

export type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

export const Image = (props: ImageProps) => <img {...props} alt={props.alt} />;

export default Image;
