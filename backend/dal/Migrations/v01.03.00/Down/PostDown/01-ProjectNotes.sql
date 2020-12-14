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

-- Update the project notes.
UPDATE p SET
    p.[Note] = p.[Note]
FROM dbo.[Projects] p
INNER JOIN #ProjectNotes n ON n.[ProjectId] = p.[Id] AND n.[NoteType] = @GeneralNote

UPDATE p SET
    p.[PublicNote] = p.[Note]
FROM dbo.[Projects] p
INNER JOIN #ProjectNotes n ON n.[ProjectId] = p.[Id] AND n.[NoteType] = @PublicNote

UPDATE p SET
    p.[PrivateNote] = p.[Note]
FROM dbo.[Projects] p
INNER JOIN #ProjectNotes n ON n.[ProjectId] = p.[Id] AND n.[NoteType] = @PrivateNote

UPDATE p SET
    p.[AppraisedNote] = p.[Note]
FROM dbo.[Projects] p
INNER JOIN #ProjectNotes n ON n.[ProjectId] = p.[Id] AND n.[NoteType] = @AppraisalNote

UPDATE p SET
    p.[OffersNote] = p.[Note]
FROM dbo.[Projects] p
INNER JOIN #ProjectNotes n ON n.[ProjectId] = p.[Id] AND n.[NoteType] = @OfferNote

UPDATE p SET
    p.[ExemptionRationale] = p.[Note]
FROM dbo.[Projects] p
INNER JOIN #ProjectNotes n ON n.[ProjectId] = p.[Id] AND n.[NoteType] = @ExemptionNote

DROP TABLE #ProjectNotes
