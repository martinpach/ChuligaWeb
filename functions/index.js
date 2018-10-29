const functions = require('firebase-functions');

exports.newsCounter = functions.firestore.document('news/{id}').onWrite(event => {
  if (!event.before.exists) {
    return event.after.ref.firestore
      .doc('counts/news')
      .get()
      .then(counter => counter.ref.update({ count: 1 + counter.get('count') }));
  } else if (!event.after.exists) {
    return event.after.ref.firestore
      .doc('counts/news')
      .get()
      .then(counter => counter.ref.update({ count: -1 + counter.get('count') }));
  }
});
