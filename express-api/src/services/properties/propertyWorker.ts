import { parentPort, workerData } from 'worker_threads';
import propertyServices from './propertiesServices';
import xlsx from 'xlsx';
import { AppDataSource } from '@/appDataSource';
import { ImportResult } from '@/typeorm/Entities/ImportResult';
import { User } from '@/typeorm/Entities/User';

const processFile = async (filePath: string, fileName: string, user: User, roles: string[]) => {
  await AppDataSource.initialize(); //Since this function is going to be called from a new process, requires a new database connection.
  try {
    parentPort.postMessage('Database connection for worker thread has been initialized');
    const file = xlsx.readFile(filePath); //It's better to do the read here rather than the parent process because any arguments passed to this function are copied rather than referenced.
    const sheetName = file.SheetNames[0];
    const worksheet = file.Sheets[sheetName];
    const resultRow = await AppDataSource.getRepository(ImportResult).save({
      FileName: fileName,
      CompletionPercentage: 0,
      CreatedById: user.Id,
      CreatedOn: new Date(),
    });
    const results = await propertyServices.importPropertiesAsJSON(
      worksheet,
      user,
      roles,
      resultRow.Id,
    );
    await AppDataSource.getRepository(ImportResult).save({
      Id: resultRow.Id,
      CompletionPercentage: 100,
      Results: results,
      UpdatedById: user.Id,
      UpdatedOn: new Date(),
    });
    return results; // Note that this return still works with finally as long as return is not called from finally block.
  } catch (e) {
    parentPort.postMessage('Aborting file upload: ' + e.message);
  } finally {
    await AppDataSource.destroy(); //Not sure whether this is necessary but seems like the safe thing to do.
  }
};

processFile(workerData.filePath, workerData.fileName, workerData.user, workerData.roles)
  .then((results) => {
    parentPort.postMessage('File processing succeeded.');
    parentPort.postMessage(
      `Upload results: ${results.filter((x) => x.action === 'inserted').length} inserted, ${results.filter((x) => x.action === 'updated').length} updated, ${results.filter((x) => x.action === 'error').length} errored, ${results.filter((x) => x.action === 'ignored').length} ignored`,
    );
  })
  .catch((err) => {
    parentPort.postMessage('Worked thread failed with message: ' + err.message);
  });
