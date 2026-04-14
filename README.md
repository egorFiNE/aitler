# aitler

A browser extension that replaces visible standalone `AI` text with `HITLER` on web pages in order to protect user's sanity.

## Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder

## Safari

Safari support is provided through Apple's Safari Web Extension converter.

1. Open Terminal.
2. Run:

```bash
xcrun safari-web-extension-converter /Users/egor/workspace/aitler
```

3. Open the generated Xcode project.
4. Build and run the wrapper app.
5. Enable the extension in Safari settings.

It doesn't work anyway and I'm too lazy to figure this out.

