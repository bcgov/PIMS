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
    2 -- ACCESS-DISPOSAL
    , 7 -- Property Review
), (
    2 -- ACCESS-DISPOSAL
    , 8 -- Document Review
), (
    2 -- ACCESS-DISPOSAL
    , 9 -- Appraisal Review
), (
    2 -- ACCESS-DISPOSAL
    , 10 -- First Nation Consultation
), (
    2 -- ACCESS-DISPOSAL
    , 11 -- Approved for ERP
), (
    2 -- ACCESS-DISPOSAL
    , 12 -- Approved for SPL
), (
    2 -- ACCESS-DISPOSAL
    , 13 -- Denied
), (
    2 -- ACCESS-DISPOSAL
    , 14 -- Cancelled
), (
    2 -- ACCESS-DISPOSAL
    , 15 -- On Hold
), (
    2 -- ACCESS-DISPOSAL
    , 16 -- Transferred within the GRE
)

