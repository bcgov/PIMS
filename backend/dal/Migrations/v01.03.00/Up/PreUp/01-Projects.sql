PRINT 'Backup Projects'

-- Create temporary table to store the project values
SELECT
    p.[Id]
    , CASE WHEN p.[Metadata] IS NULL THEN '{}' ELSE '{ ' +
    '"ExemptionRequested": ' + (CASE WHEN p.[ExemptionRequested] = 1 THEN 'true' ELSE 'false' END) + ', ' +

    '"AssessedOn": "' + (SELECT [AssessedOn] FROM OPENJSON(p.[Metadata]) WITH ( [AssessedOn] NVARCHAR(20) '$.AssessedOn')) + '", ' +
    '"InitialNotificationSentOn": "' + (SELECT [InitialNotificationSentOn] FROM OPENJSON(p.[Metadata]) WITH ( [InitialNotificationSentOn] NVARCHAR(20) '$.InitialNotificationSentOn')) + '", ' +
    '"ThirtyDayNotificationSentOn": "' + (SELECT [ThirtyDayNotificationSentOn] FROM OPENJSON(p.[Metadata]) WITH ( [ThirtyDayNotificationSentOn] NVARCHAR(20) '$.ThirtyDayNotificationSentOn')) + '", ' +
    '"SixtyDayNotificationSentOn": "' + (SELECT [SixtyDayNotificationSentOn] FROM OPENJSON(p.[Metadata]) WITH ( [SixtyDayNotificationSentOn] NVARCHAR(20) '$.SixtyDayNotificationSentOn')) + '", ' +
    '"NinetyDayNotificationSentOn": "' + (SELECT [NinetyDayNotificationSentOn] FROM OPENJSON(p.[Metadata]) WITH ( [NinetyDayNotificationSentOn] NVARCHAR(20) '$.NinetyDayNotificationSentOn')) + '", ' +
    '"OnHoldNotificationSentOn": "' + (SELECT [OnHoldNotificationSentOn] FROM OPENJSON(p.[Metadata]) WITH ( [OnHoldNotificationSentOn] NVARCHAR(20) '$.OnHoldNotificationSentOn')) + '", ' +
    '"TransferredWithinGreOn": "' + (SELECT [TransferredWithinGreOn] FROM OPENJSON(p.[Metadata]) WITH ( [TransferredWithinGreOn] NVARCHAR(20) '$.TransferredWithinGreOn')) + '", ' +
    '"ClearanceNotificationSentOn": "' + (SELECT [ClearanceNotificationSentOn] FROM OPENJSON(p.[Metadata]) WITH ( [ClearanceNotificationSentOn] NVARCHAR(20) '$.ClearanceNotificationSentOn'))+ '", ' +
    '"MarketedOn": "' + (SELECT [MarketedOn] FROM OPENJSON(p.[Metadata]) WITH ( [MarketedOn] NVARCHAR(20) '$.MarketedOn')) + '", ' +
    '"Purchaser": "' + (SELECT [Purchaser] FROM OPENJSON(p.[Metadata]) WITH ( [Purchaser] NVARCHAR(MAX) '$.Purchaser')) + '", ' +
    '"IsContractConditional": ' + (CASE WHEN (SELECT [IsContractConditional] FROM OPENJSON(p.[Metadata]) WITH ( [IsContractConditional] BIT '$.IsContractConditional')) = 1 THEN 'true' ELSE 'false' END) + ', ' +
    '"OfferAcceptedOn": "' + (SELECT [OfferAcceptedOn] FROM OPENJSON(p.[Metadata]) WITH ( [OfferAcceptedOn] NVARCHAR(20) '$.OfferAcceptedOn')) + '", ' +
    '"AdjustedOn": "' + (SELECT [AdjustedOn] FROM OPENJSON(p.[Metadata]) WITH ( [AdjustedOn] NVARCHAR(20) '$.AdjustedOn')) + '", ' +
    '"DisposedOn": "' + (SELECT [DisposedOn] FROM OPENJSON(p.[Metadata]) WITH ( [DisposedOn] NVARCHAR(20) '$.DisposedOn')) + '", ' +

    '"AppraisedBy": "' + (SELECT [AppraisedBy] FROM OPENJSON(p.[Metadata]) WITH ( [AppraisedBy] NVARCHAR(MAX) '$.AppraisedBy')) + '", ' +
    '"AppraisedOn": "' + (SELECT [AppraisedOn] FROM OPENJSON(p.[Metadata]) WITH ( [AppraisedOn] NVARCHAR(20) '$.AppraisedOn')) + '", ' +
    '"SalesCost": ' + CAST((SELECT [SalesCost] FROM OPENJSON(p.[Metadata]) WITH ( [SalesCost] MONEY '$.SalesCost')) AS NVARCHAR) + ', ' +
    '"NetProceeds": ' + CAST((SELECT [NetProceeds] FROM OPENJSON(p.[Metadata]) WITH ( [NetProceeds] MONEY '$.NetProceeds')) AS NVARCHAR) + ', ' +
    '"ProgramCost": ' + CAST((SELECT [ProgramCost] FROM OPENJSON(p.[Metadata]) WITH ( [ProgramCost] MONEY '$.ProgramCost')) AS NVARCHAR) + ', ' +
    '"GainLoss": ' + CAST((SELECT [GainLoss] FROM OPENJSON(p.[Metadata]) WITH ( [GainLoss] MONEY '$.GainLoss')) AS NVARCHAR) + ', ' +
    '"SppCapitalization": ' + CAST((SELECT [SppCapitalization] FROM OPENJSON(p.[Metadata]) WITH ( [SppCapitalization] MONEY '$.SppCapitalization')) AS NVARCHAR) + ', ' +
    '"GainBeforeSpp": ' + CAST((SELECT [GainBeforeSpp] FROM OPENJSON(p.[Metadata]) WITH ( [GainBeforeSpp] MONEY '$.GainBeforeSpp')) AS NVARCHAR) + ', ' +
    '"GainAfterSpp": ' + CAST((SELECT [GainAfterSpp] FROM OPENJSON(p.[Metadata]) WITH ( [GainAfterSpp] MONEY '$.GainAfterSpp')) AS NVARCHAR) + ', ' +
    '"OcgFinancialStatement": ' + CAST((SELECT [OcgFinancialStatement] FROM OPENJSON(p.[Metadata]) WITH ( [OcgFinancialStatement] MONEY '$.OcgFinancialStatement')) AS NVARCHAR) + ', ' +
    '"InterestComponent": ' + CAST((SELECT [InterestComponent] FROM OPENJSON(p.[Metadata]) WITH ( [InterestComponent] MONEY '$.InterestComponent')) AS NVARCHAR) + ', ' +
    '"OfferAmount": ' + CAST((SELECT [OfferAmount] FROM OPENJSON(p.[Metadata]) WITH ( [OfferAmount] MONEY '$.OfferAmount')) AS NVARCHAR) + ', ' +
    '"SaleWithLeaseInPlace": ' + (CASE WHEN (SELECT [SaleWithLeaseInPlace] FROM OPENJSON(p.[Metadata]) WITH ( [SaleWithLeaseInPlace] BIT '$.SaleWithLeaseInPlace')) = 1 THEN 'true' ELSE 'false' END) + ', ' +

    '"Realtor": "' + (SELECT [Realtor] FROM OPENJSON(p.[Metadata]) WITH ( [Realtor] NVARCHAR(MAX) '$.Realtor')) + '", ' +
    '"RealtorRate": "' + (SELECT [RealtorRate] FROM OPENJSON(p.[Metadata]) WITH ( [RealtorRate] NVARCHAR(MAX) '$.RealtorRate')) + '", ' +
    '"RealtorCommission": ' + CAST((SELECT [RealtorCommission] FROM OPENJSON(p.[Metadata]) WITH ( [RealtorCommission] MONEY '$.RealtorCommission')) AS NVARCHAR) + ', ' +

    '"Remediation": "' + (SELECT [Remediation] FROM OPENJSON(p.[Metadata]) WITH ( [Remediation] NVARCHAR(MAX) '$.Remediation')) + '", ' +
    '"PlannedFutureUse": "' + (SELECT [PlannedFutureUse] FROM OPENJSON(p.[Metadata]) WITH ( [PlannedFutureUse] NVARCHAR(MAX) '$.PlannedFutureUse')) + '", ' +

    '"PriorYearAdjustment": ' + (CASE WHEN (SELECT [PriorYearAdjustment] FROM OPENJSON(p.[Metadata]) WITH ( [PriorYearAdjustment] BIT '$.PriorYearAdjustment')) = 1 THEN 'true' ELSE 'false' END) + ', ' +
    '"PriorYearAdjustmentOn": "' + (SELECT [PriorYearAdjustmentOn] FROM OPENJSON(p.[Metadata]) WITH ( [PriorYearAdjustmentOn] NVARCHAR(20) '$.PriorYearAdjustmentOn')) + '", ' +
    '"PriorYearAdjustmentAmount": ' + CAST((SELECT [PriorYearAdjustmentAmount] FROM OPENJSON(p.[Metadata]) WITH ( [PriorYearAdjustmentAmount] MONEY '$.PriorYearAdjustmentAmount')) AS NVARCHAR) + ', ' +

    '"PreliminaryFormSignedOn": "' + (SELECT [PreliminaryFormSignedOn] FROM OPENJSON(p.[Metadata]) WITH ( [PreliminaryFormSignedOn] NVARCHAR(20) '$.PreliminaryFormSignedOn')) + '", ' +
    '"PreliminaryFormSignedBy": "' + (SELECT [PreliminaryFormSignedBy] FROM OPENJSON(p.[Metadata]) WITH ( [PreliminaryFormSignedBy] NVARCHAR(MAX) '$.PreliminaryFormSignedBy')) + '", ' +
    '"FinalFormSignedOn": "' + (SELECT [FinalFormSignedOn] FROM OPENJSON(p.[Metadata]) WITH ( [FinalFormSignedOn] NVARCHAR(20) '$.FinalFormSignedOn')) + '", ' +
    '"FinalFormSignedBy": "' + (SELECT [FinalFormSignedBy] FROM OPENJSON(p.[Metadata]) WITH ( [FinalFormSignedBy] NVARCHAR(MAX) '$.FinalFormSignedBy')) + '" }' END AS [Metadata]
INTO #Projects
FROM dbo.[Projects] p
