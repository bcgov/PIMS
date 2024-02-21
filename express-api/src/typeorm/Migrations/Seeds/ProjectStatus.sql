INSERT INTO project_status (id,created_by_id,created_on,updated_by_id,updated_on,name,is_disabled,sort_order,code,group_name,description,is_milestone,is_terminal,route) VALUES
	 (1,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Draft',false,0,N'DR',N'Draft',N'A new draft project that is not ready to submit to apply to be added to the Surplus Property Program.',false,false,N'/projects/draft'),
	 (2,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Select Properties',false,1,N'DR-P',N'Draft',N'Add properties to the project.',false,false,N'/projects/properties'),
	 (3,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Update Information',false,2,N'DR-I',N'Draft',N'Assign tier level, classification and update current financial information.',false,false,N'/projects/information'),
	 (4,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Required Documentation',false,3,N'DR-D',N'Draft',N'Required documentation has been completed and sent (Surplus Declaration & Readiness Checklist, Triple Bottom Line).',false,false,N'/projects/documentation'),
	 (5,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Approval',false,4,N'DR-A',N'Draft',N'The project is ready to be approved by owning agency.',false,false,N'/projects/approval'),
	 (6,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Review',false,5,N'DR-RE',N'Draft',N'The project has been submitted for review to be added to the Surplus Property Program.',false,false,N'/projects/review'),
	 (7,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Submitted',false,6,N'AS-I',N'Submitted',N'Submitted project property information review.',true,false,N'/projects/assess/properties'),
	 (8,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Submitted Exemption',false,6,N'AS-EXE',N'Submitted',N'Project has been been submitted with a request for exemption.',true,false,N'/projects/assess/properties'),
	 (10,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Document Review',false,7,N'AS-D',N'Submitted',N'Documentation reviewed (Surplus Declaration & Readiness Checklist, Triple Bottom Line).',false,false,N'/projects/assess/documentation'),
	 (11,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Appraisal Review',false,8,N'AS-AP',N'Submitted',N'Appraisal review process.',false,false,N'/projects/assess/appraisal'),
	 (12,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'First Nation Consultation',false,9,N'AS-FNC',N'Submitted',N'First Nation Consultation process.',false,false,N'/projects/assess/first/nation/consultation'),
	 (13,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Exemption Review',false,10,N'AS-EXP',N'Submitted',N'Process to approve ERP exemption.',false,false,N'projects/assess/exemption'),
	 (14,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Approved for ERP',false,11,N'AP-ERP',N'Approved',N'The project has been approved to be added to the Surplus Properties Program - Enhanced Referral Program.  This begins the 90 day internal marketing process.',true,false,N'/projects/approved'),
	 (15,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Approved for Exemption',false,11,N'AP-EXE',N'Approved',N'Project has been approved for ERP exemption.',true,false,N'/projects/approved'),
	 (16,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Denied',false,11,N'DE',N'Closed',N'The project has been denied to be added to the Surplus Properties Program.',true,true,N'/projects/denied'),
	 (20,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Transferred within the GRE',false,21,N'T-GRE',N'Closed',N'The project has been transferred within the Greater Reporting Entity',true,true,N'/projects/transferred'),
	 (21,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Approved for SPL',false,21,N'AP-SPL',N'Approved',N'The project has been approved to be added to the Surplus Properties Program - Surplus Property List.  This begins the external marketing process.',true,false,N'/projects/approved'),
	 (22,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Not in SPL',false,21,N'AP-!SPL',N'Approved',N'The project has been approved to not be included in the Surplus Properties Program - Surplus Property List. ',true,false,N'/projects/approved'),
	 (23,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Cancelled',false,21,N'CA',N'Closed',N'The project has been cancelled from the Surplus Properties Program.',true,true,N'/projects/cancelled'),
	 (30,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'In ERP',false,1,N'ERP-ON',N'ERP',N'The project has is in the Enhanced Referral Program.',false,false,N'/projects/erp'),
	 (31,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'On Hold',false,2,N'ERP-OH',N'ERP',N'The project has been put on hold due to potential sale to an interested party.',false,false,N'/projects/onhold'),
	 (32,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Disposed',false,21,N'DIS',N'Complete',N'The project has been disposed externally.',true,true,N'/projects/disposed'),
	 (40,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Pre-Marketing',false,18,N'SPL-PM',N'Pre-Marketing',N'The project is in the pre-marketing stage of the Surplus Property List.',false,false,N'/projects/premarketing'),
	 (41,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'On Market',false,19,N'SPL-M',N'Marketing',N'The project is in the marketing stage of the Surplus Property List.',false,false,N'/projects/premarketing'),
	 (42,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Contract in Place - Conditional',false,20,N'SPL-CIP-C',N'Contract in Place',N'The project has received a conditional offer.',false,false,N'/projects/contractinplace'),
	 (43,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:43.5966667',NULL,NULL,N'Contract in Place - Unconditional',false,20,N'SPL-CIP-U',N'Contract in Place',N'The project has received an unconditional offer.',false,false,N'/projects/contractinplace');
