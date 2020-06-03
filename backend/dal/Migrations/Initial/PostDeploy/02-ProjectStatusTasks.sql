PRINT 'Adding ProjectStatusTasks'

INSERT INTO dbo.[ProjectStatusTasks] (
    [StatusId]
    , [TaskId]
) VALUES (
    4 -- Required Documentation
    , 1 -- Surplus Declaration & Readiness Checklist completed and sent
), (
    4 -- Required Documentation
    , 2  -- Triple Bottom Line completed and sent
), (
    7 -- Property Review
    , 3  -- Review completed
), (
    8 -- Document Review
    , 4  -- Documents received and review completed
), (
    9 -- Appraisal Review
    , 5  -- Appraisal ordered
), (
    9 -- Appraisal Review
    , 6  -- Appraisal received
), (
    9 -- Appraisal Review
    , 7  -- Appraisal completed
), (
    10 -- First Nation Consultation
    , 8  -- Strength of Claim
), (
    10 -- First Nation Consultation
    , 9  -- In consultation
), (
    10 -- First Nation Consultation
    , 10  -- Agreement received
)

