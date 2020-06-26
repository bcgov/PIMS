PRINT 'Adding ProjectStatus'

SET IDENTITY_INSERT dbo.[ProjectStatus] ON

INSERT INTO dbo.[ProjectStatus] (
    [Id]
    , [SortOrder]
    , [Name]
    , [GroupName]
    , [Code]
    , [IsActive]
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
    , 1
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
    , 1
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
    , 1
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
    , 1
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
    , 1
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
    , 1
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
    , 1
    , 0
    , 'Submitted project property information review.'
    , '/projects/assess/properties'
    , 1
), (
    8
    , 7
    , 'Submitted Exemption'
    , 'Submitted'
    , 'AS-EXE'
    , 1
    , 0
    , 'Project has been been submitted with a request for exemption.'
    , '/projects/assess/properties'
    , 1  
), (
    9
    , 8
    , 'Document Review'
    , 'Submitted'
    , 'AS-D'
    , 1
    , 0
    , 'Documentation reviewed (Surplus Declaration & Readiness Checklist, Triple Bottom Line).'
    , '/projects/assess/documentation'
    , 0
), (
    10
    , 9
    , 'Appraisal Review'
    , 'Submitted'
    , 'AS-AP'
    , 1
    , 0
    , 'Appraisal review process.'
    , '/projects/assess/appraisal'
    , 0
), (
    11
    , 10
    , 'First Nation Consultation'
    , 'Submitted'
    , 'AS-FNC'
    , 1
    , 0
    , 'First Nation Consultation process.'
    , '/projects/assess/first/nation/consultation'
    , 0
), (
    12
    , 11
    , 'Exemption Process'
    , 'Submitted'
    , 'AS-EXP'
    , 1
    , 0
    , 'Process to approve ERP exemption.'
    , 'projects/assess/exemption'
    , 0
), (
    13
    , 12
    , 'Approved for ERP'
    , 'Approved'
    , 'AP-ERP'
    , 1
    , 0
    , 'The project has been approved to be added to the Surplus Property Program - Enhanced Referral Program.  This begins the 90 day internal marketing process.'
    , '/projects/approved'
    , 1
), (
    14
    , 13
    , 'Approved for SPL'
    , 'Approved'
    , 'AP-SPL'
    , 1
    , 0
    , 'The project has been approved to be added to the Surplus Property Program - Surplus Property List.  This begins the external marketing process.'
    , '/projects/approved'
    , 1
), (
    15
    , 14
    , 'Approved for Exemption'
    , 'Approved'
    , 'AP-EXE'
    , 1
    , 0
    , 'Project has been approved for ERP exemption.'
    , '/projects/approved'
    , 1    
), (
    16
    , 15
    , 'Denied'
    , 'Closed'
    , 'DE'
    , 0
    , 0
    , 'The project has been denied to be added to the Surplus Property Program.'
    , '/projects/denied'
    , 1
), (
    17
    , 16
    , 'Cancelled'
    , 'Closed'
    , 'CA'
    , 0
    , 0
    , 'The project has been cancelled from the Surplus Property Program.'
    , '/projects/cancelled'
    , 1
)
, (
    18
    , 17
    , 'OnHold'
    , 'OnHold'
    , 'OH'
    , 1
    , 0
    , 'The project has been put on hold due to potential sale to an interested party.'
    , '/projects/onhold'
    , 1
), (
    19
    , 18
    , 'Transferred within the GRE'
    , 'Closed'
    , 'T-GRE'
    , 0
    , 0
    , 'The project has been transferred within the Greater Revenue Entity'
    , '/projects/transferred'
    , 1
)

SET IDENTITY_INSERT dbo.[ProjectStatus] OFF
