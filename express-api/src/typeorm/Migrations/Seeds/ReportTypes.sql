INSERT INTO "report_type" ("Id","CreatedById","CreatedOn","Name","IsDisabled","SortOrder","Description") 
VALUES
	 (0, (SELECT "Id" FROM "user" WHERE "Username" = 'system'), '2023-01-17 17:58:34.7500000', 'SPL', FALSE, 0, 'Surplus Properties');

