class ImageLoader {
  constructor() {
    this.loader = new PIXI.Loader();
  }

  loadImages(callback) {
    const imageFilenames = [
      'base1.png',
      'base10.png',
      'base11.png',
      'base12.png',
      'base13.png',
      'base14.png',
      'base15.png',
      'base16.png',
      'base17.png',
      'base18.png',
      'base19.png',
      'base2.png',
      'base20.png',
      'base21.png',
      'base22.png',
      'base23.png',
      'base24.png',
      'base25.png',
      'base26.png',
      'base27.png',
      'base28.png',
      'base3.png',
      'base4.png',
      'base5.png',
      'base6.png',
      'base7.png',
      'base8.png',
      'base9.png',
      'bomb.png',
      'bomber.png',
      'bomberSheet-37x380x4.png',
      'cloud1.png',
      'prop1.png',
      'prop2.png',
      'prop3.png',
      'propeller-37x5x4.png',
      'propeller1.png',
      'propeller2.png',
      'propeller3.png',
      'roof1.png',
      'roof10.png',
      'roof11.png',
      'roof12.png',
      'roof13.png',
      'roof14.png',
      'roof15.png',
      'roof16.png',
      'roof17.png',
      'roof18.png',
      'roof19.png',
      'roof2.png',
      'roof20.png',
      'roof21.png',
      'roof22.png',
      'roof3.png',
      'roof4.png',
      'roof5.png',
      'roof6.png',
      'roof7.png',
      'roof8.png',
      'roof9.png',
      'storey1.png',
      'storey10.png',
      'storey11.png',
      'storey12.png',
      'storey13.png',
      'storey14.png',
      'storey15.png',
      'storey16.png',
      'storey17.png',
      'storey18.png',
      'storey19.png',
      'storey2.png',
      'storey20.png',
      'storey3.png',
      'storey4.png',
      'storey5.png',
      'storey6.png',
      'storey7.png',
      'storey8.png',
      'storey9.png',
      'type1-base.png',
      'waveSheet-7x9x4.png',
      'waveSheet.png'
    ];

    imageFilenames.forEach((filename) => {
      this.loader.add(filename, `images/${filename}`);
    });

    this.loader.load(() => {
      if (callback) {
        callback();
      }
    });
  }
}

export default ImageLoader;
