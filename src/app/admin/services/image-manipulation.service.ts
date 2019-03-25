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

  async compressAndCreateThumbnail(image: File, fixRotation: boolean = false): Promise<{ image: File; thumbnail: File }> {
    let fixedFile;
    let compressedBlob;
    if (fixRotation) {
      fixedFile = await this.fixImageRotation([image]);
      compressedBlob = await this.compressImage(fixedFile[0]);
    } else {
      compressedBlob = await this.compressImage(image);
    }
    const compressedFile = new File([compressedBlob], image.name, { type: image.type });
    const thumbnailBlob = await this.resizeImage(compressedFile, 300, 300);
    const thumbnailFile = new File([thumbnailBlob], '@thumbnail_' + image.name, { type: image.type });
    return { image: compressedFile, thumbnail: thumbnailFile };
  }

  async fixImageRotation(arrayOfFiles: any[]): Promise<any[]> {
    for (let i = 0; i < arrayOfFiles.length; i++) {
      const { name } = arrayOfFiles[i];
      const { type } = arrayOfFiles[i];
      arrayOfFiles[i] = await this.fixRotationOfFile(arrayOfFiles[i], type);
      arrayOfFiles[i] = new File([arrayOfFiles[i]], name, { type });
    }
    return arrayOfFiles;
  }

  private fixRotationOfFile(file: any, type = 'image/jpeg') {
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
