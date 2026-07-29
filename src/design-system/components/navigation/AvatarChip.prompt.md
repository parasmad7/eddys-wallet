Child selector for the parent dashboard. Also exports `Avatar` (initial-in-a-circle) for use in rows and headers.

```jsx
<AvatarChip name="Maya" caption="$12.40 · 2 goals" selected onClick={pick} />
<Avatar name="Ben" size={32} />
```

No photos or emoji — children provide only a name (no PII), so an initial on an auto-assigned chip colour is the avatar system.
