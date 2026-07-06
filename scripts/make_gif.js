const GIFEncoder = require('gifencoder');
const Jimp = require('jimp');
const fs = require('fs');

(async () => {
  try {
    const outDir = 'assets/demo';
    const files = ['home.png','create.png','history.png','escrow1.png'].map(f => `${outDir}/${f}`);
    const first = await Jimp.read(files[0]);
    const w = first.bitmap.width;
    const h = first.bitmap.height;
    const encoder = new GIFEncoder(w, h);
    const outPath = `${outDir}/demo.gif`;
    encoder.createReadStream().pipe(fs.createWriteStream(outPath));
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(800);
    encoder.setQuality(10);

    for (const file of files) {
      const img = await Jimp.read(file);
      if (img.bitmap.width !== w || img.bitmap.height !== h) img.contain(w, h);
      const src = img.bitmap.data; // BGRA
      const frame = Buffer.alloc(w * h * 4);
      for (let i = 0; i < w * h; i++) {
        frame[i * 4] = src[i * 4 + 2];     // R
        frame[i * 4 + 1] = src[i * 4 + 1]; // G
        frame[i * 4 + 2] = src[i * 4 + 0]; // B
        frame[i * 4 + 3] = src[i * 4 + 3]; // A
      }
      encoder.addFrame(frame);
    }

    encoder.finish();
    console.log('Created', outPath);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
