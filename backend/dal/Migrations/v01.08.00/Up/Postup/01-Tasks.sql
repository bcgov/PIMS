PRINT 'Update Tasks'

UPDATE dbo.[Tasks]
SET
  [Description] = 'Triple Bottom Line document emailed to SRES; or Project is in Tier 1.'
WHERE [Id] = 2
