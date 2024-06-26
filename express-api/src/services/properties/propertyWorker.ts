import { parentPort, workerData } from 'worker_threads';
import propertyServices from './propertiesServices';
import xlsx from 'xlsx';
import { UUID } from 'crypto';
import { AppDataSource } from '@/appDataSource';

const processFile = async (filePath: string, userId: UUID) => {
  await AppDataSource.initialize(); //Since this function is going to be called from a new process, requires a new database connection.
  try {
    parentPort.postMessage('Database connection has been initialized');
    const file = xlsx.readFile(filePath);
    const sheetName = file.SheetNames[0];
    const worksheet = file.Sheets[sheetName];

    await propertyServices.importPropertiesAsJSON(worksheet, userId); // Note that this return still works with finally as long as return is not called from finally block.
  } catch (e) {
    parentPort.postMessage('Aborting file upload: ' + e.message);
  } finally {
    await AppDataSource.destroy(); //Not sure whether this is necessary but seems like the safe thing to do.
  }
};

processFile(workerData.filePath, workerData.userId)
  .then(() => {
    parentPort.postMessage('File processing succeeded.');
  })
  .catch((err) => {
    parentPort.postMessage('Worked thread failed with message: ' + err.message);
  });
