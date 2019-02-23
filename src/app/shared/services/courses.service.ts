import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Course } from '../models';
import { map, pluck } from 'rxjs/operators';
import { mapToRenderObject } from '../utils/items-util';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  basePath = '/courses';
  constructor(private db: AngularFirestore) {}

  getCourses(queryFn: QueryFn): Observable<Course[]> {
    return this.db
      .collection<Course>(this.basePath, queryFn)
      .snapshotChanges()
      .pipe(map(data => mapToRenderObject(data)));
  }

  getCourse(id: string): Observable<Course> {
    return this.db
      .doc<Course>(`${this.basePath}/${id}`)
      .valueChanges()
      .pipe(
        map(item => {
          if (!item) return item;
          const deadlineDate = item.deadlineDate ? item.deadlineDate.toDate() : item.deadlineDate;
          return { ...item, deadlineDate };
        })
      );
  }

  getCoursesCount(): Observable<number> {
    return this.db
      .doc(`/counts${this.basePath}`)
      .valueChanges()
      .pipe(pluck('count'));
  }

  addCourse(course: Course) {
    return this.db.collection(this.basePath).add(course);
  }

  updateCourse(id: string, course: Course) {
    return this.db.doc(`${this.basePath}/${id}`).update(course);
  }

  deleteCourse(id: string) {
    return this.db.doc(`${this.basePath}/${id}`).delete();
  }

  deleteCourses(ids: string[]) {
    const batch = this.db.firestore.batch();
    ids.forEach(id => batch.delete(this.db.firestore.doc(`${this.basePath}/${id}`)));
    return batch.commit();
  }
}
