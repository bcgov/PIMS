INSERT INTO tier_level (id,created_by_id,created_on,updated_by_id,updated_on,name,is_disabled,sort_order,description) VALUES
	 (1,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.2300000',NULL,NULL,N'Tier 1',false,1,N'Properties with a net value of less than $1M.'),
	 (2,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.2300000',NULL,NULL,N'Tier 2',false,2,N'Properties with a net value of $1M or more and less than $10M'),
	 (3,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.2300000',NULL,NULL,N'Tier 3',false,3,N'Properties from a single parcels with a net value of $10M or more'),
	 (4,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:35.2300000',NULL,NULL,N'Tier 4',false,4,N'Properties from multiple parcels with a cumulative net value of $10M or more');
