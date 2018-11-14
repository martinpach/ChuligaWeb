export interface User {
  firstName: string;
  lastName: string;
}

export interface Item {
  id?: string;
  heading: string;
  description: string;
  picture: ServerImageInfo;
  date: any;
}

export interface NewsItem extends Item {
  shortDescription: string;
}

export interface EventItem extends Item {
  capacity: number;
  attendees: User[];
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
