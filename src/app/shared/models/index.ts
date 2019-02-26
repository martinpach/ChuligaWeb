export interface ClientUser {
  id?: string;
  email: string;
  displayName: string;
  picture?: string;
  courses?: string[];
  events?: string[];
}

export interface Item {
  id?: string;
  heading: string;
  description: string;
  shortDescription: string;
  picture: ServerImageInfo;
}

export interface NewsItem extends Item {
  date: any;
}

export interface EventItem extends Item {
  date: any;
  capacity: number;
  category: EventCategory;
  attendees: string[];
}

export enum EventCategory {
  DK = 'DK',
  MONTESSORI = 'M',
  RC = 'RC',
  GENERAL = 'V'
}

export interface Course extends Item {
  capacity: number;
  attendees: string[];
  category: EventCategory;
  deadlineDate: any;
  displayDate?: any;
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
