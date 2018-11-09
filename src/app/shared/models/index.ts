export interface NewsItem {
  heading: string;
  shortDescription: string;
  description: string;
  picture: ImageInfo;
  date: any;
}

export class Upload {
  file: File;
  progress: number;

  constructor(file: File) {
    this.file = file;
  }
}

export interface FileInfo {
  name: string;
  url: string;
}

export interface ImageInfo extends FileInfo {}
