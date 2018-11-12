export interface NewsItem {
  heading: string;
  shortDescription: string;
  description: string;
  picture: ServerImageInfo;
  date: any;
}

export interface ServerFileInfo {
  name: string;
  url: string;
}

export interface ImageInfo {
  fromServer?: ServerImageInfo;
  currentUpload?: LocalImageInfo;
}

export interface ServerImageInfo extends ServerFileInfo {}

export interface LocalImageInfo {
  file: File;
  base64: any;
}
