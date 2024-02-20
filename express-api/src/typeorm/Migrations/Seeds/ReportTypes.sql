INSERT INTO report_type (id,created_by_id,created_on,name,is_disabled,sort_order,description) 
VALUES
	 (0, (SELECT Id FROM "user" WHERE Username = 'system'), '2023-01-17 17:58:34.7500000', 'SPL', FALSE, 0, 'Surplus Properties');

