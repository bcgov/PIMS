PRINT 'Updating NotificationTemplates'

-- to fix the single case for template 1
UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], '@property.Parcel.Address?.ToString()', '@property.Parcel.Address.Address1.ToString()') 
WHERE Body LIKE '%@property.Parcel.Address?.ToString()%' AND [Id] = 1;

-- to fix all the other instances of the parcel address
UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], '@property.Parcel.Address.ToString()', '@property.Parcel.Address.Address1.ToString()') 
WHERE Body LIKE '%@property.Parcel.Address.ToString()%';

-- to fix all the building address references
UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], '@property.Building.Address', '@property.Building.Address.Address1') 
WHERE Body LIKE '%@property.Building.Address%';