PRINT 'Adding ProjectStatusNotifications'

INSERT INTO dbo.[ProjectStatusNotifications]
    (
    [TemplateId]
    , [FromStatusId]
    , [ToStatusId]
    , [Priority]
    , [Delay]
    , [DelayDays]
    )
VALUES
(
    1 -- New Disposal Project Submitted
    , 6
    , 7
    , 2
    , 0
    , 0
), (
    1 -- New Disposal Project Submitted with Exemption
    , 6
    , 8
    , 2
    , 0
    , 0
), (
    2 -- Disposal Project Denied
    , NULL
    , 16
    , 1
    , 0
    , 0
), (
    3 -- Disposal Project Cancelled
    , NULL
    , 23
    , 1
    , 0
    , 0
), (
    4 -- Disposal Project Approved for ERP
    , NULL
    , 14
    , 1
    , 0
    , 0
), (
    5 -- New Properties on ERP
    , NULL
    , 14
    , 2
    , 0
    , 0
), (
    6 -- 30 day ERP notification - Owning Agency
    , NULL
    , 14
    , 1
    , 3
    , 30
), (
    7 -- 60 day ERP notification - Owning Agency
    , NULL
    , 14
    , 1
    , 3
    , 60
), (
    8 -- 90 day ERP notification - Owning Agency
    , NULL
    , 14
    , 1
    , 3
    , 90
), (
    9 -- 30 day ERP notification - Parent Agencies
    , NULL
    , 14
    , 2
    , 3
    , 30
), (
    10 -- 60 day ERP notification - Parent Agencies
    , NULL
    , 14
    , 2
    , 3
    , 60
), (
    11 -- 90 day ERP notification - Parent Agencies
    , NULL
    , 14
    , 2
    , 3
    , 90
), (
    12 -- 30 day ERP notification - Watching Agencies
    , NULL
    , 14
    , 2
    , 3
    , 30
), (
    13 -- 60 day ERP notification - Watching Agencies
    , NULL
    , 14
    , 2
    , 3
    , 60
), (
    14 -- 90 day ERP notification - Watching Agencies
    , NULL
    , 14
    , 2
    , 3
    , 90
)
