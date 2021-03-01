-- Migration any properties to Disposed Classifications
UPDATE dbo.[Parcels]
SET [ClassificationId] = 4
WHERE [ClassificationId] IN (5, 6)

UPDATE dbo.[Buildings]
SET [ClassificationId] = 4
WHERE [ClassificationId] IN (5, 6)

DELETE FROM dbo.[PropertyClassifications] where Id in (5, 6);
