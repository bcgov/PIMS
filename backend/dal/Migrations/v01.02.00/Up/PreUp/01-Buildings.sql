PRINT 'Backup Buildings'

-- Store building values for importing into new migration.
SELECT [Id]
    , [Name]
    , [LocalId]
    , [ParcelId]
INTO #Buildings
FROM dbo.[Buildings]
