PRINT 'Adding WorkflowProjectStatus'

INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
) VALUES (
    1 -- SUBMIT-DISPOSAL
    , 1 -- Draft,
    , 0
), (
    1 -- SUBMIT-DISPOSAL
    , 2 -- Select Properties
    , 0
), (
    1 -- SUBMIT-DISPOSAL
    , 3 -- Update Information
    , 0
), (
    1 -- SUBMIT-DISPOSAL
    , 4 -- Required Documentation
    , 0
), (
    1 -- SUBMIT-DISPOSAL
    , 5 -- Approval
    , 0
), (
    1 -- SUBMIT-DISPOSAL
    , 6 -- Review
    , 0
), (
    1 -- SUBMIT-DISPOSAL
    , 7 -- Submitted
    , 1
), (
    1 -- SUBMIT-DISPOSAL
    , 8 -- Submitted Exemption
    , 1
)

-- Assessment

, (
    2 -- ASSESS-DISPOSAL
    , 7 -- Submitted
    , 0
), (
    2 -- ASSESS-DISPOSAL
    , 10 -- Document Review
    , 0
), (
    2 -- ASSESS-DISPOSAL
    , 11 -- Appraisal Review
    , 0
), (
    2 -- ASSESS-DISPOSAL
    , 12 -- First Nation Consultation
    , 0
), (
    2 -- ASSESS-DISPOSAL
    , 14 -- Approved for ERP
    , 1
), (
    2 -- ASSESS-DISPOSAL
    , 16 -- Denied
    , 1
)

-- Exemption

, (
    3 -- ASSESS-EXEMPTION
    , 8 -- Submitted Exemption
    , 0
), (
    3 -- ASSESS-EXEMPTION
    , 10 -- Document Review
    , 0
), (
    3 -- ASSESS-EXEMPTION
    , 11 -- Appraisal Review
    , 0
), (
    3 -- ASSESS-EXEMPTION
    , 12 -- First Nation Consultation
    , 0
), (
    3 -- ASSESS-EXEMPTION
    , 13 -- Exemption Review
    , 0
), (
    3 -- ASSESS-EXEMPTION
    , 15 -- Approved for Exemption
    , 1
), (
    3 -- ASSESS-EXEMPTION
    , 16 -- Denied
    , 1
)

-- Exemption Assessment

, (
    3 -- ASSESS-EXEMPTION
    , 20 -- Transferred within GRE
    , 1
), (
    3 -- ASSESS-EXEMPTION
    , 21 -- Approved for SPL
    , 1
), (
    3 -- ASSESS-EXEMPTION
    , 22 -- Not in SPL
    , 1
), (
    3 -- ASSESS-EXEMPTION
    , 23 -- Cancelled
    , 1
), (
    3 -- ASSESS-EXEMPTION
    , 31 -- Disposed
    , 1
)

-- ERP

, (
    4 -- ERP
    , 14 -- Approved for ERP
    , 0
), (
    4 -- ERP
    , 30 -- On Hold
    , 0
), (
    4 -- ERP
    , 20 -- Transferred within GRE
    , 1
), (
    4 -- ERP
    , 21 -- Approved for SPL
    , 1
), (
    4 -- ERP
    , 22 -- Not in SPL
    , 1
), (
    4 -- ERP
    , 31 -- Disposed
    , 1
), (
    4 -- ERP
    , 23 -- Cancelled
    , 1
)

-- SPL

, (
    5 -- SPL
    , 21 -- Approved for SPL
    , 0
), (
    5 -- SPL
    , 40 -- Pre-Marketing
    , 0
), (
    5 -- SPL
    , 41 -- Marketing
    , 0
), (
    5 -- SPL
    , 42 -- Contract in Place
    , 0
), (
    5 -- SPL
    , 43 -- Disposed
    , 1
), (
    5 -- SPL
    , 23 -- Cancelled
    , 1
)
