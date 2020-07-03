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
),(
    6 -- Review
    , 8 -- Submitted with Exemption
)

-- Assessment
-- Handles both standard requests and exemptions.

, (
    7 -- Submitted
    , 10 -- Document Review
), (
    7 -- Submitted
    , 11 -- Appraisal Review
), (
    7 -- Submitted
    , 12 -- First Nation Consultation
), (
    7 -- Submitted
    , 13 -- Examption Review
), (
    7 -- Submitted
    , 14 -- Approved for ERP
), (
    7 -- Submitted
    , 15 -- Approved for Exemption
), (
    7 -- Submitted
    , 16 -- Denied
), (
    10 -- Document Review
    , 11 -- Appraisal Review
), (
    11 -- Appraisal Review
    , 12 -- First Nation Consultation
), (
    12 -- First Nation Consultation
    , 13 -- Exemption Review
), (
    13 -- Exemption Review
    , 15 -- Approved for Exemption
), (
    12 -- First Nation Consultation
    , 14 -- Approved for ERP
), (
    12 -- First Nation Consultation
    , 16 -- Denied
)

-- Exemption
-- When an exemption is approved the request still needs to be reviewed and assessed.

, (
    15 -- Approved for Exemption
    , 20 -- Transferred within GRE
), (
    15 -- Approved for Exemption
    , 21 -- Approved for SPL
), (
    15 -- Approved for Exemption
    , 22 -- Not in SPL
),(
    15 -- Approved for Exemption
    , 23 -- Cancelled
), (
    22 -- Not in SPL
    , 31 -- Disposed
)

-- ERP

, (
    14 -- Approved for ERP
    , 30 -- On Hold
), (
    14 -- Approved for ERP
    , 20 -- Transferred within GRE
), (
    14 -- Approved for ERP
    , 21 -- Approved for SPL
), (
    14 -- Approved for ERP
    , 22 -- Not in SPL
), (
    14 -- Approved for ERP
    , 23 -- Cancelled
), (
    14 -- Approved for ERP
    , 31 -- Disposed
)

, (
    30 -- On Hold
    , 15 -- Approved for ERP
), (
    30 -- On Hold
    , 20 -- Transferred within GRE
), (
    30 -- On Hold
    , 21 -- Approved for SPL
), (
    30 -- On Hold
    , 22 -- Not in SPL
), (
    30 -- On Hold
    , 23 -- Cancelled
), (
    30 -- On Hold
    , 31 -- Disposed
)

-- SPL

, (
    21 -- Approved for SPL
    , 40 -- Pre-Marketing
), (
    21 -- Approved for SPL
    , 41 -- Marketing
), (
    21 -- Approved for SPL
    , 42 -- Contract in Place
), (
    21 -- Approved for SPL
    , 43 -- Disposed
), (
    21 -- Approved for SPL
    , 23 -- Cancelled
)

, (
    40 -- Pre-Marketing
    , 41 -- Marketing
), (
    41 -- Marketing
    , 42 -- Contract in Place
), (
    42 -- Contract in Place
    , 43 -- Disposed
), (
    42 -- Approved for SPL
    , 23 -- Cancelled
)
