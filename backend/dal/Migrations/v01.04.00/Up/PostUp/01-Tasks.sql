PRINT 'Delete Tasks'

-- Delete 'Appraisal completed'
-- Delete 'Bid Rigging, Collusion and Bias'
DELETE FROM dbo.[Tasks]
WHERE [Id] IN (8, 16, 17)
