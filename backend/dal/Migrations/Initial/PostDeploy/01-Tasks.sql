PRINT 'Adding Tasks'

SET IDENTITY_INSERT dbo.[Tasks] ON

INSERT INTO dbo.[Tasks] (
    [Id]
    , [Name]
    , [IsDisabled]
    , [Description]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
) VALUES (
    1
    , 'Surplus Declaration & Readiness Checklist completed and sent'
    , 0
    , 'Surplus Declaration & Readiness Checklist document emailed to SRES.'
    , 4
    , 0
    , 1
), (
    2
    , 'Triple Bottom Line completed and sent'
    , 0
    , 'Triple Bottom Line document emailed to SRES.'
    , 4
    , 0
    , 2
), (
    3
    , 'Review completed'
    , 0
    , 'Project property information has been reviewed'
    , 7
    , 0
    , 0
), (
    4
    , 'Documents received and review completed'
    , 0
    , 'Documents have been received, reviewed and approved.'
    , 9
    , 0
    , 0
), (
    5
    , 'Appraisal ordered'
    , 0
    , 'An appraisal has been ordered.'
    , 10
    , 1
    , 1
), (
    6
    , 'Appraisal received'
    , 0
    , 'An appraisal has been received.'
    , 10
    , 1
    , 2
), (
    7
    , 'Appraisal completed'
    , 0
    , 'An appraisal has been reviewed and completed.'
    , 10
    , 1
    , 3
), (
    8
    , 'Preparation and due diligence'
    , 0
    , 'First Nations consulatation preparation and due diligence.'
    , 11
    , 1
    , 1
), (
    9
    , 'Consultation underway'
    , 0
    , 'First Nations consulation is underway.'
    , 11
    , 1
    , 2
), (
    10
    , 'Consultation complete'
    , 0
    , 'First Nations consultation is complete.'
    , 11
    , 1
    , 3
), (
    11
    , 'Notification to confirm exemption request sent to agency ADM'
    , 0
    , 'ADM has been notified of request for exemption'
    , 12
    , 0
    , 1
), (
    12
    , 'Confirmation has been received from agency ADM'
    , 0
    , 'ADM has confirmed request for exemption'
    , 12
    , 0
    , 2
)

SET IDENTITY_INSERT dbo.[Tasks] OFF
