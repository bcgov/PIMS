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
    , 'Triple Bottom Line document emailed to SRES OR Project is in Tier 1.'
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
    , 'Review completed'
    , 0
    , 'Project property information has been reviewed'
    , 8
    , 0
    , 0
), (
    5
    , 'Documents received and review completed'
    , 0
    , 'Documents have been received, reviewed and approved.'
    , 10
    , 0
    , 0
), (
    6
    , 'Appraisal ordered'
    , 0
    , 'An appraisal has been ordered.'
    , 11
    , 1
    , 1
), (
    7
    , 'Appraisal received'
    , 0
    , 'An appraisal has been received.'
    , 11
    , 1
    , 2
), (
    8
    , 'Appraisal completed'
    , 0
    , 'An appraisal has been reviewed and completed.'
    , 11
    , 1
    , 3
), (
    9
    , 'Preparation and due diligence'
    , 0
    , 'First Nations consultation preparation and due diligence.'
    , 12
    , 1
    , 1
), (
    10
    , 'Consultation underway'
    , 0
    , 'First Nations consultation is underway.'
    , 12
    , 1
    , 2
), (
    11
    , 'Consultation complete'
    , 0
    , 'First Nations consultation is complete.'
    , 12
    , 1
    , 3
), (
    12
    , 'Notification to confirm exemption request sent to agency ADM'
    , 0
    , 'ADM has been notified of request for exemption'
    , 13
    , 0
    , 1
), (
    13
    , 'Confirmation has been received from agency ADM'
    , 0
    , 'ADM has confirmed request for exemption'
    , 13
    , 0
    , 2
), (
    14
    , 'Appraisal ordered'
    , 0
    , 'An appraisal has been ordered.'
    , 32 --Disposed
    , 0
    , 1
), (
    15
    , 'Appraisal received'
    , 0
    , 'An appraisal has been received.'
    , 32 --Disposed
    , 0
    , 2
), (
    16
    , 'Appraisal completed'
    , 0
    , 'An appraisal has been reviewed and completed.'
    , 32 --Disposed
    , 0
    , 3
), (
    17
    , 'Bid Rigging, Collusion and Bias'
    , 0
    , 'I confirm I have reviewed the offer and to the best of my knowledge confirm there is no identifiable opportunity for bid rigging, collusion and bias'
    , 42 --Contract in Place
    , 0
    , 4
)

SET IDENTITY_INSERT dbo.[Tasks] OFF
