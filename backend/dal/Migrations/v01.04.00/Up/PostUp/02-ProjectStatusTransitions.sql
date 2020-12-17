PRINT 'Adding ProjectStatusTransitions'

INSERT INTO dbo.[ProjectStatusTransitions] (
    [FromWorkflowId]
    , [FromStatusId]
    , [Action]
    , [ToWorkflowId]
    , [ToStatusId]
    , [ValidateTasks]
) VALUES

-- Allow progression from Pre-Marketing to Contract in Place
(
    6 -- SPL
    , 40 -- Pre-Marketing
    , 'Contract in Place - Conditional'
    , 6 -- SPL
    , 42 -- Contract in Place - Conditional
    , 0
), (
    6 -- SPL
    , 40 -- Pre-Marketing
    , 'Contract in Place - Unconditional'
    , 6 -- SPL
    , 43 -- Contract in Place - Unconditional
    , 0
)

-- Update Contract in Place - Conditional
, (
    6 -- SPL
    , 42 -- Contract in Place - Conditional
    , 'Restart Marketing'
    , 6 -- SPL
    , 41 -- Marketing
    , 0
), (
    6 -- SPL
    , 42 -- Contract in Place - Conditional
    , 'Contract in Place - Unconditional'
    , 6 -- SPL
    , 43 -- Contract in Place - Unconditional
    , 1
)

-- Add new Contract in Place - Unconditional status
, (
    6 -- SPL
    , 41 -- Marketing
    , 'Contract in Place - Unconditional'
    , 6 -- SPL
    , 43 -- Contract in Place - Unconditional
    , 1
), (
    6 -- SPL
    , 43 -- Contract in Place - Unconditional
    , 'Dispose Externally'
    , 6 -- SPL
    , 32 -- Disposed
    , 1
), (
    6 -- SPL
    , 43 -- Contract in Place - Unconditional
    , 'Restart Marketing'
    , 6 -- SPL
    , 41 -- Marketing
    , 0
), (
    6 -- SPL
    , 43 -- Contract in Place - Unconditional
    , 'Restart Pre-Marketing'
    , 6 -- SPL
    , 40 -- Pre-Marketing
    , 0
), (
    6 -- SPL
    , 43 -- Contract in Place - Unconditional
    , 'Cancel Project'
    , 6 -- SPL
    , 23 -- Cancelled
    , 0
)

-- Provide way to remove from SPL.
, (
    6 -- SPL
    , 40 -- Pre-Marketing
    , 'Switch to not included in SPL'
    , 5 -- ERP
    , 22 -- Not in SPL
    , 0
)

-- Provide way to return to SPL
, (
    5 -- ERP
    , 22 -- Not in SPL
    , 'Switch to not included in SPL'
    , 6 -- SPL
    , 21 -- Approved for SPL
    , 0
)

, (
    5 -- ERP
    , 14 -- Approved for ERP
    , 'Approved for SPL'
    , 6 -- SPL
    , 21 -- Approved for SPL
    , 1
)

UPDATE dbo.[ProjectStatusTransitions]
SET
    [Action] = 'Contract in Place - Conditional'
WHERE
    [FromWorkflowId] = 6
    AND [FromStatusId] = 41
    AND [ToWorkflowId] = 6
    AND [ToStatusId] = 42
