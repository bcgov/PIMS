PRINT 'Adding ProjectStatusTransitions'

INSERT INTO dbo.[ProjectStatusTransitions] (
    [StatusId]
    , [ToStatusId]
) VALUES (
    1 -- Draft
    , 2 -- Select Properties
), (
    2 -- Select Properties
    , 3 -- Update Information
), (
    3 -- Update Information
    , 4 -- Required Documentation
), (
    4 -- Required Documentation
    , 5 -- Approval
), (
    5 -- Approval
    , 6  -- Submitted
), (
    6 -- Submitted
    , 7 -- Property Review
), (
    7 -- Property Review
    , 8 -- Document Review
), (
    7 -- Property Review
    , 12 -- Denied
), (
    8 -- Document Review
    , 9 -- Appraisal Review
), (
    8 -- Document Review
    , 13 -- Denied
), (
    9 -- Appraisal Review
    , 10 -- First Nation Consultation
), (
    9 -- Appraisal Review
    , 13 -- Denied
), (
    10 -- First Nation Consultation
    , 11 -- Approved for ERP
), (
    10 -- First Nation Consultation
    , 12 -- Approved for SPL
), (
    10 -- First Nation Consultation
    , 13 -- Denied
)
