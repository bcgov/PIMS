CREATE OR REPLACE FUNCTION oninsert_rowversion() RETURNS TRIGGER AS $$
BEGIN
   NEW.rowversion = cast(extract(epoch from current_timestamp) as integer);
   RETURN NEW;
END;
$$ language 'plpgsql';
