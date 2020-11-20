PRINT 'Update ProjectSnapshots'

-- Update the project snapshot metadata.
UPDATE p SET
    p.[SalesCost] = b.[SalesCost]
    , p.[NetProceeds] = b.[NetProceeds]
    , p.[ProgramCost] = b.[ProgramCost]
    , p.[GainLoss] = b.[GainLoss]
    , p.[OcgFinancialStatement] = b.[OcgFinancialStatement]
    , p.[InterestComponent] = b.[InterestComponent]
    , p.[SaleWithLeaseInPlace] = ISNULL(b.[SaleWithLeaseInPlace], 0)
FROM dbo.[ProjectSnapshots] p
INNER JOIN #ProjectSnapshots b ON b.[Id] = p.[Id]

DROP TABLE #ProjectSnapshots
