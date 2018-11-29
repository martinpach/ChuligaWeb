import { DocumentChangeAction } from '@angular/fire/firestore';
import { formatDate } from '@angular/common';

export function mapToRenderObject<T>(actions: DocumentChangeAction<any>[]): T[] {
  return actions.map(a => {
    const data = a.payload.doc.data();
    if (!data) return data;
    const id = a.payload.doc.id;
    return { ...data, id };
  });
}

export const dateRenderer = (dateFormat: string) => ({ value }: any) => formatDate(value.toDate(), dateFormat, 'en');
export const dateComparator = (date1: any, date2: any) => date1.toDate().getTime() - date2.toDate().getTime();
