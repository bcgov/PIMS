PRINT 'Backup Project Notes'

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

-- Create temporary table to store the note values
SELECT n.[ProjectId]
    , n.[NoteType]
    , n.[Note]
INTO #ProjectNotes
FROM dbo.[ProjectNotes] n
WHERE n.[NoteType] IN (@GeneralNote, @PublicNote, @PrivateNote, @AppraisalNote, @OfferNote, @ExemptionNote)
