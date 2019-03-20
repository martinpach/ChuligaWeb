import loadImage from 'blueimp-load-image';

function fixRotationOfFile(file: any) {
  return new Promise(resolve => {
    loadImage(
      file,
      (img: any) => {
        img.toBlob((blob: any) => {
          resolve(blob);
        }, 'image/jpeg');
      },
      { orientation: true }
    );
  });
}

export const addAttributeToIframe = (html: string, attribute: string): string => {
  const iframePosition = html.indexOf('iframe');
  if (iframePosition < 0) return html;
  const position = iframePosition + 6;

  return [html.slice(0, position), attribute, html.slice(position)].join('');
};

export const fixImageRotation = async (arrayOfFiles: any[]) => {
  for (let i = 0; i < arrayOfFiles.length; i++) {
    arrayOfFiles[i] = await fixRotationOfFile(arrayOfFiles[i]);
  }
  return arrayOfFiles;
};
