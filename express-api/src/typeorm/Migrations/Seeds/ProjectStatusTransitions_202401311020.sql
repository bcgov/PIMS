INSERT INTO "project_status_transition" ("FromWorkflowId","FromStatusId","ToWorkflowId","ToStatusId","CreatedById","CreatedOn","UpdatedById","UpdatedOn","Action","ValidateTasks") VALUES
	 (1,1,1,2,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Select Properties',true);
	--  (1,2,1,3,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Update Information',true),
	--  (1,3,1,4,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Provide Documentation',true),
	--  (1,4,1,5,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Gain Approval',true),
	--  (1,5,1,6,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Review',true),
	--  (1,6,2,7,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Submit',true),
	--  (1,6,3,8,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Submit with Exemption',true),
	--  (2,7,2,10,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Review Documentation',true),
	--  (2,7,2,11,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Review Appraisal',true),
	--  (2,7,2,12,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Begin First Nation Consultation',true),
	--  (2,7,2,16,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Deny',false),
	--  (2,7,5,14,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Approve for ERP',true),
	--  (2,10,2,11,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Review Appraisal',true),
	--  (2,11,2,12,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Begin First Nation Consultation',true),
	--  (2,12,2,16,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Deny',false),
	--  (2,12,5,14,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Approve for ERP',true),
	--  (3,8,3,10,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Review Documentation',true),
	--  (3,8,3,11,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Review Appraisal',true),
	--  (3,8,3,12,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Begin First Nation Consultation',true),
	--  (3,8,3,13,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Review Exemption',true),
	--  (3,8,3,16,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Deny Exemption',false),
	--  (3,8,4,15,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Approve Exemption',true),
	--  (3,10,3,11,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Review Appraisal',true),
	--  (3,11,3,12,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Begin First Nation Consulation',true),
	--  (3,12,3,13,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Review Exemption',true),
	--  (3,13,3,16,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Deny Exemption',false),
	--  (3,13,4,15,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Approve Exemption',true),
	--  (4,15,4,20,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Transfer within GRE',true),
	--  (4,15,4,22,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Approve to not include in SPL',true),
	--  (4,15,4,23,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Cancel Project',false),
	--  (4,15,4,32,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:56.8000000',NULL,NULL,N'Dispose Project',false),
	--  (4,15,5,14,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Approve for Enhanced Referral Process',true),
	--  (4,15,6,21,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Approve for SPL',true),
	--  (4,22,4,20,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:56.3566667',NULL,NULL,N'Transfer within GRE',false),
	--  (4,22,4,23,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:56.8000000',NULL,NULL,N'Cancel Project',false),
	--  (4,22,4,32,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Dispose Externally',false),
	--  (4,22,5,14,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:56.8000000',NULL,NULL,N'Approve for Enhanced Referral Process',false),
	--  (4,22,6,21,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:56.8000000',NULL,NULL,N'Approve for SPL',false),
	--  (5,14,5,22,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:50.9133333',NULL,NULL,N'Proceed to Not in SPL',false),
	--  (5,14,5,23,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.8566667',NULL,NULL,N'Cancel Project',false),
	--  (5,14,5,30,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Begin ERP',true),
	--  (5,14,6,21,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.6866667',NULL,NULL,N'Approved for SPL',true),
	--  (5,22,5,14,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:56.8000000',NULL,NULL,N'Approved for ERP',false),
	--  (5,22,5,20,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:56.3566667',NULL,NULL,N'Transfer within GRE',false),
	--  (5,22,5,23,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.8566667',NULL,NULL,N'Cancel Project',false),
	--  (5,22,5,30,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:52.4733333',NULL,NULL,N'In ERP',false),
	--  (5,22,5,32,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:56.3566667',NULL,NULL,N'Dispose Project',false),
	--  (5,22,6,21,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.6866667',NULL,NULL,N'Switch to not included in SPL',false),
	--  (5,30,5,20,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Transfer within GRE',true),
	--  (5,30,5,22,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Approve to not include in SPL',true),
	--  (5,30,5,23,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Cancel Project',false),
	--  (5,30,5,31,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Place on Hold',true),
	--  (5,30,5,32,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Dispose Externally',true),
	--  (5,30,6,21,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Approve for SPL',true),
	--  (5,31,5,20,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Transfer within GRE',true),
	--  (5,31,5,22,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Approve to not include in SPL',true),
	--  (5,31,5,23,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Cancel Project',false),
	--  (5,31,5,30,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Begin ERP',true),
	--  (5,31,5,32,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Dispose Externally',true),
	--  (5,31,6,21,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Approve for SPL',true),
	--  (6,21,5,22,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:56.8000000',NULL,NULL,N'Remove from SPL',false),
	--  (6,21,6,20,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:47.5733333',NULL,NULL,N'Transfer within GRE',false),
	--  (6,21,6,23,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.8566667',NULL,NULL,N'Cancel Project',false),
	--  (6,21,6,40,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Begin Pre-Marketing',true),
	--  (6,40,5,22,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.6866667',NULL,NULL,N'Switch to not included in SPL',false),
	--  (6,40,6,20,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:47.5733333',NULL,NULL,N'Transfer within GRE',false),
	--  (6,40,6,23,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Cancel Project',false),
	--  (6,40,6,41,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Begin Marketing',true),
	--  (6,40,6,42,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.6866667',NULL,NULL,N'Contract in Place - Conditional',false),
	--  (6,40,6,43,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.6866667',NULL,NULL,N'Contract in Place - Unconditional',false),
	--  (6,41,5,22,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:56.8000000',NULL,NULL,N'Remove from SPL',false),
	--  (6,41,6,20,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:47.5733333',NULL,NULL,N'Transfer within GRE',true),
	--  (6,41,6,23,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Cancel Project',false),
	--  (6,41,6,40,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:56.8000000',NULL,NULL,N'Return to Pre-Marketing',false),
	--  (6,41,6,42,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Contract in Place - Conditional',true),
	--  (6,41,6,43,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.6866667',NULL,NULL,N'Contract in Place - Unconditional',true),
	--  (6,42,6,20,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:47.5733333',NULL,NULL,N'Transfer within GRE',false),
	--  (6,42,6,23,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Cancel Project',false),
	--  (6,42,6,32,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Dispose Externally',true),
	--  (6,42,6,40,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.3800000',NULL,NULL,N'Restart Pre-Marketing',false),
	--  (6,42,6,41,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.6866667',NULL,NULL,N'Restart Marketing',false),
	--  (6,42,6,43,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.6866667',NULL,NULL,N'Contract in Place - Unconditional',true),
	--  (6,43,6,20,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:47.5733333',NULL,NULL,N'Transfer within GRE',true),
	--  (6,43,6,23,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.6866667',NULL,NULL,N'Cancel Project',false),
	--  (6,43,6,32,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.6866667',NULL,NULL,N'Dispose Externally',true),
	--  (6,43,6,40,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.6866667',NULL,NULL,N'Restart Pre-Marketing',false),
	--  (6,43,6,41,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.6866667',NULL,NULL,N'Restart Marketing',false);
