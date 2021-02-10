-- Update addresses table first to correct locations which contain District of, City of, or The Corporation of the District of
PRINT 'Updating Addresses table'

UPDATE dbo.[Addresses]
SET AdministrativeArea = REPLACE(AdministrativeArea, 'District of ', '')
where AdministrativeArea like 'District of %';

UPDATE dbo.[Addresses]
SET AdministrativeArea = REPLACE(AdministrativeArea, 'City of ', '')
where AdministrativeArea like 'City of %';

UPDATE dbo.[Addresses]
SET AdministrativeArea = REPLACE(AdministrativeArea, 'Town of ', '')
where AdministrativeArea like 'Town of %';

UPDATE dbo.[Addresses]
SET AdministrativeArea = REPLACE(AdministrativeArea, 'Village of ', '')
where AdministrativeArea like 'Village of %';

UPDATE dbo.[Addresses]
SET AdministrativeArea = REPLACE(AdministrativeArea, 'The Corporation of the District of ', '')
where AdministrativeArea like 'The Corporation of the District of %';

-- Do the "one off" updates to simplify the name where there is only once instance of each
UPDATE [dbo].[Addresses]
SET AdministrativeArea = 'Spallumcheen' 
WHERE AdministrativeArea = 'The Corporation of the Township of Spallumcheen';

PRINT 'Updating AdministrativeAreas table'

-- Then update AdministrativeAreas table to fix the spelling of the Abbreviation field in order to get correct join on the Name field when doing a batch update later on
UPDATE [dbo].[AdministrativeAreas]
SET Abbreviation = 'Valemount' 
WHERE Name = 'Village of Valemount' AND Abbreviation = 'Valemont';

UPDATE [dbo].[AdministrativeAreas]
SET Abbreviation = 'Fort St. John' 
WHERE Name = 'City of Fort St John' AND Abbreviation = 'Fort St John';

UPDATE [dbo].[AdministrativeAreas]
SET Abbreviation = 'Fort St. James' 
WHERE Name = 'District of Fort St James' AND Abbreviation = 'Fort St James';

UPDATE [dbo].[AdministrativeAreas]
SET Abbreviation = 'North Vancouver' 
WHERE Name = 'City of North Vancouver' AND Abbreviation = 'North Vancouver - City';

UPDATE [dbo].[AdministrativeAreas]
SET Abbreviation = 'Langley' 
WHERE Name = 'City of Langley' AND Abbreviation = 'Langley - City';

-- Do the "one off" updates to simplify the name where there is only once instance of each
UPDATE [dbo].[AdministrativeAreas]
SET Name = 'Spallumcheen' 
WHERE Name = 'The Corporation of the Township of Spallumcheen';

UPDATE [dbo].[AdministrativeAreas]
SET Name = 'Lake Country' 
WHERE Name = 'District Of Lake Country';

UPDATE [dbo].[AdministrativeAreas]
SET Name = 'Port Edward' 
WHERE Name = 'District of Port Edward';

UPDATE [dbo].[AdministrativeAreas]
SET Name = 'Highlands' 
WHERE Name = 'District of Highlands';

UPDATE [dbo].[AdministrativeAreas]
SET Name = 'Belcarra' 
WHERE Name = 'Village of Belcarra';

UPDATE [dbo].[AdministrativeAreas]
SET Name = 'Slocan' 
WHERE Name = 'Village of Slocan';

UPDATE [dbo].[AdministrativeAreas]
SET Name = 'Anmore' 
WHERE Name = 'Village of Anmore';

UPDATE [dbo].[AdministrativeAreas]
SET Name = 'Warfield' 
WHERE Name = 'Village of Warfield';

UPDATE [dbo].[AdministrativeAreas]
SET Name = 'Canal Flats' 
WHERE Name = 'Village of Canal Flats';

UPDATE [dbo].[AdministrativeAreas]
SET Name = 'Radium Hot Springs' 
WHERE Name = 'Village of Radium Hot Springs';

UPDATE [dbo].[AdministrativeAreas]
SET Name = 'North Cowichan' 
WHERE Name = 'The Corporation of the District of North Cowichan';

UPDATE [dbo].[AdministrativeAreas]
SET Name = 'Coldstream' 
WHERE Name = 'The Corporation of the District of Coldstream';

UPDATE [dbo].[AdministrativeAreas]
SET Name = 'Lake Cowichan' 
WHERE Name = 'Town of Lake Cowichan';

UPDATE [dbo].[AdministrativeAreas]
SET Name = 'Kent' 
WHERE Name = 'District of Kent';

-- copy the GroupName from the AdministrativeArea that has a Name = Abbreviation
UPDATE t1
SET t1.GroupName = t2.GroupName
FROM AdministrativeAreas t1
JOIN (SELECT * from AdministrativeAreas
		WHERE isnumeric(Abbreviation) = 0
		AND Abbreviation <> Name
		AND Abbreviation in (
			SELECT b.Abbreviation 
			FROM dbo.AdministrativeAreas a
			INNER JOIN AdministrativeAreas b
			ON a.Name = B.Abbreviation
		)
	) t2
ON t1.Name = t2.Abbreviation;


PRINT 'Deleting from AdministrativeAreas table'
-- Then delete the "duplicate" locations which are not handled by the "bulk" delete operation 
DELETE FROM dbo.[AdministrativeAreas]
WHERE Name IN ('Bowen Island Municipality', 'Resort Municipality of Whistler', 'District Municipality of West Vancouver', 'The Corporation of the Village of Hazelton', 'Salmo Creston Summit', 'Lower Nicola Boston Bar');

DELETE FROM dbo.[AdministrativeAreas]
WHERE Name LIKE ('District of %');

DELETE FROM dbo.[AdministrativeAreas]
WHERE Name LIKE '%Corporation%';

DELETE FROM dbo.[AdministrativeAreas]
WHERE Name LIKE ('City of %');

DELETE FROM dbo.[AdministrativeAreas]
WHERE Name LIKE ('Village of %');

DELETE FROM dbo.[AdministrativeAreas]
WHERE Name LIKE ('Town of %'); 

	