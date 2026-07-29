import type { CSSProperties, HTMLAttributes } from 'react';

const CDN = 'https://unpkg.com/lucide-static@0.469.0/icons/';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Lucide icon slug, e.g. "piggy-bank", "wallet", "arrow-up-right". */
  name: string;
  /** Pixel box for the glyph. Default 20. */
  size?: number;
  /** Overrides currentColor. */
  color?: string;
  style?: CSSProperties;
}

/** Lucide icon rendered as a CSS mask so it inherits currentColor. */
export function Icon({ name, size = 20, color, style, ...rest }: IconProps) {
  const url = `url("${CDN}${name}.svg")`;
  return (
    <span
      aria-hidden="true"
      {...rest}
      style={{
        display: 'inline-block',
        flex: 'none',
        width: size,
        height: size,
        background: color || 'currentColor',
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        ...style,
      }}
    />
  );
}
