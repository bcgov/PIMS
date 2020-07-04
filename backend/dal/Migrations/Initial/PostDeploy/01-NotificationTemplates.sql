PRINT 'Adding NotificationTemplates'

SET IDENTITY_INSERT dbo.[NotificationTemplates] ON

INSERT INTO dbo.[NotificationTemplates] (
    [Id]
    , [Name]
    , [Description]
    , [IsDisabled]
    , [To]
    , [Bcc]
    , [Audience]
    , [Encoding]
    , [BodyType]
    , [Priority]
    , [Subject]
    , [Body]
    , [Tag]
) VALUES (
    1
    , 'New Disposal Project Submitted'
    , 'Inform SRES a new project has been submitted for assessment.'
    , 0
    , 'jeremy.foster@fosol.ca'
    , ''
    , 'Default'
    , 'utf-8'
    , 'html'
    , 'normal'
    , 'New Disposal Project Submitted - @Model.Project.ProjectNumber'
    , 'Body'
    , 'ERP'
), (
    2
    , 'Disposal Project Denied'
    , 'Inform owning agency their disposal project was denied.'
    , 0
    , ''
    , ''
    , 'OwningAgency'
    , 'utf-8'
    , 'html'
    , 'normal'
    , 'Disposal Project Denied - @Model.Project.ProjectNumber'
    , 'Body'
    , 'ERP'
), (
    3
    , 'Disposal Project Cancelled'
    , 'Inform owning agency their disposal project was cancelled.'
    , 0
    , ''
    , ''
    , 'OwningAgency'
    , 'utf-8'
    , 'html'
    , 'normal'
    , 'Disposal Project Cancelled - @Model.Project.ProjectNumber'
    , 'Body'
    , 'ERP'
), (
    4
    , 'Disposal Project Approved for ERP'
    , 'Inform owning agency their project has been approved and properties will be added to ERP.'
    , 0
    , ''
    , ''
    , 'OwningAgency'
    , 'utf-8'
    , 'html'
    , 'normal'
    , 'Disposal Project Approved for ERP - @Model.Project.ProjectNumber'
    , 'Body'
    , 'ERP'
), (
    5
    , 'New Properties on ERP'
    , 'Inform agencies of new properties added to ERP.'
    , 0
    , ''
    , ''
    , 'ParentAgencies'
    , 'utf-8'
    , 'html'
    , 'normal'
    , 'Subject'
    , 'Body'
    , 'ERP'
), (
    6
    , '30 day ERP notification - Owning Agency'
    , 'ERP 30 expiration notification to inform owning agency of time remaining in ERP'
    , 0
    , ''
    , ''
    , 'OwningAgency'
    , 'utf-8'
    , 'html'
    , 'normal'
    , '30 day ERP notification - Owning Agency'
    , 'Body'
    , 'ERP'
), (
    7
    , '60 day ERP notification - Owning Agency'
    , 'ERP 60 expiration notification to inform owning agency of time remaining in ERP'
    , 0
    , ''
    , ''
    , 'OwningAgency'
    , 'utf-8'
    , 'html'
    , 'normal'
    , '60 day ERP notification - Owning Agency'
    , 'Body'
    , 'ERP'
), (
    8
    , '90 day ERP notification - Owning Agency'
    , 'ERP 90 expiration notification to inform owning agency ERP is complete.'
    , 0
    , ''
    , ''
    , 'OwningAgency'
    , 'utf-8'
    , 'html'
    , 'normal'
    , '90 day ERP notification - Owning Agency'
    , 'Body'
    , 'ERP'
), (
    9
    , '30 day ERP notification - Parent Agencies'
    , 'ERP 30 notification to inform agencies or properties available in ERP.'
    , 0
    , ''
    , ''
    , 'ParentAgencies'
    , 'utf-8'
    , 'html'
    , 'normal'
    , '30 day ERP notification - Parent Agencies'
    , 'Body'
    , 'ERP'
), (
    10
    , '60 day ERP notification - Parent Agencies'
    , 'ERP 60 notification to inform agencies or properties available in ERP.'
    , 0
    , ''
    , ''
    , 'ParentAgencies'
    , 'utf-8'
    , 'html'
    , 'normal'
    , '60 day ERP notification - Parent Agencies'
    , 'Body'
    , 'ERP'
), (
    11
    , '90 day ERP notification - Parent Agencies'
    , 'ERP 90 expiration notification to inform agencies.'
    , 0
    , ''
    , ''
    , 'ParentAgencies'
    , 'utf-8'
    , 'html'
    , 'normal'
    , '90 day ERP notification - Parent Agencies'
    , 'Body'
    , 'ERP'
), (
    12
    , '30 day ERP notification - Purchasing Agencies'
    , 'ERP 30 notification to inform purchasing agencies to submit business case.'
    , 0
    , ''
    , ''
    , 'ParentAgencies'
    , 'utf-8'
    , 'html'
    , 'normal'
    , '30 day ERP notification - Purchasing Agencies'
    , 'Body'
    , 'ERP'
), (
    13
    , '60 day ERP notification - Purchasing Agencies'
    , 'ERP 60 notification to inform purchasing agencies to submit business case.'
    , 0
    , ''
    , ''
    , 'ParentAgencies'
    , 'utf-8'
    , 'html'
    , 'normal'
    , '60 day ERP notification - Purchasing Agencies'
    , 'Body'
    , 'ERP'
), (
    14
    , '90 day ERP notification - Purchasing Agencies'
    , 'ERP 90 expiration notification to inform purchasing agencies to submit business case.'
    , 0
    , ''
    , ''
    , 'ParentAgencies'
    , 'utf-8'
    , 'html'
    , 'normal'
    , '90 day ERP notification - Purchasing Agencies'
    , 'Body'
    , 'ERP'
), (
    15
    , 'Access Request'
    , 'A new authenticated user has requested access.'
    , 0
    , 'jeremy.foster@fosol.ca'
    , ''
    , 'Default'
    , 'utf-8'
    , 'html'
    , 'normal'
    , 'PIMS - Access Request'
    , 'Body'
    , 'ERP'
)

SET IDENTITY_INSERT dbo.[NotificationTemplates] OFF

