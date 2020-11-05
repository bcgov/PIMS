PRINT 'Create Spatial Indexes'

DROP INDEX IF EXISTS IX_Parcels_SpatialLocation ON dbo.[Parcels]
DROP INDEX IF EXISTS IX_Buildings_SpatialLocation ON dbo.[Buildings]
