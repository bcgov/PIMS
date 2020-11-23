PRINT 'Backup Project Snapshots'

-- Create temporary table to store the snapshot values
SELECT
    p.[Id]
    , '{ "SalesCost":' + CAST(p.[SalesCost] AS NVARCHAR) + '
    , "NetProceeds":' + CAST(p.[NetProceeds] AS NVARCHAR) + '
    , "ProgramCost":' + CAST(p.[ProgramCost] AS NVARCHAR) + '
    , "GainLoss":' + CAST(p.[GainLoss] AS NVARCHAR) + '
    , "OcgFinancialStatement":' + CAST(p.[OcgFinancialStatement] AS NVARCHAR) + '
    , "InterestComponent":' + CAST(p.[InterestComponent] AS NVARCHAR) + '
    , "SaleWithLeaseInPlace":' + (CASE WHEN p.[SaleWithLeaseInPlace] = 1 THEN 'true' ELSE 'false' END) + ' }' AS [Metadata]
INTO #ProjectSnapshots
FROM dbo.[ProjectSnapshots] p
