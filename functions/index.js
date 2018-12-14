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

function onAlbumCreated(event) {
  if (!event.before.exists) {
    const parentAlbum = event.after.ref.firestore.doc(`galery/${event.after.get('parentId')}`);
    parentAlbum.get().then(data => {
      parentAlbum.update({ childrens: [{ id: event.after.id, name: event.after.get('name') }, ...data.data().childrens] });
    });
  }
}

exports.newsCounter = functions.firestore.document('news/{id}').onWrite(event => setupCounter(event, 'counts/news'));
exports.eventsCounter = functions.firestore.document('events/{id}').onWrite(event => setupCounter(event, 'counts/events'));
exports.onAlbumCreated = functions.firestore.document('galery/{id}').onWrite(event => onAlbumCreated(event));
