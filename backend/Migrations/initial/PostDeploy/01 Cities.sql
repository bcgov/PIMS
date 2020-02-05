PRINT 'Adding Cities'

INSERT INTO dbo.[Cities] (
    [Name]
    , [Code]
    , [IsDisabled]
) VALUES (
    'Vancouver'
    , 'VAN'
    , 0
), (
    'Victoria'
    , 'VIC'
    , 0
)
