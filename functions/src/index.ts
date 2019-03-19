import * as functions from 'firebase-functions';
import { Storage } from '@google-cloud/storage';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs-extra';

const gcs = new Storage({
  projectId: 'haliganda-dev'
});

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

export const newsCounter = functions.firestore.document('news/{id}').onWrite(event => setupCounter(event, 'counts/news'));
export const eventsCounter = functions.firestore.document('events/{id}').onWrite(event => setupCounter(event, 'counts/events'));
export const coursesCounter = functions.firestore.document('courses/{id}').onWrite(event => setupCounter(event, 'counts/courses'));

export const thumbsGenerator = functions.storage.object().onFinalize(async object => {
  const bucket = gcs.bucket(object.bucket);
  const filePath = object.name;
  const fileName = filePath.split('/').pop();
  const bucketDir = dirname(filePath);

  const workingDir = join(tmpdir(), 'thumbs');
  const tmpFilePath = join(workingDir, 'source.png');

  if (fileName.includes('thumb@') || !object.contentType.includes('image')) {
    console.log('exiting function');
    return false;
  }

  // 1. Ensure thumbnail dir exists
  await fs.ensureDir(workingDir);

  // 2. Download Source File
  await bucket.file(filePath).download({
    destination: tmpFilePath
  });

  // 3. Resize the images and define an array of upload promises
  const sizes = [64, 128, 256];

  const uploadPromises = sizes.map(async size => {
    const thumbName = `thumb@${size}_${fileName}`;
    const thumbPath = join(workingDir, thumbName);

    // Resize source image
    await sharp(tmpFilePath)
      .resize(size, size)
      .toFile(thumbPath);

    // Upload to GCS
    return bucket.upload(thumbPath, {
      destination: join(bucketDir, thumbName)
    });
  });

  // 4. Run the upload operations
  await Promise.all(uploadPromises);

  // 5. Cleanup remove the tmp/thumbs from the filesystem
  return fs.remove(workingDir);
});
