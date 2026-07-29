Lucide glyph that inherits text color — use it anywhere an icon is needed; never hand-draw SVG.

```jsx
<Icon name="piggy-bank" size={24} />
<Icon name="arrow-up-right" size={16} color="var(--money-in)" />
```

Icons come from the lucide-static CDN via CSS mask, so `color`/`currentColor` work and no icon script is required. Stroke weight is Lucide's default 2px. Use 16 inline with text, 20 in buttons/rows, 24–28 for nav and feature tiles.
