PRINT 'Adding WorkflowProjectStatus'

INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
) VALUES (
    1 -- SUBMIT-DISPOSAL
    , 1 -- Draft,
    , 0
    , 0
), (
    1 -- SUBMIT-DISPOSAL
    , 2 -- Select Properties
    , 0
    , 1
), (
    1 -- SUBMIT-DISPOSAL
    , 3 -- Update Information
    , 0
    , 2
), (
    1 -- SUBMIT-DISPOSAL
    , 4 -- Required Documentation
    , 0
    , 3
), (
    1 -- SUBMIT-DISPOSAL
    , 5 -- Approval
    , 0
    , 4
), (
    1 -- SUBMIT-DISPOSAL
    , 6 -- Review
    , 0
    , 5
)

-- Disposal Assessment

, (
    2 -- ASSESS-DISPOSAL
    , 7 -- Submitted
    , 0
    , 0
), (
    2 -- ASSESS-DISPOSAL
    , 10 -- Document Review
    , 0
    , 1
), (
    2 -- ASSESS-DISPOSAL
    , 11 -- Appraisal Review
    , 0
    , 2
), (
    2 -- ASSESS-DISPOSAL
    , 12 -- First Nation Consultation
    , 0
    , 3
), (
    2 -- ASSESS-DISPOSAL
    , 16 -- Denied
    , 1
    , 4
)

-- Exemption Assessment

, (
    3 -- ASSESS-EXEMPTION
    , 8 -- Submitted Exemption
    , 0
    , 0
), (
    3 -- ASSESS-EXEMPTION
    , 10 -- Document Review
    , 0
    , 1
), (
    3 -- ASSESS-EXEMPTION
    , 11 -- Appraisal Review
    , 0
    , 2
), (
    3 -- ASSESS-EXEMPTION
    , 12 -- First Nation Consultation
    , 0
    , 3
), (
    3 -- ASSESS-EXEMPTION
    , 13 -- Exemption Review
    , 0
    , 4
), (
    3 -- ASSESS-EXEMPTION
    , 16 -- Denied
    , 1
    , 5
)

-- Exemption Disposal Assessment

, (
    4 -- ASSESS-EX-DISPOSAL
    , 15 -- Approved for Exemption
    , 0
    , 1
), (
    4 -- ASSESS-EX-DISPOSAL
    , 20 -- Transferred within GRE
    , 1
    , 2
), (
    4 -- ASSESS-EX-DISPOSAL
    , 22 -- Not in SPL
    , 1
    , 2
), (
    4 -- ASSESS-EX-DISPOSAL
    , 23 -- Cancelled
    , 1
    , 2
), (
    4 -- ASSESS-EX-DISPOSAL
    , 32 -- Disposed
    , 1
    , 3
)

-- ERP

, (
    5 -- ERP
    , 14 -- Approved for ERP
    , 0
    , 1
), (
    5 -- ERP
    , 30 -- In ERP
    , 0
    , 2
), (
    5 -- ERP
    , 31 -- On Hold
    , 0
    , 3
), (
    5 -- ERP
    , 20 -- Transferred within GRE
    , 1
    , 4
), (
    5 -- ERP
    , 22 -- Not in SPL
    , 1
    , 4
), (
    5 -- ERP
    , 32 -- Disposed
    , 1
    , 5
), (
    5 -- ERP
    , 23 -- Cancelled
    , 1
    , 4
)

-- SPL

, (
    6 -- SPL
    , 21 -- Approved for SPL
    , 0
    , 1
), (
    6 -- SPL
    , 40 -- Pre-Marketing
    , 0
    , 2
), (
    6 -- SPL
    , 41 -- Marketing
    , 0
    , 3
), (
    6 -- SPL
    , 42 -- Contract in Place
    , 0
    , 4
), (
    6 -- SPL
    , 32 -- Disposed
    , 1
    , 5
), (
    6 -- SPL
    , 23 -- Cancelled
    , 1
    , 5
)
