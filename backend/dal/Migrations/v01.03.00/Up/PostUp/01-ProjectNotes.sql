PRINT 'Update ProjectNotes'

DECLARE @GeneralNote INT = 0;
DECLARE @PublicNote INT = 1;
DECLARE @PrivateNote INT = 2;
DECLARE @ExemptionNote INT = 3;
DECLARE @AgencyInterestNote INT = 4;
DECLARE @FinancialNote INT = 5;
DECLARE @PreMarketingNote INT = 6;
DECLARE @MarketingNote INT = 7;
DECLARE @ContractInPlaceNote INT = 8;
DECLARE @ReportingNote INT = 9;
DECLARE @LoanTermsNote INT = 10;
DECLARE @AdjustmentNote INT = 11;
DECLARE @SplCostNote INT = 12;
DECLARE @SplGainNote INT = 13;
DECLARE @SalesHistoryNote INT = 14;
DECLARE @CloseOutNote INT = 15;
DECLARE @CommentsNote INT = 16;
DECLARE @AppraisalNote INT = 17;
DECLARE @OfferNote INT = 18;

-- Add the project notes.
INSERT INTO dbo.[ProjectNotes] (
    [ProjectId]
    , [NoteType]
    , [Note]
)
SELECT
    [Id]
    , @GeneralNote
    , ISNULL([General], '')
FROM #ProjectNotes

INSERT INTO dbo.[ProjectNotes] (
    [ProjectId]
    , [NoteType]
    , [Note]
)
SELECT
    [Id]
    , @PublicNote
    , ISNULL([Public], '')
FROM #ProjectNotes

INSERT INTO dbo.[ProjectNotes] (
    [ProjectId]
    , [NoteType]
    , [Note]
)
SELECT
    [Id]
    , @PrivateNote
    , ISNULL([Private], '')
FROM #ProjectNotes

INSERT INTO dbo.[ProjectNotes] (
    [ProjectId]
    , [NoteType]
    , [Note]
)
SELECT
    [Id]
    , @AppraisalNote
    , ISNULL([Appraisal], '')
FROM #ProjectNotes

INSERT INTO dbo.[ProjectNotes] (
    [ProjectId]
    , [NoteType]
    , [Note]
)
SELECT
    [Id]
    , @OfferNote
    , ISNULL([Offer], '')
FROM #ProjectNotes

INSERT INTO dbo.[ProjectNotes] (
    [ProjectId]
    , [NoteType]
    , [Note]
)
SELECT
    [Id]
    , @ExemptionNote
    , ISNULL([Exemption], '')
FROM #ProjectNotes

DROP TABLE #ProjectNotes
