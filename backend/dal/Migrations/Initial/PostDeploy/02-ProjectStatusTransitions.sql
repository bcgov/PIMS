PRINT 'Adding ProjectStatusTransitions'

INSERT INTO dbo.[ProjectStatusTransitions] (
    [FromWorkflowId]
    , [FromStatusId]
    , [Action]
    , [ToWorkflowId]
    , [ToStatusId]
) VALUES (
    1 -- SUBMIT-DISPOSAL
    , 1 -- Draft
    , 'Select Properties'
    , 1 -- SUBMIT-DISPOSAL
    , 2 -- Select Properties
), (
    1 -- SUBMIT-DISPOSAL
    , 2 -- Select Properties
    , 'Update Information'
    , 1 -- SUBMIT-DISPOSAL
    , 3 -- Update Information
), (
    1 -- SUBMIT-DISPOSAL
    , 3 -- Update Information
    , 'Provide Documentation'
    , 1 -- SUBMIT-DISPOSAL
    , 4 -- Required Documentation
), (
    1 -- SUBMIT-DISPOSAL
    , 4 -- Required Documentation
    , 'Gain Approval'
    , 1 -- SUBMIT-DISPOSAL
    , 5 -- Approval
), (
    1 -- SUBMIT-DISPOSAL
    , 5 -- Approval
    , 'Review'
    , 1 -- SUBMIT-DISPOSAL
    , 6  -- Review
), (
    1 -- SUBMIT-DISPOSAL
    , 6 -- Review
    , 'Submit'
    , 2 -- ASSESS-DISPOSAL
    , 7 -- Submitted
),(
    1 -- SUBMIT-DISPOSAL
    , 6 -- Review
    , 'Submit with Exemption'
    , 3 -- ASSESS-EXEMPTION
    , 8 -- Submitted with Exemption
)

-- Disposal Assessment

, (
    2 -- ASSESS-DISPOSAL
    , 7 -- Submitted
    , 'Review Documentation'
    , 2 -- ASSESS-DISPOSAL
    , 10 -- Document Review
), (
    2 -- ASSESS-DISPOSAL
    , 7 -- Submitted
    , 'Review Appraisal'
    , 2 -- ASSESS-DISPOSAL
    , 11 -- Appraisal Review
), (
    2 -- ASSESS-DISPOSAL
    , 7 -- Submitted
    , 'Begin First Nation Consultation'
    , 2 -- ASSESS-DISPOSAL
    , 12 -- First Nation Consultation
), (
    2 -- ASSESS-DISPOSAL
    , 7 -- Submitted
    , 'Approve for ERP'
    , 5 -- ERP
    , 14 -- Approved for ERP
), (
    2 -- ASSESS-DISPOSAL
    , 7 -- Submitted
    , 'Deny'
    , 2 -- ASSESS-DISPOSAL
    , 16 -- Denied
), (
    2 -- ASSESS-DISPOSAL
    , 10 -- Document Review
    , 'Review Appraisal'
    , 2 -- ASSESS-DISPOSAL
    , 11 -- Appraisal Review
), (
    2 -- ASSESS-DISPOSAL
    , 11 -- Appraisal Review
    , 'Begin First Nation Consultation'
    , 2 -- ASSESS-DISPOSAL
    , 12 -- First Nation Consultation
), (
    2 -- ASSESS-DISPOSAL
    , 12 -- First Nation Consultation
    , 'Approve for ERP'
    , 5 -- ERP
    , 14 -- Approved for ERP
), (
    2 -- ASSESS-DISPOSAL
    , 12 -- First Nation Consultation
    , 'Deny'
    , 2 -- ASSESS-DISPOSAL
    , 16 -- Denied
)

---- Exemption Assessment

, (
    3 -- ASSESS-EXEMPTION
    , 8 -- Submitted with Exemption
    , 'Review Documentation'
    , 3 -- ASSESS-EXEMPTION
    , 10 -- Document Review
), (
    3 -- ASSESS-EXEMPTION
    , 8 -- Submitted with Exemption
    , 'Review Appraisal'
    , 3 -- ASSESS-EXEMPTION
    , 11 -- Appraisal Review
), (
    3 -- ASSESS-EXEMPTION
    , 8 -- Submitted with Exemption
    , 'Begin First Nation Consultation'
    , 3 -- ASSESS-EXEMPTION
    , 12 -- First Nation Consultation
), (
    3 -- ASSESS-EXEMPTION
    , 8 -- Submitted with Exemption
    , 'Review Exemption'
    , 3 -- ASSESS-EXEMPTION
    , 13 -- Examption Review
), (
    3 -- ASSESS-EXEMPTION
    , 8 -- Submitted with Exemption
    , 'Approve Exemption'
    , 4 -- ASSESS-EX-DISPOSAL
    , 15 -- Approved for Exemption
), (
    3 -- ASSESS-EXEMPTION
    , 8 -- Submitted with Exemption
    , 'Deny Exemption'
    , 3 -- ASSESS-EXEMPTION
    , 16 -- Denied
)

, (
    3 -- ASSESS-EXEMPTION
    , 10 -- Document Review
    , 'Review Appraisal'
    , 3 -- ASSESS-EXEMPTION
    , 11 -- Appraisal Review
), (
    3 -- ASSESS-EXEMPTION
    , 11 -- Appraisal Review
    , 'Begin First Nation Consulation'
    , 3 -- ASSESS-EXEMPTION
    , 12 -- First Nation Consultation
), (
    3 -- ASSESS-EXEMPTION
    , 12 -- First Nation Consultation
    , 'Review Exemption'
    , 3 -- ASSESS-EXEMPTION
    , 13 -- Exemption Review
), (
    3 -- ASSESS-EXEMPTION
    , 13 -- Exemption Review
    , 'Approve Exemption'
    , 4 -- ASSESS-EX-DISPOSAL
    , 15 -- Approved for Exemption
), (
    3 -- ASSESS-EXEMPTION
    , 13 -- Exemption Review
    , 'Deny Exemption'
    , 3 -- ASSESS-EXEMPTION
    , 16 -- Denied
)

---- Disposal Exemption Assessment
---- When an exemption is approved the request still needs to be reviewed and assessed.

, (
    4 -- ASSESS-EX-DISPOSAL
    , 15 -- Approved for Exemption
    , 'Transfer within GRE'
    , 4 -- ASSESS-EX-DISPOSAL
    , 20 -- Transferred within GRE
), (
    4 -- ASSESS-EX-DISPOSAL
    , 15 -- Approved for Exemption
    , 'Approve for SPL'
    , 6 -- SPL
    , 21 -- Approved for SPL
), (
    4 -- ASSESS-EX-DISPOSAL
    , 15 -- Approved for Exemption
    , 'Approve to not include in SPL'
    , 4 -- ASSESS-EX-DISPOSAL
    , 22 -- Not in SPL
),(
    4 -- ASSESS-EX-DISPOSAL
    , 15 -- Approved for Exemption
    , 'Cancel Project'
    , 4 -- ASSESS-EX-DISPOSAL
    , 23 -- Cancelled
), (
    4 -- ASSESS-EX-DISPOSAL
    , 22 -- Not in SPL
    , 'Dispose Externally'
    , 4 -- ASSESS-EX-DISPOSAL
    , 32 -- Disposed
), (
    4 -- ASSESS-EX-DISPOSAL
    , 15 -- Approved for Exemption
    , 'Approve for Enhanced Referral Process'
    , 5 -- ERP
    , 14 -- Approved ERP
    )

---- ERP

, (
    5 -- ERP
    , 14 -- Approved for ERP
    , 'Begin ERP'
    , 5 -- ERP
    , 30 -- In ERP
), (
    5 -- ERP
    , 14 -- Approved for ERP
    , 'Place on Hold'
    , 5 -- ERP
    , 31 -- On Hold
), (
    5 -- ERP
    , 14 -- Approved for ERP
    , 'Transfer within GRE'
    , 5 -- ERP
    , 20 -- Transferred within GRE
), (
    5 -- ERP
    , 14 -- Approved for ERP
    , 'Approve for SPL'
    , 6 -- SPL
    , 21 -- Approved for SPL
), (
    5 -- ERP
    , 14 -- Approved for ERP
    , 'Approve to not include in SPL'
    , 5 -- ERP
    , 22 -- Not in SPL
), (
    5 -- ERP
    , 14 -- Approved for ERP
    , 'Cancel Project'
    , 5 -- ERP
    , 23 -- Cancelled
), (
    5 -- ERP
    , 14 -- Approved for ERP
    , 'Dispose Externally'
    , 5 -- ERP
    , 32 -- Disposed
)

, (
    5 -- ERP
    , 30 -- In ERP
    , 'Place on Hold'
    , 5 -- ERP
    , 31 -- On Hold
), (
    5 -- ERP
    , 30 -- In ERP
    , 'Transfer within GRE'
    , 5 -- ERP
    , 20 -- Transferred within GRE
), (
    5 -- ERP
    , 30 -- In ERP
    , 'Approve for SPL'
    , 6 -- SPL
    , 21 -- Approved for SPL
), (
    5 -- ERP
    , 30 -- In ERP
    , 'Approve to not include in SPL'
    , 5 -- ERP
    , 22 -- Not in SPL
), (
    5 -- ERP
    , 30 -- In ERP
    , 'Cancel Project'
    , 5 -- ERP
    , 23 -- Cancelled
), (
    5 -- ERP
    , 30 -- In ERP
    , 'Dispose Externally'
    , 5 -- ERP
    , 32 -- Disposed
)

, (
    5 -- ERP
    , 31 -- On Hold
    , 'Begin ERP'
    , 5 -- ERP
    , 30 -- In ERP
), (
    5 -- ERP
    , 31 -- On Hold
    , 'Transfer within GRE'
    , 5 -- ERP
    , 20 -- Transferred within GRE
), (
    5 -- ERP
    , 31 -- On Hold
    , 'Approve for SPL'
    , 6 -- SPL
    , 21 -- Approved for SPL
), (
    5 -- ERP
    , 31 -- On Hold
    , 'Approve to not include in SPL'
    , 5 -- ERP
    , 22 -- Not in SPL
), (
    5 -- ERP
    , 31 -- On Hold
    , 'Cancel Project'
    , 5 -- ERP
    , 23 -- Cancelled
), (
    5 -- ERP
    , 31 -- On Hold
    , 'Dispose Externally'
    , 5 -- ERP
    , 32 -- Disposed
)

-- SPL

, (
    6 -- SPL
    , 21 -- Approved for SPL
    , 'Begin Pre-Marketing'
    , 6 -- SPL
    , 40 -- Pre-Marketing
), (
    6 -- SPL
    , 21 -- Approved for SPL
    , 'Cancel Project'
    , 6 -- SPL
    , 23 -- Cancelled
), (
    6 -- SPL
    , 40 -- Pre-Marketing
    , 'Begin Marketing'
    , 6 -- SPL
    , 41 -- Marketing
), (
    6 -- SPL
    , 40 -- Pre-Marketing
    , 'Cancel Project'
    , 6 -- SPL
    , 23 -- Cancelled
), (
    6 -- SPL
    , 41 -- Marketing
    , 'Contract in Place'
    , 6 -- SPL
    , 42 -- Contract in Place
), (
    6 -- SPL
    , 41 -- Marketing
    , 'Cancel Project'
    , 6 -- SPL
    , 23 -- Cancelled
), (
    6 -- SPL
    , 42 -- Contract in Place
    , 'Dispose Externally'
    , 6 -- SPL
    , 32 -- Disposed
), (
    6 -- SPL
    , 42 -- Contract in Place
    , 'Restart Pre-Marketing'
    , 6 -- SPL
    , 40 -- Pre-Marketing
), (
    6 -- SPL
    , 42 -- Contract in Place
    , 'Cancel Project'
    , 6 -- SPL
    , 23 -- Cancelled
)
