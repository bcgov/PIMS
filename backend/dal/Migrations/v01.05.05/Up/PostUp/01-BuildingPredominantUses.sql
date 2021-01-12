PRINT 'Update Building Predominate Uses'

--Remove Zebra Feeding Station
DELETE FROM dbo.[BuildingPredominateUses]
    WHERE [Id] = 17;