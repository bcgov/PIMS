PRINT 'Backup Projects'

-- Create temporary table to store the project values
SELECT
    p.[Id]
    , (SELECT [ExemptionRequested] FROM OPENJSON(p.[Metadata]) WITH ([ExemptionRequested] NVARCHAR(MAX) '$.ExemptionRequested')) AS [ExemptionRequested]
    , (SELECT [AssessedOn] FROM OPENJSON(p.[Metadata]) WITH ([AssessedOn] NVARCHAR(20) '$.AssessedOn')) AS [AssessedOn]
    , (SELECT [InitialNotificationSentOn] FROM OPENJSON(p.[Metadata]) WITH ([InitialNotificationSentOn] NVARCHAR(20) '$.InitialNotificationSentOn')) AS [InitialNotificationSentOn]
    , (SELECT [ThirtyDayNotificationSentOn] FROM OPENJSON(p.[Metadata]) WITH ([ThirtyDayNotificationSentOn] NVARCHAR(20) '$.ThirtyDayNotificationSentOn')) AS [ThirtyDayNotificationSentOn]
    , (SELECT [SixtyDayNotificationSentOn] FROM OPENJSON(p.[Metadata]) WITH ([SixtyDayNotificationSentOn] NVARCHAR(20) '$.SixtyDayNotificationSentOn')) AS [SixtyDayNotificationSentOn]
    , (SELECT [NinetyDayNotificationSentOn] FROM OPENJSON(p.[Metadata]) WITH ([NinetyDayNotificationSentOn] NVARCHAR(20) '$.NinetyDayNotificationSentOn')) AS [NinetyDayNotificationSentOn]
    , (SELECT [OnHoldNotificationSentOn] FROM OPENJSON(p.[Metadata]) WITH ([OnHoldNotificationSentOn] NVARCHAR(20) '$.OnHoldNotificationSentOn')) AS [OnHoldNotificationSentOn]
    , (SELECT [TransferredWithinGreOn] FROM OPENJSON(p.[Metadata]) WITH ([TransferredWithinGreOn] NVARCHAR(20) '$.TransferredWithinGreOn')) AS [TransferredWithinGreOn]
    , (SELECT [ClearanceNotificationSentOn] FROM OPENJSON(p.[Metadata]) WITH ([ClearanceNotificationSentOn] NVARCHAR(20) '$.ClearanceNotificationSentOn')) AS [ClearanceNotificationSentOn]
    , (SELECT [MarketedOn] FROM OPENJSON(p.[Metadata]) WITH ([MarketedOn] NVARCHAR(20) '$.MarketedOn')) AS [MarketedOn]
    , (SELECT [Purchaser] FROM OPENJSON(p.[Metadata]) WITH ([Purchaser] NVARCHAR(MAX) '$.Purchaser')) AS [Purchaser]
    , (SELECT [IsContractConditional] FROM OPENJSON(p.[Metadata]) WITH ([IsContractConditional] BIT '$.IsContractConditional')) AS [IsContractConditional]
    , (SELECT [OfferAcceptedOn] FROM OPENJSON(p.[Metadata]) WITH ([OfferAcceptedOn] NVARCHAR(20) '$.OfferAcceptedOn')) AS [OfferAcceptedOn]
    , (SELECT [AdjustedOn] FROM OPENJSON(p.[Metadata]) WITH ([AdjustedOn] NVARCHAR(20) '$.AdjustedOn')) AS [AdjustedOn]
    , (SELECT [DisposedOn] FROM OPENJSON(p.[Metadata]) WITH ([DisposedOn] NVARCHAR(20) '$.DisposedOn')) AS [DisposedOn]

    , (SELECT [AppraisedBy] FROM OPENJSON(p.[Metadata]) WITH ([AppraisedBy] NVARCHAR(MAX) '$.AppraisedBy')) AS [AppraisedBy]
    , (SELECT [AppraisedOn] FROM OPENJSON(p.[Metadata]) WITH ([AppraisedOn] NVARCHAR(20) '$.AppraisedOn')) AS [AppraisedOn]
    , (SELECT [SalesCost] FROM OPENJSON(p.[Metadata]) WITH ([SalesCost] MONEY '$.SalesCost')) AS [SalesCost]
    , (SELECT [NetProceeds] FROM OPENJSON(p.[Metadata]) WITH ([NetProceeds] MONEY '$.NetProceeds')) AS [NetProceeds]
    , (SELECT [ProgramCost] FROM OPENJSON(p.[Metadata]) WITH ([ProgramCost] MONEY '$.ProgramCost')) AS [ProgramCost]
    , (SELECT [GainLoss] FROM OPENJSON(p.[Metadata]) WITH ([GainLoss] MONEY '$.GainLoss')) AS [GainLoss]
    , (SELECT [SppCapitalization] FROM OPENJSON(p.[Metadata]) WITH ([SppCapitalization] MONEY '$.SppCapitalization')) AS [SppCapitalization]
    , (SELECT [GainBeforeSpp] FROM OPENJSON(p.[Metadata]) WITH ([GainBeforeSpp] MONEY '$.GainBeforeSpp')) AS [GainBeforeSpp]
    , (SELECT [GainAfterSpp] FROM OPENJSON(p.[Metadata]) WITH ([GainAfterSpp] MONEY '$.GainAfterSpp')) AS [GainAfterSpp]
    , (SELECT [OcgFinancialStatement] FROM OPENJSON(p.[Metadata]) WITH ([OcgFinancialStatement] MONEY '$.OcgFinancialStatement')) AS [OcgFinancialStatement]
    , (SELECT [InterestComponent] FROM OPENJSON(p.[Metadata]) WITH ([InterestComponent] MONEY '$.InterestComponent')) AS [InterestComponent]
    , (SELECT [OfferAmount] FROM OPENJSON(p.[Metadata]) WITH ([OfferAmount] MONEY '$.OfferAmount')) AS [OfferAmount]
    , (SELECT [SaleWithLeaseInPlace] FROM OPENJSON(p.[Metadata]) WITH ([SaleWithLeaseInPlace] BIT '$.SaleWithLeaseInPlace')) AS [SaleWithLeaseInPlace]

    , (SELECT [Realtor] FROM OPENJSON(p.[Metadata]) WITH ([Realtor] NVARCHAR(MAX) '$.Realtor')) AS [Realtor]
    , (SELECT [RealtorRate] FROM OPENJSON(p.[Metadata]) WITH ([RealtorRate] NVARCHAR(MAX) '$.RealtorRate')) AS [RealtorRate]
    , (SELECT [RealtorCommission] FROM OPENJSON(p.[Metadata]) WITH ([RealtorCommission] MONEY '$.RealtorCommission')) AS [RealtorCommission]

    , (SELECT [Remediation] FROM OPENJSON(p.[Metadata]) WITH ([Remediation] NVARCHAR(MAX) '$.Remediation')) AS [Remediation]
    , (SELECT [PlannedFutureUse] FROM OPENJSON(p.[Metadata]) WITH ([PlannedFutureUse] NVARCHAR(MAX) '$.PlannedFutureUse')) AS [PlannedFutureUse]

    , (SELECT [PriorYearAdjustment] FROM OPENJSON(p.[Metadata]) WITH ([PriorYearAdjustment] BIT '$.PriorYearAdjustment')) AS [PriorYearAdjustment]
    , (SELECT [PriorYearAdjustmentOn] FROM OPENJSON(p.[Metadata]) WITH ([PriorYearAdjustmentOn] NVARCHAR(20) '$.PriorYearAdjustmentOn')) AS [PriorYearAdjustmentOn]
    , (SELECT [PriorYearAdjustmentAmount] FROM OPENJSON(p.[Metadata]) WITH ([PriorYearAdjustmentAmount] NVARCHAR(MAX) '$.PriorYearAdjustmentAmount')) AS [PriorYearAdjustmentAmount]

    , (SELECT [PreliminaryFormSignedOn] FROM OPENJSON(p.[Metadata]) WITH ([PreliminaryFormSignedOn] NVARCHAR(20) '$.PreliminaryFormSignedOn')) AS [PreliminaryFormSignedOn]
    , (SELECT [PreliminaryFormSignedBy] FROM OPENJSON(p.[Metadata]) WITH ([PreliminaryFormSignedBy] NVARCHAR(MAX) '$.PreliminaryFormSignedBy')) AS [PreliminaryFormSignedBy]
    , (SELECT [FinalFormSignedOn] FROM OPENJSON(p.[Metadata]) WITH ([FinalFormSignedOn] NVARCHAR(20) '$.FinalFormSignedOn')) AS [FinalFormSignedOn]
    , (SELECT [FinalFormSignedBy] FROM OPENJSON(p.[Metadata]) WITH ([FinalFormSignedBy] NVARCHAR(MAX) '$.FinalFormSignedBy')) AS [FinalFormSignedBy]
INTO #Projects
FROM dbo.[Projects] p
