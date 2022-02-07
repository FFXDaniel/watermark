import Jimp from 'jimp';

async function composeImages(): Promise<void> {
  const [baseImage, watermark] = await Promise.all([
    Jimp.read(`${__dirname}/../assets/landscape.jpg`),
    Jimp.read(`${__dirname}/../assets/watermark.png`)
  ]);

  const baseWidth = baseImage.getWidth();
  const baseHeight = baseImage.getHeight();
  const watermarkWidth = watermark.getWidth();
  const watermarkHeight = watermark.getHeight();
  // Log base image dimensions
  console.log('Base image dimensions');
  console.log({
    width: baseWidth,
    height: baseHeight,
    ratio: baseWidth / baseHeight
  });
  // Log watermark dimensions
  console.log('Watermark dimensions');
  console.log({
    width: watermarkWidth,
    height: watermarkHeight,
    ratio: watermarkWidth / watermarkHeight
  });

  const pendingCoords = [];

  for (let i = 0; i < Math.ceil(baseWidth / watermarkWidth); i += 1) {
    for (let j = 0; j < Math.ceil(baseHeight / watermarkHeight); j += 1) {
      pendingCoords.push({
        x: i * watermarkWidth,
        y: j * watermarkHeight,
      });
    }
  }

  recursiveCompose(baseImage, watermark, pendingCoords);
}

function recursiveCompose(image: Jimp, watermark: Jimp, coords: Array<{ x: number, y: number }>, current = 0): void {
  if (current === coords.length) {
    image.write(`${__dirname}/../assets/composed.jpeg`);

    return;
  }

  const { x, y } = coords[current];

  image.composite(watermark, x, y, {
    mode: Jimp.BLEND_SCREEN,
    opacitySource: 1,
    opacityDest: 1,
  }, (err, innerImage) => {
    if (err) {
      console.log(err);
      return;
    }

    recursiveCompose(innerImage, watermark, coords, current + 1);
  })
}

(async () => {
  composeImages();
})();
