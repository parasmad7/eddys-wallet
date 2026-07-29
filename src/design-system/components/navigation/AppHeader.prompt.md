The mode-coloured app bar. Its gradient comes from `--mode-header`, so wrapping the app in `data-theme="kid"` or `"parent"` is what makes the two modes unmistakable.

```jsx
<AppHeader mode="kid" subtitle="The Smith Family" title="Hi, Maya!" actions={<IconButton icon="bell" label="Alerts" variant="onBrand" />} />
```
