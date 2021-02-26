PRINT 'Adding ProjectStatus'

SET IDENTITY_INSERT dbo.[ProjectStatus] ON

INSERT INTO dbo.[ProjectStatus] (
    [Id]
    , [SortOrder]
    , [Name]
    , [GroupName]
    , [Code]
    , [IsTerminal]
    , [IsDisabled]
    , [Description]
    , [Route]
    , [IsMilestone]
) VALUES (
    1
    , 0
    , 'Draft'
    , 'Draft'
    , 'DR'
    , 0
    , 0
    , 'A new draft project that is not ready to submit to apply to be added to the Surplus Property Program.'
    , '/projects/draft'
    , 0
), (
    2
    , 1
    , 'Select Properties'
    , 'Draft'
    , 'DR-P'
    , 0
    , 0
    , 'Add properties to the project.'
    , '/projects/properties'
    , 0
), (
    3
    , 2
    , 'Update Information'
    , 'Draft'
    , 'DR-I'
    , 0
    , 0
    , 'Assign tier level, classification and update current financial information.'
    , '/projects/information'
    , 0
), (
    4
    , 3
    , 'Required Documentation'
    , 'Draft'
    , 'DR-D'
    , 0
    , 0
    , 'Required documentation has been completed and sent (Surplus Declaration & Readiness Checklist, Triple Bottom Line).'
    , '/projects/documentation'
    , 0
), (
    5
    , 4
    , 'Approval'
    , 'Draft'
    , 'DR-A'
    , 0
    , 0
    , 'The project is ready to be approved by owning agency.'
    , '/projects/approval'
    , 0
), (
    6
    , 5
    , 'Review'
    , 'Draft'
    , 'DR-RE'
    , 0
    , 0
    , 'The project has been submitted for review to be added to the Surplus Property Program.'
    , '/projects/review'
    , 0
), (
    7
    , 6
    , 'Submitted'
    , 'Submitted'
    , 'AS-I'
    , 0
    , 0
    , 'Submitted project property information review.'
    , '/projects/assess/properties'
    , 1
), (
    8
    , 6
    , 'Submitted Exemption'
    , 'Submitted'
    , 'AS-EXE'
    , 0
    , 0
    , 'Project has been been submitted with a request for exemption.'
    , '/projects/assess/properties'
    , 1
)

-- Assessment

, (
    10
    , 7
    , 'Document Review'
    , 'Submitted'
    , 'AS-D'
    , 0
    , 0
    , 'Documentation reviewed (Surplus Declaration & Readiness Checklist, Triple Bottom Line).'
    , '/projects/assess/documentation'
    , 0
), (
    11
    , 8
    , 'Appraisal Review'
    , 'Submitted'
    , 'AS-AP'
    , 0
    , 0
    , 'Appraisal review process.'
    , '/projects/assess/appraisal'
    , 0
), (
    12
    , 9
    , 'First Nation Consultation'
    , 'Submitted'
    , 'AS-FNC'
    , 0
    , 0
    , 'First Nation Consultation process.'
    , '/projects/assess/first/nation/consultation'
    , 0
), (
    13
    , 10
    , 'Exemption Review'
    , 'Submitted'
    , 'AS-EXP'
    , 0
    , 0
    , 'Process to approve ERP exemption.'
    , 'projects/assess/exemption'
    , 0
), (
    14
    , 11
    , 'Approved for ERP'
    , 'Approved'
    , 'AP-ERP'
    , 0
    , 0
    , 'The project has been approved to be added to the Surplus Property Program - Enhanced Referral Program.  This begins the 90 day internal marketing process.'
    , '/projects/approved'
    , 1
), (
    15
    , 11
    , 'Approved for Exemption'
    , 'Approved'
    , 'AP-EXE'
    , 0
    , 0
    , 'Project has been approved for ERP exemption.'
    , '/projects/approved'
    , 1
), (
    16
    , 11
    , 'Denied'
    , 'Closed'
    , 'DE'
    , 1
    , 0
    , 'The project has been denied to be added to the Surplus Property Program.'
    , '/projects/denied'
    , 1
)

-- Exemption outcome
-- ERP outcome

, (
    20
    , 21
    , 'Transferred within the GRE'
    , 'Closed'
    , 'T-GRE'
    , 1
    , 0
    , 'The project has been transferred within the Greater Reporting Entity'
    , '/projects/transferred'
    , 1
), (
    21
    , 21
    , 'Approved for SPL'
    , 'Approved'
    , 'AP-SPL'
    , 0
    , 0
    , 'The project has been approved to be added to the Surplus Property Program - Surplus Property List.  This begins the external marketing process.'
    , '/projects/approved'
    , 1
), (
    22
    , 21
    , 'Not in SPL'
    , 'Approved'
    , 'AP-!SPL'
    , 0
    , 0
    , 'The project has been approved to not be included in the Surplus Property Program - Surplus Property List. '
    , '/projects/approved'
    , 1
), (
    23
    , 21
    , 'Cancelled'
    , 'Closed'
    , 'CA'
    , 1
    , 0
    , 'The project has been cancelled from the Surplus Property Program.'
    , '/projects/cancelled'
    , 1
)

-- ERP process

, (
    30
    , 1
    , 'In ERP'
    , 'ERP'
    , 'ERP-ON'
    , 0
    , 0
    , 'The project has is in the Enhanced Referral Program.'
    , '/projects/erp'
    , 0
), (
    31
    , 2
    , 'On Hold'
    , 'ERP'
    , 'ERP-OH'
    , 0
    , 0
    , 'The project has been put on hold due to potential sale to an interested party.'
    , '/projects/onhold'
    , 0
), (
    32
    , 21
    , 'Disposed'
    , 'Complete'
    , 'DIS'
    , 1
    , 0
    , 'The project has been disposed externally.'
    , '/projects/disposed'
    , 1
)

-- SPL process

, (
    40
    , 18
    , 'Pre-Marketing'
    , 'Pre-Marketing'
    , 'SPL-PM'
    , 0
    , 0
    , 'The project is in the pre-marketing stage of the Surplus Property List.'
    , '/projects/premarketing'
    , 0
), (
    41
    , 19
    , 'On Market'
    , 'Marketing'
    , 'SPL-M'
    , 0
    , 0
    , 'The project is in the marketing stage of the Surplus Property List.'
    , '/projects/premarketing'
    , 0
), (
    42
    , 20
    , 'Contract in Place'
    , 'Contract in Place'
    , 'SPL-CIP'
    , 0
    , 0
    , 'The project has received an offer either conditional or unconditional.'
    , '/projects/contractinplace'
    , 0
)

SET IDENTITY_INSERT dbo.[ProjectStatus] OFF
