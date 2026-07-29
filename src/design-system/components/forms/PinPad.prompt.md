The kid login keypad — big chunky keys, dot display, no keyboard required.

```jsx
<PinPad length={4} value={pin} onChange={setPin} label="Enter your PIN" error={bad && 'That PIN didn\'t match. 4 tries left.'} />
```

Keys are 72×64 — well above the 48px kid-safe target. Show remaining attempts in `error` (the PRD rate-limits to 5 per 15 minutes).
