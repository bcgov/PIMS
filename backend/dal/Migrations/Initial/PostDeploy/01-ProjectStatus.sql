PRINT 'Adding ProjectStatus'

INSERT INTO dbo.[ProjectStatus] (
    [Id]
    , [SortOrder]
    , [Name]
    , [IsDisabled]
    , [Description]
    , [Route]
    , [Workflow]
) VALUES (
    0
    , 0
    , 'Draft'
    , 0
    , 'A new draft project that is not ready to submit to apply to be added to the Surplus Property Program.'
    , '/project/draft'
    , 'SubmitDisposal'
), (
    1
    , 1
    , 'Select Properties'
    , 0
    , 'Add properties to the project.'
    , '/project/properties'
    , 'SubmitDisposal'
), (
    2
    , 2
    , 'Update Information'
    , 0
    , 'Assign tier level, classification and update current financial information.'
    , '/project/information'
    , 'SubmitDisposal'
), (
    3
    , 3
    , 'Required Documentation'
    , 0
    , 'Required documentation has been completed and sent (Surplus Declaration & Readiness Checklist, Triple Bottom Line).'
    , '/project/documentation'
    , 'SubmitDisposal'
), (
    4
    , 4
    , 'Approval'
    , 0
    , 'The project is ready to be approved by owning agency.'
    , '/project/approval'
    , 'SubmitDisposal'
), (
    5
    , 5
    , 'Submitted'
    , 0
    , 'The project has been submitted for review to be added to the Surplus Property Program.'
    , '/project/submitted'
    , 'SubmitDisposal,ReviewDisposal'
), (
    6
    , 6
    , 'Property Review'
    , 0
    , 'Property information review.'
    , '/project/property/review'
    , 'ReviewDisposal'
), (
    7
    , 7
    , 'Document Review'
    , 0
    , 'Documentation reviewed (Surplus Declaration & Readiness Checklist, Triple Bottom Line).'
    , '/project/documentation'
    , 'ReviewDisposal'
), (
    8
    , 8
    , 'First Nation Consultation'
    , 0
    , 'First Nation Consultation process.'
    , '/project/fist/nation/consultation'
    , 'ReviewDisposal'
), (
    9
    , 9
    , 'Approved'
    , 0
    , 'The project has been approved to be added to the Surplus Property Program.'
    , '/project/approved'
    , 'ReviewDisposal'
), (
    10
    , 10
    , 'Denied'
    , 0
    , 'The project has been denied to be added to the Surplus Property Program.'
    , '/project/denied'
    , 'ReviewDisposal'
)
