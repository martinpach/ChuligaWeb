import * as functions from 'firebase-functions';

function setupCounter(event: any, counterLocation: string) {
  if (!event.before.exists) {
    return event.after.ref.firestore
      .doc(counterLocation)
      .get()
      .then((counter: any) => counter.ref.update({ count: 1 + counter.get('count') }));
  } else if (!event.after.exists) {
    return event.after.ref.firestore
      .doc(counterLocation)
      .get()
      .then((counter: any) => counter.ref.update({ count: -1 + counter.get('count') }));
  }
}

export const newsCounter = functions.firestore.document('news/{id}').onWrite(event => setupCounter(event, 'counts/news'));
export const eventsCounter = functions.firestore.document('events/{id}').onWrite(event => setupCounter(event, 'counts/events'));
export const coursesCounter = functions.firestore.document('courses/{id}').onWrite(event => setupCounter(event, 'counts/courses'));
