export interface User {
  firstName: string;
  lastName: string;
}

export interface Item {
  id?: string;
  heading: string;
  description: string;
  picture: ServerImageInfo;
}

export interface NewsItem extends Item {
  date: any;
  shortDescription: string;
}

export interface EventItem extends Item {
  date: any;
  capacity: number;
  category: EventCategory;
  attendees: User[];
}

export enum EventCategory {
  DK = 'DK',
  MONTESSORI = 'M',
  RC = 'RC',
  GENERAL = 'V'
}

export interface Course extends Item {
  capacity: number;
  attendees: User[];
  deadlineDate: any;
}

export interface ServiceItem {
  id?: string;
  name: string;
  description: string;
  picture: ServerImageInfo;
  category: ServiceCategory;
}

export enum ServiceCategory {
  S = 'školy',
  P = 'verejnosť',
  C = 'firmy'
}

export interface Contact {
  id?: string;
  firstName: string;
  lastName: string;
  description: string;
  phone: string;
  email: string;
  picture: ServerImageInfo;
}

export interface OthersItem {
  id?: string;
  shortDescription?: string;
  description: string;
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

export interface GalleryAlbum {
  id?: string;
  parentId?: string;
  name: string;
  childrens: string[];
  pictures: string[];
}
