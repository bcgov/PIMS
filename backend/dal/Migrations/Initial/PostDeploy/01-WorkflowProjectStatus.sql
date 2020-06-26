PRINT 'Adding WorkflowProjectStatus'

INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
) VALUES (
    1 -- SUBMIT-DISPOSAL
    , 1 -- Draft
), (
    1 -- SUBMIT-DISPOSAL
    , 2 -- Select Properties
), (
    1 -- SUBMIT-DISPOSAL
    , 3 -- Update Information
), (
    1 -- SUBMIT-DISPOSAL
    , 4 -- Required Documentation
), (
    1 -- SUBMIT-DISPOSAL
    , 5 -- Approval
), (
    1 -- SUBMIT-DISPOSAL
    , 6 -- Submitted
), (
    2 -- ASSESS-DISPOSAL
    , 7 -- Property Review
), (
    2 -- ASSESS-DISPOSAL
    , 9 -- Document Review
), (
    2 -- ASSESS-DISPOSAL
    , 10 -- Appraisal Review
), (
    2 -- ASSESS-DISPOSAL
    , 11 -- First Nation Consultation
), (
    2 -- ASSESS-DISPOSAL
    , 13 -- Approved for ERP
), (
    2 -- ASSESS-DISPOSAL
    , 14 -- Approved for SPL
), (
    2 -- ASSESS-DISPOSAL
    , 16 -- Denied
), (
    2 -- ASSESS-DISPOSAL
    , 17 -- Cancelled
), (
    2 -- ASSESS-DISPOSAL
    , 18 -- On Hold
), (
    2 -- ASSESS-DISPOSAL
    , 19 -- Transferred to GRE
),(
    3 -- ASSESS-EXEMPTION
    , 8 -- Submitted with exemption
), (
    3 -- ASSESS-EXEMPTION
    , 9 -- Documentation Review
), (
    3 -- ASSESS-EXEMPTION
    , 10 -- Appraisal Review
), (
    3 -- ASSESS-EXEMPTION
    , 11 -- First Nation Consultation
), (
    3 -- ASSESS-EXEMPTION
    , 12 -- Exemption Process
), (
    3 -- ASSESS-EXEMPTION
    , 15 -- Approved for Exemption
), (
    3 -- ASSESS-EXEMPTION
    , 16 -- Denied
)

