import { Injectable } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import loadImage from 'blueimp-load-image';

@Injectable({
  providedIn: 'root'
})
export class ImageManipulationService {
  constructor(private imgMaxService: Ng2ImgMaxService) {}

  resizeImage(image: File, width: number, height: number): Promise<Blob> {
    return new Promise(resolve => this.imgMaxService.resizeImage(image, width, height).subscribe(resized => resolve(resized)));
  }

  compressImage(image: File): Promise<Blob> {
    return new Promise(resolve => this.imgMaxService.compressImage(image, 3).subscribe(resized => resolve(resized)));
  }

  async resizeAndCompressImage(image: File, width: number, height: number): Promise<File> {
    const resizedBlob = await this.resizeImage(image, width, height);
    const compressedBlob = await this.compressImage(new File([resizedBlob], image.name, { type: image.type }));
    return new File([compressedBlob], image.name, { type: image.type });
  }

  async compressAndCreateThumbnail(
    image: File,
    options: { fixRotation?: boolean; size?: { width: number; height: number } } = {}
  ): Promise<{ image: File; thumbnail: File }> {
    let processedImage = image;
    if (options.fixRotation) {
      [processedImage] = await this.fixImageRotation([image]);
    }

    if (options.size) {
      const resizedBlob = await this.resizeImage(processedImage, options.size.width, options.size.height);
      processedImage = new File([resizedBlob], image.name, { type: image.type });
    } else {
      const compressedBlob = await this.compressImage(processedImage);
      processedImage = new File([compressedBlob], image.name, { type: image.type });
    }

    const thumbnailBlob = await this.resizeImage(processedImage, 250, 250);
    const thumbnailFile = new File([thumbnailBlob], '@thumbnail_' + image.name, { type: image.type });
    return { image: processedImage, thumbnail: thumbnailFile };
  }

  async fixImageRotation(arrayOfFiles: File[]): Promise<File[]> {
    for (let i = 0; i < arrayOfFiles.length; i++) {
      const { name } = arrayOfFiles[i];
      const { type } = arrayOfFiles[i];
      const blob = await this.fixRotationOfFile(arrayOfFiles[i], type);
      arrayOfFiles[i] = new File([blob], name, { type });
    }
    return arrayOfFiles;
  }

  private fixRotationOfFile(file: any, type = 'image/jpeg'): Promise<Blob> {
    return new Promise(resolve => {
      loadImage(
        file,
        (img: any) => {
          img.toBlob((blob: any) => {
            resolve(blob);
          }, type);
        },
        { orientation: true }
      );
    });
  }
}
