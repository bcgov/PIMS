PRINT 'Update Building Predominate Uses'

-- Change properties associated with Zebra Feeding Station to default 1.#
UPDATE dbo.[Buildings]
SET [BuildingPredominateUseId] = 1
WHERE [BuildingPredominateUseId] = 17

--Remove Zebra Feeding Station
DELETE FROM dbo.[BuildingPredominateUses]
    WHERE [Id] = 17;
