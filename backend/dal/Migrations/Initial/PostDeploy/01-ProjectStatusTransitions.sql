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
    , 6  -- Review
), (
    6 -- Review
    , 7 -- Submitted
), (
    7 -- Submitted
    , 8 -- Document Review
),
-- TODO: the following three rows are present because the simple review form is a single page not broken out into steps.
(
    7 -- Submitted
    , 12 -- Approved for SPL
), (
    7 -- Submitted
    , 11 -- Approved for ERP
), (
    7 -- Submitted
    , 13 -- Denied
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
), (
    11 -- Approved for ERP
    , 14 -- Cancelled
), (
    11 -- Approved for ERP
    , 15 -- On Hold
), (
    15 -- On Hold
    , 12 -- Approved for SPL
), (
    15 -- On Hold
    , 14 -- Cancelled
)
