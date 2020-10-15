PRINT 'Set Identity Seed for ProjectNumbers'

DBCC CHECKIDENT ([ProjectNumbers], RESEED, 10000) -- TODO: Provide configuration option
