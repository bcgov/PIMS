DROP TABLE IF EXISTS Places;


CREATE TABLE Places (id SERIAL PRIMARY KEY,
                                       lat FLOAT NOT NULL,
                                                 lng FLOAT NOT NULL,
                                                           note VARCHAR(1000),
                                                                ownerId GUID NOT NULL,
                                                                             updatedById GUID,
                                                                             createdOn TIMESTAMP,
                                                                                       updatedOn TIMESTAMP,
                                                                                                 rowversion INT NOT NULL);


ALTER TABLE Places
ALTER COLUMN createdOn
SET DEFAULT current_timestamp;

-- CREATE TRIGGER tr_test_beforeInsert BEFORE INSERT
-- ON test FOR EACH ROW EXECUTE PROCEDURE oninsert_rowversion();
 -- CREATE TRIGGER tr_test_beforeUpdate BEFORE UPDATE
-- ON test FOR EACH ROW EXECUTE PROCEDURE onupdate_dates();
