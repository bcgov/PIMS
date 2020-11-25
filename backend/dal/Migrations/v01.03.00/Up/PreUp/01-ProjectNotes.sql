PRINT 'Backup Project Notes'

-- Create temporary table to store the note values
SELECT p.[Id]
    , p.[Note] AS [General]
    , p.[PublicNote] AS [Public]
    , p.[PrivateNote] AS [Private]
    , p.[AppraisedNote] AS [Appraisal]
    , p.[OffersNote] AS [Offer]
    , p.[ExemptionRationale] AS [Exemption]
INTO #ProjectNotes
FROM dbo.[Projects] p
