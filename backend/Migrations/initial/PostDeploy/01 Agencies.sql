PRINT 'Adding Agencies'

SET IDENTITY_INSERT dbo.[Agencies] ON

-- Parent Agencies.
INSERT INTO dbo.[Agencies] (
    [Id]
    , [Code]
    , [Name]
    , [IsDisabled]
) VALUES (
    1
    , 'AEST'
    , 'Ministry of Advanced Education, Skills & Training'
    , 0
), (
    2
    , 'CITZ'
    , 'Ministry of Citizens Services'
    , 0
), (
    3
    , 'CSNR'
    , 'Ministry of Corporate Services for the Natural Resources Sector'
    , 0
), (
    4
    , 'EDUC'
    , 'Ministry of Education'
    , 0
), (
    5
    , 'FIN'
    , 'Ministry of Finance'
    , 0
), (
    6
    , 'FLNR'
    , 'Ministry of Forests, Lands, Natural Resources'
    , 0
), (
    7
    , 'HLTH'
    , 'Ministry of Health'
    , 0
), (
    8
    , 'MAH'
    , 'Ministry of Municipal Affairs & Housing'
    , 0
), (
    9
    , 'TRAN'
    , 'Ministry of Transportation and Infrastructure'
    , 0
)

-- Child Agencies for HLTH.
INSERT INTO dbo.[Agencies] (
    [Id]
    , [ParentId]
    , [Code]
    , [Name]
    , [IsDisabled]
) VALUES (
    10
    , 7
    , 'LEAD'
    , 'Ministry Lead'
    , 0
), (
    11
    , 7
    , 'ADM'
    , 'Actiing Deputy Minister'
    , 0
), (
    12
    , 7
    , 'ED'
    , 'Executive Director'
    , 0
), (
    13
    , 7
    , 'FHA'
    , 'Fraser Health Authority'
    , 0
), (
    14
    , 7
    , 'IHA'
    , 'Interior Health Authority'
    , 0
), (
    15
    , 7
    , 'NHA'
    , 'Northern Health Authority'
    , 0
), (
    16
    , 7
    , 'PHSA'
    , 'Provincial Health Services Authority'
    , 0
), (
    17
    , 7
    , 'VCHA'
    , 'Vancouver Coastal Health Authority'
    , 0
), (
    18
    , 7
    , 'VIHA'
    , 'Vancouver Island Health Authority'
    , 0
)

SET IDENTITY_INSERT dbo.[Agencies] OFF

