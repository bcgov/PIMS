PRINT 'Adding Tasks'

SET IDENTITY_INSERT dbo.[Tasks] ON

INSERT INTO dbo.[Tasks] (
    [Id]
    , [TaskType]
    , [Name]
    , [IsDisabled]
    , [Description]
    , [IsOptional]
    , [SortOrder]
) VALUES (
    1
    , 1
    , 'Surplus Declaration & Readiness Checklist completed and sent'
    , 0
    , 'Surplus Declaration & Readiness Checklist document emailed to SRES.'
    , 0
    , 1
), (
    2
    , 1
    , 'Triple Bottom Line completed and sent'
    , 0
    , 'Triple Bottom Line document emailed to SRES.'
    , 0
    , 2
)

SET IDENTITY_INSERT dbo.[Tasks] OFF
