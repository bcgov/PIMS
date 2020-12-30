PRINT 'Update Tasks'

UPDATE dbo.[Tasks]
SET
    [Description] = 'ADM has approved the request for exemption'
WHERE [Id] = 13
