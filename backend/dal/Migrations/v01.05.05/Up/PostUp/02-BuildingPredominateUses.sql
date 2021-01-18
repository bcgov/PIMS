PRINT 'Add Marina to Building Predominate Uses'

--Check in case of rollback/rollforward
IF NOT EXISTS (SELECT * FROM dbo.[BuildingPredominateUses] WHERE [Name] = 'Marina')
--Add Marina
    BEGIN
        INSERT INTO dbo.[BuildingPredominateUses] (
            [Id]
            , [Name]
            , [IsDisabled]
        ) VALUES (
            17
            , 'Marina'
            , 0
        )
    END
