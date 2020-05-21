PRINT 'Adding ProjectStatus'

INSERT INTO dbo.[ProjectStatus] (
    [Id]
    , [SortOrder]
    , [Name]
    , [IsDisabled]
    , [Description]
) VALUES (
    0
    , 0
    , 'Draft'
    , 0
    , 'A new draft project that is not ready to submit to apply to be added to the Surplus Property Program.'
), (
    1
    , 1
    , 'Properties Selected'
    , 0
    , 'Properties have been added to the project.'
), (
    2
    , 2
    , 'Financials Updated'
    , 0
    , 'Property financial information has been updated for the current fiscal year.'
), (
    3
    , 3
    , 'Documents Emailed'
    , 0
    , 'Documents have been emailed (Surplus Declaration, Readiness Checklist, Triple Bottom Line).'
), (
    4
    , 4
    , 'Ready for Submit'
    , 0
    , 'The project is ready to be submitted for review.'
), (
    5
    , 5
    , 'Submitted'
    , 0
    , 'The project has been submitted for review to be added to the Surplus Property Program.'
), (
    6
    , 6
    , 'Financials Reviewed'
    , 0
    , 'Property financial information has been reviewed.'
), (
    7
    , 7
    , 'Documents Reviewed'
    , 0
    , 'Documents have been reviewed (Surplus Declaration, Readiness Checklist, Triple Bottom Line).'
), (
    8
    , 8
    , 'First Nation Consultation'
    , 0
    , 'First Nation Consultation has been completed.'
), (
    9
    , 9
    , 'Approved'
    , 0
    , 'The project has been approved to be added to the Surplus Property Program.'
), (
    10
    , 10
    , 'Denied'
    , 0
    , 'The project has been denied to be added to the Surplus Property Program.'
)
