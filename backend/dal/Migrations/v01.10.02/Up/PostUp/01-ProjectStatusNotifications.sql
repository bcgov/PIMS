PRINT 'Adding ProjectStatusNotifications'

IF NOT EXISTS (
    SELECT 1
    FROM dbo.[ProjectStatusNotifications]
    WHERE [TemplateId] = 12
        AND [FromStatusId] IS NULL
        AND [ToStatusId] = 30
)
BEGIN
    INSERT INTO dbo.[ProjectStatusNotifications] (
        [TemplateId]
        , [FromStatusId]
        , [ToStatusId]
        , [Priority]
        , [Delay]
        , [DelayDays]
    )
    VALUES (
        12 -- 30 day ERP notification - Watching Agencies
        , NULL
        , 30 -- In ERP
        , 2
        , 3
        , 30
    )
END


IF NOT EXISTS (
    SELECT 1
    FROM dbo.[ProjectStatusNotifications]
    WHERE [TemplateId] = 13
        AND [FromStatusId] IS NULL
        AND [ToStatusId] = 30
)
BEGIN
INSERT dbo.[ProjectStatusNotifications] (
    [TemplateId]
    , [FromStatusId]
    , [ToStatusId]
    , [Priority]
    , [Delay]
    , [DelayDays]
)
VALUES (
    13 -- 60 day ERP notification - Watching Agencies
    , NULL
    , 30 -- In ERP
    , 2
    , 3
    , 60
)
END


IF NOT EXISTS (
    SELECT 1
    FROM dbo.[ProjectStatusNotifications]
    WHERE [TemplateId] = 14
        AND [FromStatusId] IS NULL
        AND [ToStatusId] = 30
)
BEGIN
INSERT dbo.[ProjectStatusNotifications] (
    [TemplateId]
    , [FromStatusId]
    , [ToStatusId]
    , [Priority]
    , [Delay]
    , [DelayDays]
)
VALUES (
    14 -- 90 day ERP notification - Watching Agencies
    , NULL
    , 30 -- In ERP
    , 2
    , 3
    , 90
)
END
