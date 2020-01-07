SELECT *
FROM pg_catalog.pg_tables
WHERE schemaname != 'pg_catalog'
    AND schemaname != 'information_schema';
