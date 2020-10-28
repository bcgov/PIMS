PRINT 'Create Spatial Indexes'

CREATE SPATIAL INDEX IX_Parcels_SpatialLocation ON Parcels(Location) using geography_auto_grid
CREATE SPATIAL INDEX IX_Buildings_SpatialLocation ON Buildings(Location) using geography_auto_grid
