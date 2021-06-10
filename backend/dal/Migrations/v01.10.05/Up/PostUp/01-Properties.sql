PRINT 'Updating Disposed Property Agencies'

----------------------------------------------------------------
-- Summary
-- Previously disposed property would set the AgencyId=null.
-- Going forward they will retain their original agency.
-- Reset disposed properties to their project agency.
-- Note it is possible that the property could have originally
-- been owned by a sub-agency of the project.
----------------------------------------------------------------

-- Update the parcel to the project agency
-- where it was disposed and is currently null.
UPDATE p
SET p.AgencyId = pr.AgencyId
FROM dbo.Parcels p
JOIN dbo.ProjectProperties pp ON p.Id = pp.ParcelId
JOIN dbo.Projects pr ON pp.ProjectId = pr.Id
WHERE p.ClassificationId = 4 -- Disposed
    AND p.AgencyId IS NULL

-- Update the building to the project agency
-- where it was disposed and is currently null.
UPDATE b
SET b.AgencyId = pr.AgencyId
FROM dbo.Buildings b
JOIN dbo.ProjectProperties pp ON b.Id = pp.BuildingId
JOIN dbo.Projects pr ON pp.ProjectId = pr.Id
WHERE b.ClassificationId = 4 -- Disposed
    AND b.AgencyId IS NULL
