Demo assets and capture instructions

Files produced by the demo capture workflow:
- assets/demo/home.png
- assets/demo/create.png
- assets/demo/history.png
- assets/demo/escrow1.png
- assets/demo/demo.mp4
- assets/demo/demo.gif

Prerequisites
- Node.js (16+)
- Optional: ffmpeg or ImageMagick to make GIFs
- Recommended: Install Playwright

Install Playwright (one-time):

```
npm i -D playwright
npx playwright install
```

Run the capture script:

```
node scripts/capture_demo.mjs
```

This will create screenshots in `assets/demo/`.

Create a MP4 then GIF with ffmpeg (example):

1) Create a text file `assets/demo/frames.txt` listing images in order (already included).

2) Build a short mp4:

```
ffmpeg -y -f concat -safe 0 -i assets/demo/frames.txt -vf "fps=1,scale=800:-1" assets/demo/demo.mp4
```

3) Convert mp4 to gif (optional):

```
ffmpeg -y -i assets/demo/demo.mp4 -vf "fps=10,scale=800:-1:flags=lanczos" assets/demo/demo.gif
```

Alternative (ImageMagick):

```
magick convert -delay 100 assets/demo/home.png assets/demo/create.png assets/demo/history.png assets/demo/escrow1.png assets/demo/demo.gif
```

Notes:
- The capture script navigates to key pages and takes full-page screenshots. If your routes differ, edit `scripts/capture_demo.mjs` accordingly.
- For Windows PowerShell, run the commands in an elevated terminal if necessary.
