PRINT 'Backup Cities'

-- Create temporary table to store the City values.
-- Remove Windows newline characters.
SELECT c.[Code]
    , REPLACE(REPLACE(c.[Name], CHAR(194), ''), CHAR(160), ' ') AS [Name]
INTO #Cities
FROM dbo.[Cities] c
