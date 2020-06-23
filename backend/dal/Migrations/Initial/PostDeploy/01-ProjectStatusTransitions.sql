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
    , 9 -- Document Review
),
-- TODO: the following three rows are present because the simple review form is a single page not broken out into steps.
(
    7 -- Submitted
    , 14 -- Approved for SPL
), (
    7 -- Submitted
    , 13 -- Approved for ERP
), (
    7 -- Submitted
    , 16 -- Denied
), (
    9 -- Document Review
    , 10 -- Appraisal Review
), (
    9 -- Document Review
    , 16-- Denied
), (
    10 -- Appraisal Review
    , 11 -- First Nation Consultation
), (
    10 -- Appraisal Review
    , 16 -- Denied
), (
    11 -- First Nation Consultation
    , 13 -- Approved for ERP
), (
    11 -- First Nation Consultation
    , 14 -- Approved for SPL
), (
    11 -- First Nation Consultation
    , 16 -- Denied
), (
    13 -- Approved for ERP
    , 18 -- On Hold
), (
    18 -- On Hold
    , 14 -- Approved for SPL
), (
    18 -- On Hold
    , 17 -- Cancelled
), (
    13 -- Approved for ERP
    , 17 -- Cancelled
), (
    13 -- Approved for ERP
    , 19 -- Transferred within the GRE
),(
    18 -- On Hold
    , 19 -- Transferred within the GRE 
),(
    6 -- Review
    , 8 -- Submitted with exemption
), (
    8 -- Submitted with exemption
    , 9 -- Documentation Review
), (
    8 -- Submitted with exemption
    , 15 -- Approved for exemption
), (
    11 -- First Nation Consultation 
    , 15 -- Approved for exemption
), (
    8 -- Submitted with Exemption
    , 16 -- Denied
), (
    15 -- Approved for Exemption
    , 17 -- Cancelled
)
