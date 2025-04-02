import { AppDataSource } from '@/appDataSource';

/**
 * Clears idle database connections by identifying and terminating inactive connections
 * to the current database that match specific criteria.
 *
 * The function uses a PostgreSQL query to:
 * - Exclude the current backend process.
 * - Exclude connections from known applications (e.g., psql, pgAdmin).
 * - Include only connections to the same database and user as the current process.
 * - Include only inactive connections.
 *
 * This helps free up resources by terminating unnecessary idle connections.
 *
 * @async
 * @function clearIdleConnections
 * @returns {Promise<void>} Resolves when idle connections are cleared.
 * @throws {Error} If the query execution fails.
 */
const clearIdleConnections = async () => {
  const db = AppDataSource.createQueryRunner();
  await db.query(`
  WITH inactive_connections AS (
    SELECT
        pid,
        rank() over (partition by client_addr order by backend_start ASC) as rank
    FROM 
        pg_stat_activity
    WHERE
        -- Exclude the thread owned connection (ie no auto-kill)
        pid <> pg_backend_pid( )
    AND
        -- Exclude known applications connections
        application_name !~ '(?:psql)|(?:pgAdmin.+)'
    AND
        -- Include connections to the same database the thread is connected to
        datname = current_database() 
    AND
        -- Include connections using the same thread username connection
        usename = current_user 
    AND
        -- Include inactive connections only
        state in ('idle', 'idle in transaction', 'idle in transaction (aborted)', 'disabled') 
    AND
        -- Include old connections (found with the state_change field)
        current_timestamp - state_change > interval '5 minutes' 
  )
  SELECT
      pg_terminate_backend(pid)
  FROM
      inactive_connections 
  WHERE
      rank > 1 -- Leave one connection for each application connected to the database
    `);
  await db.release();
};
export default clearIdleConnections;
