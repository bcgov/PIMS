PRINT 'Backup Project Snapshots'

-- Create temporary table to store the snapshot values
SELECT
    p.[Id]
    , (SELECT [SalesCost] FROM OPENJSON(p.[Metadata]) WITH ([SalesCost] MONEY '$.SalesCost')) AS [SalesCost]
    , (SELECT [NetProceeds] FROM OPENJSON(p.[Metadata]) WITH ([NetProceeds] MONEY '$.NetProceeds')) AS [NetProceeds]
    , (SELECT [ProgramCost] FROM OPENJSON(p.[Metadata]) WITH ([ProgramCost] MONEY '$.ProgramCost')) AS [ProgramCost]
    , (SELECT [GainLoss] FROM OPENJSON(p.[Metadata]) WITH ([GainLoss] MONEY '$.GainLoss')) AS [GainLoss]
    , (SELECT [OcgFinancialStatement] FROM OPENJSON(p.[Metadata]) WITH ([OcgFinancialStatement] MONEY '$.OcgFinancialStatement')) AS [OcgFinancialStatement]
    , (SELECT [InterestComponent] FROM OPENJSON(p.[Metadata]) WITH ([InterestComponent] MONEY '$.InterestComponent')) AS [InterestComponent]
    , (SELECT ISNULL([SaleWithLeaseInPlace], 0) FROM OPENJSON(p.[Metadata]) WITH ([SaleWithLeaseInPlace] BIT '$.SaleWithLeaseInPlace')) AS [SaleWithLeaseInPlace]
INTO #ProjectSnapshots
FROM dbo.[ProjectSnapshots] p
