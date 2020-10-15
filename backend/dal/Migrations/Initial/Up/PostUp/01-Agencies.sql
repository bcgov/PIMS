PRINT 'Adding Agencies'

SET IDENTITY_INSERT dbo.[Agencies] ON

-- Parent Agencies.
INSERT INTO dbo.[Agencies] (
    [Id]
    , [Code]
    , [Name]
    , [IsDisabled]
    , [SendEmail]
    , [Email]
    , [AddressTo]
) VALUES (
    1
    , 'AEST'
    , 'Ministry of Advanced Education, Skills & Training'
    , 0
    , 1
    , 'kevin.brewster@gov.bc.ca'
    , 'ADM and EFO Finance, Technology and Management Services'
), (
    2
    , 'CITZ'
    , 'Ministry of Citizens Services'
    , 0
    , 1
    , 'dean.skinner@gov.bc.ca'
    , 'ADM and EFO CSD'
), (
    4
    , 'EDUC'
    , 'Ministry of Education'
    , 0
    , 1
    , 'reg.bawa@gov.bc.ca'
    , 'ADM Resource Management Division'
), (
    5
    , 'FIN'
    , 'Ministry of Finance'
    , 0
    , 1
    , 'teri.spaven@gov.bc.ca'
    , 'ADM & EFO Corporate Services Division'
), (
    6
    , 'FLNR'
    , 'Ministry of Forests, Lands, Natural Resources'
    , 0
    , 1
    , 'trish.dohan@gov.bc.ca'
    , 'ADM CSNR and EFO for FLNR'
), (
    7
    , 'HLTH'
    , 'Ministry of Health'
    , 0
    , 1
    , 'philip.twyford@gov.bc.ca'
    , 'ADM & EFO Finance and Corporate Services'
), (
    8
    , 'MAH'
    , 'Ministry of Municipal Affairs & Housing'
    , 0
    , 1
    , 'david.curtis@gov.bc.ca'
    , 'ADM & EFO Management Services Division'
), (
    9
    , 'TRAN'
    , 'Ministry of Transportation and Infrastructure'
    , 0
    , 1
    , 'nancy.bain@gov.bc.ca'
    , 'ADM & EFO Finance & Management Services Department'
), (
    10
    , 'EMPR'
    , 'Energy, Mines & Petroleum Resources'
    , 0
    , 1
    , 'wes.boyd@gov.bc.ca'
    , 'ADM  CSNR and EFO to MIRR, AGRI EMPR ENV'
), (
    11
    , 'MAG'
    , 'Ministry of Attorney General'
    , 0
    , 1
    , 'tracy.campbell@gov.bc.ca'
    , 'ADM & EFO CMSB AG and PSSG'
), (
    12
    , 'JEDC'
    , 'Jobs, Economic Development & Competitiveness'
    , 0
    , 1
    , 'joanna.white@gov.bc.ca'
    , 'A/ADM & EFO Management Services Division'
), (
    13
    , 'MTAC'
    , 'Ministry of Tourism, Arts and Culture'
    , 0
    , 1
    , 'salman.azam@gov.bc.ca'
    , 'ADM & EFO Management Services Division'
), (
    14
    , 'SDPR'
    , 'Ministry of of Social Development and Poverty Reduction'
    , 0
    , 1
    , 'jonathan.dube@gov.bc.ca'
    , 'ADM & EFO CSD'
), (
    15
    , 'MMHA'
    , 'Ministry of Mental Health and Addictions'
    , 0
    , 1
    , 'dara.landry@gov.bc.ca'
    , 'Executive Lead Corporate Services'
), (
    16
    , 'MCFD'
    , 'Ministry of Children and Family Development'
    , 0
    , 1
    , 'rob.byers@gov.bc.ca'
    , 'AMD & EFO'
), (
    17
    , 'BCPSA'
    , 'Public Service Agency'
    , 0
    , 1
    , 'bruce.richmond@gov.bc.ca'
    , 'ADM Corporate Services'
)

-- Child Agencies for HLTH.
INSERT INTO dbo.[Agencies] (
    [Id]
    , [ParentId]
    , [Code]
    , [Name]
    , [IsDisabled]
    , [SendEmail]
) VALUES (
    20
    , 7
    , 'FHA'
    , 'Fraser Health Authority'
    , 0
    , 0
), (
    21
    , 7
    , 'IHA'
    , 'Interior Health Authority'
    , 0
    , 0
), (
    22
    , 7
    , 'NHA'
    , 'Northern Health Authority'
    , 0
    , 0
), (
    23
    , 7
    , 'PHSA'
    , 'Provincial Health Services Authority'
    , 0
    , 0
), (
    24
    , 7
    , 'VCHA'
    , 'Vancouver Coastal Health Authority'
    , 0
    , 0
), (
    25
    , 7
    , 'VIHA'
    , 'Vancouver Island Health Authority'
    , 0
    , 0
)

-- Child Agencies for EMPR.
INSERT INTO dbo.[Agencies] (
    [Id]
    , [ParentId]
    , [Code]
    , [Name]
    , [IsDisabled]
    , [SendEmail]
) VALUES (
    30
    , 10
    , 'BCH'
    , 'BC Hydro'
    , 0
    , 0
)

-- Child Agencies for MAH.
INSERT INTO dbo.[Agencies] (
    [Id]
    , [ParentId]
    , [Code]
    , [Name]
    , [IsDisabled]
    , [SendEmail]
) VALUES (
    40
    , 8
    , 'BCH'
    , 'BC Housing'
    , 0
    , 0
), (
    41
    , 8
    , 'BCA'
    , 'BC Assessment'
    , 0
    , 0
)

-- Child Agencies for MAG.
INSERT INTO dbo.[Agencies] (
    [Id]
    , [ParentId]
    , [Code]
    , [Name]
    , [IsDisabled]
    , [SendEmail]
) VALUES (
    50
    , 11
    , 'ICBC'
    , 'Insurance Coporation of BC'
    , 0
    , 0
)

-- Child Agencies for JEDC.
--INSERT INTO dbo.[Agencies] (
--    [Id]
--    , [ParentId]
--    , [Code]
--    , [Name]
--    , [IsDisabled]
--    , [SendEmail]
--) VALUES (
--    50
--    , 12
--    , 'BCPC'
--    , 'BC Pavillion Corporation'
--    , 0
--    , 0
--)

-- Child Agencies for EDUC.
INSERT INTO dbo.[Agencies] (
    [Id]
    , [ParentId]
    , [Code]
    , [Name]
    , [IsDisabled]
    , [SendEmail]
) VALUES (
    70
    , 4
    , 'CMB'
    , 'Capital Management Branch'
    , 0
    , 0
)

-- Child Agencies for AEST.
INSERT INTO dbo.[Agencies] (
    [Id]
    , [ParentId]
    , [Code]
    , [Name]
    , [IsDisabled]
    , [SendEmail]
) VALUES (
    80
    , 1
    , 'BCIT'
    , 'British Colubmia Institute of Technology'
    , 0
    , 0
), (
    81
    , 1
    , 'CAMC'
    , 'Camosun College'
    , 0
    , 0
), (
    82
    , 1
    , 'CAPU'
    , 'Capilano University'
    , 0
    , 0
), (
    83
    , 1
    , 'CNC'
    , 'College of New Caledonia'
    , 0
    , 0
), (
    84
    , 1
    , 'CROCK'
    , 'College of the Rockies'
    , 0
    , 0
), (
    85
    , 1
    , 'DC'
    , 'Douglas College'
    , 0
    , 0
), (
    86
    , 1
    , 'ECUAD'
    , 'Emily Carr University of Art and Design'
    , 0
    , 0
), (
    87
    , 1
    , 'JIBC'
    , 'Justice Institute of BC'
    , 0
    , 0
), (
    88
    , 1
    , 'KP'
    , 'Kwantlen Polytechnic'
    , 0
    , 0
), (
    89
    , 1
    , 'LC'
    , 'Langara College'
    , 0
    , 0
), (
    90
    , 1
    , 'NVIT'
    , 'Nichola Valley Institute of Technology'
    , 0
    , 0
), (
    91
    , 1
    , 'NLC'
    , 'Northern Lights College'
    , 0
    , 0
), (
    92
    , 1
    , 'CMC'
    , 'Coast Mountain College'
    , 0
    , 0
), (
    93
    , 1
    , 'OC'
    , 'Okanagan College'
    , 0
    , 0
), (
    94
    , 1
    , 'SC'
    , 'Selkirk College'
    , 0
    , 0
), (
    95
    , 1
    , 'SFU'
    , 'Simon Fraser University'
    , 0
    , 0
), (
    96
    , 1
    , 'TRU'
    , 'Thompson Rivers University'
    , 0
    , 0
), (
    97
    , 1
    , 'UBC'
    , 'University of BC'
    , 0
    , 0
), (
    98
    , 1
    , 'UFV'
    , 'University of the Fraser Valley'
    , 0
    , 0
), (
    99
    , 1
    , 'UNBC'
    , 'University of Northern BC'
    , 0
    , 0
), (
    100
    , 1
    , 'UVIC'
    , 'University of Victoria'
    , 0
    , 0
), (
    101
    , 1
    , 'VCC'
    , 'Vancouver Community College'
    , 0
    , 0
), (
    102
    , 1
    , 'VIU'
    , 'Vancouver Island University'
    , 0
    , 0
)

-- Child Agencies for CITZ.
INSERT INTO dbo.[Agencies] (
    [Id]
    , [ParentId]
    , [Code]
    , [Name]
    , [IsDisabled]
    , [SendEmail]
) VALUES (
    110
    , 2
    , 'RPD'
    , 'Real Property Division'
    , 0
    , 0
)

-- Child Agencies for FLNR.
INSERT INTO dbo.[Agencies] (
    [Id]
    , [ParentId]
    , [Code]
    , [Name]
    , [IsDisabled]
    , [SendEmail]
) VALUES (
    120
    , 6
    , 'CLO'
    , 'Crown Land Opportunities'
    , 0
    , 0
)

-- Child Agencies for TRAN.
INSERT INTO dbo.[Agencies] (
    [Id]
    , [ParentId]
    , [Code]
    , [Name]
    , [IsDisabled]
    , [SendEmail]
) VALUES (
    130
    , 9
    , 'PLMB'
    , 'Properties and Land Management Branch'
    , 0
    , 0
),(
    131
    , 9
    , 'BCT'
    , 'BC Transit '
    , 0
    , 0
)

-- Child Agencies for MTAC.
INSERT INTO dbo.[Agencies] (
    [Id]
    , [ParentId]
    , [Code]
    , [Name]
    , [IsDisabled]
    , [SendEmail]
) VALUES (
    140
    , 13
    , 'PAVCO'
    , 'BC Pavillion Corporation'
    , 0
    , 0
)

SET IDENTITY_INSERT dbo.[Agencies] OFF

