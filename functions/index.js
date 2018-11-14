const functions = require('firebase-functions');

function setupCounter(event, counterLocation) {
  if (!event.before.exists) {
    return event.after.ref.firestore
      .doc(counterLocation)
      .get()
      .then(counter => counter.ref.update({ count: 1 + counter.get('count') }));
  } else if (!event.after.exists) {
    return event.after.ref.firestore
      .doc(counterLocation)
      .get()
      .then(counter => counter.ref.update({ count: -1 + counter.get('count') }));
  }
}

exports.newsCounter = functions.firestore.document('news/{id}').onWrite(event => setupCounter(event, 'counts/news'));
exports.eventsCounter = functions.firestore.document('events/{id}').onWrite(event => setupCounter(event, 'counts/events'));
