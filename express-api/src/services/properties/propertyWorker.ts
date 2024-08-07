import { parentPort, workerData } from 'worker_threads';
import propertyServices from './propertiesServices';

propertyServices
  .processFile(workerData.filePath, workerData.resultRowId, workerData.user, workerData.roles)
  .then((results) => {
    parentPort.postMessage('File processing succeeded.');
    parentPort.postMessage(
      `Upload results: ${results.filter((x) => x.action === 'inserted').length} inserted, ${results.filter((x) => x.action === 'updated').length} updated, ${results.filter((x) => x.action === 'error').length} errored, ${results.filter((x) => x.action === 'ignored').length} ignored`,
    );
  })
  .catch((err) => {
    parentPort.postMessage('Worked thread failed with message: ' + err.message);
  });
