PRINT 'Updating NotificationTemplates'

-- to fix the single case for template 1
UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], '@property.Parcel.Address?.ToString()', '@property.Parcel.Address.ToString()') 
WHERE Body LIKE '%@property.Parcel.Address?.ToString()%' AND [Id] = 1;

-- to fix all the building address references
UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], '@property.Building.Address<br>', '@property.Building.Address.ToString()<br>') 
WHERE Body LIKE '%@property.Building.Address<br>%';