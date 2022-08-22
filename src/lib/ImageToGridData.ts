import Element from '../components/Element';

export type ColourSampler = (imageData: ImageData) => string;
type TargetDimensions = {
  height: number;
  width: number;
};

export class ImageToGridData extends Element {
  static async processFile(
    file: File,
    targetDimensions: TargetDimensions,
    colourSampler: ColourSampler
  ): Promise<string[]> {
    return new Promise((resolve) => {
      const fileReader = new FileReader();

      fileReader.addEventListener('load', () => resolve(fileReader.result));

      fileReader.readAsDataURL(file);
    })
      .then(
        (imageDataUrl: string) =>
          new Promise((resolve, reject) => {
            const image = new Image();

            image.src =
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAAA1BMVEUAAACnej3aAAAAAXRSTlPHReaPdQAAAApJREFUCNdjwAsAAB4AAdpxxYoAAAAASUVORK5CYII=';

            image.addEventListener('error', (event) => reject(event.error));
            image.addEventListener('load', () => resolve(image));

            image.src = imageDataUrl;
          })
      )
      .then((image: CanvasImageSource) =>
        this.processImageData(image, targetDimensions, colourSampler)
      );
  }

  static processImageData(
    imageCanvas: CanvasImageSource,
    { height: targetHeight, width: targetWidth }: TargetDimensions,
    colourSampler: ColourSampler
  ): string[] {
    const height = imageCanvas.height as number,
      width = imageCanvas.width as number,
      squareSize = Math.floor(
        Math.min(height / targetHeight, width / targetWidth)
      ),
      scaledHeight = squareSize * targetHeight,
      scaledWidth = squareSize * targetWidth,
      oddOffsetX = (scaledWidth - squareSize) / width / 2,
      offsetX = (width - scaledWidth) / 2,
      offsetY = (height - scaledHeight) / 2,
      canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      squareCanvas = document.createElement('canvas'),
      squareContext = squareCanvas.getContext('2d'),
      colourData = [];

    squareCanvas.height = squareSize;
    squareCanvas.width = squareSize;
    canvas.height = scaledHeight;
    canvas.width = scaledWidth;

    context.drawImage(imageCanvas, offsetX, offsetY, scaledWidth, scaledHeight);

    for (let y = 0; y < targetHeight; y++) {
      const rowWidth = targetWidth - (y % 2),
        rowOffsetX = (y % 2) * oddOffsetX;

      for (let x = 0; x < rowWidth; x++) {
        const canvasX = offsetX + rowOffsetX + x * squareSize,
          canvasY = offsetY + y * squareSize;

        squareContext.clearRect(0, 0, squareSize, squareSize);
        squareContext.drawImage(
          canvas,
          canvasX,
          canvasY,
          squareSize,
          squareSize,
          0,
          0,
          squareSize,
          squareSize
        );

        const debugContainer =
          document.querySelector('.debug-container') ??
          (() => {
            const debugContainer = document.createElement('div');

            debugContainer.classList.add('debug-container');

            document.body.append(debugContainer);

            return debugContainer;
          })();

        const squareImage = new Image();

        squareImage.src = squareCanvas.toDataURL('image/png');
        debugContainer.append(squareImage);

        const colour = colourSampler(
          squareContext.getImageData(0, 0, squareSize, squareSize)
        );
        squareImage.setAttribute('data-colour', colour);

        colourData.push(colour);
      }
    }

    return colourData;
  }
}

export default ImageToGridData;
