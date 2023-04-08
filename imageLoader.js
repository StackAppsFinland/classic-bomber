const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Image not found: ${src}`));
  });
};

class ImageLoader {
  constructor(callback) {
    this.imageFilenames = [
      'base.png:28',
      'bomb.png',
      'bomber.png',
      'bomberSheet-37x380x4.png',
      'cloud.png:67',
      'prop.png:3',
      'propeller-37x5x4.png',
      'propeller.png:3',
      'roof.png:22',
      'storey.png:20',
      'type1-base.png',
      'waveSheet-7x9x4.png',
      'waveSheet.png'
    ];
    this.textures = new Map();
    this.matchingTexturesCache = new Map();
    this.loadTextures(callback);
  }

  getImage(id) {
    return this.textures.get(id);
  }

  getRandomImage(prefix) {
    if (!this.matchingTexturesCache.has(prefix)) {
      const matchingTextures = Array.from(this.textures.keys()).filter(key => key.startsWith(prefix));
      this.matchingTexturesCache.set(prefix, matchingTextures);
    }

    const cachedMatchingTextures = this.matchingTexturesCache.get(prefix);

    if (cachedMatchingTextures.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * cachedMatchingTextures.length);
    const randomId = cachedMatchingTextures[randomIndex];
    return this.textures.get(randomId);
  }

  parseFilenames() {
    const expandedFilenames = [];

    this.imageFilenames.forEach(filename => {
      const [baseName, range] = filename.split(':');

      if (range) {
        const end = parseInt(range, 10);
        for (let i = 1; i <= end; i++) {
          expandedFilenames.push(`${baseName.slice(0, -4)}${i}.png`);
        }
      } else {
        expandedFilenames.push(filename);
      }
    });

    return expandedFilenames;
  }

  loadTextures(callback) {
    const expandedFilenames = this.parseFilenames();
    const loadPromises = expandedFilenames.map(filename => {
      const id = filename.split('.')[0];
      const src = `images/${filename}`;
      return loadImage(src)
          .then(image => {
            const texture = PIXI.Texture.from(image);
            this.textures.set(id, texture);
          })
          .catch((ex) => {
            console.log(ex);
            console.error(`Image not found: ${src}`);
          });
    });

    Promise.all(loadPromises).then(callback);
  }
}

export default ImageLoader;