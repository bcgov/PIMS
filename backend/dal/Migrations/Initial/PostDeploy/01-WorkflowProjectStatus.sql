PRINT 'Adding WorkflowProjectStatus'

INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
) VALUES (
    1 -- Submit Surplus Property Process Project
    , 1 -- Draft
), (
    1 -- Submit Surplus Property Process Project
    , 2 -- Select Properties
), (
    1 -- Submit Surplus Property Process Project
    , 3 -- Update Information
), (
    1 -- Submit Surplus Property Process Project
    , 4 -- Required Documentation
), (
    1 -- Submit Surplus Property Process Project
    , 5 -- Approval
), (
    1 -- Submit Surplus Property Process Project
    , 6 -- Submitted
), (
    2 -- Access Surplus Property Process Project
    , 7 -- Property Review
), (
    2 -- Access Surplus Property Process Project
    , 8 -- Document Review
), (
    2 -- Access Surplus Property Process Project
    , 9 -- Appraisal Review
), (
    2 -- Access Surplus Property Process Project
    , 10 -- First Nation Consultation
), (
    2 -- Access Surplus Property Process Project
    , 11 -- Approved for ERP
), (
    2 -- Access Surplus Property Process Project
    , 12 -- Approved for SPL
), (
    2 -- Access Surplus Property Process Project
    , 13 -- Denied
)

