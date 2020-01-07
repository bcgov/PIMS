CREATE OR REPLACE FUNCTION onupdate_dates() RETURNS TRIGGER AS $$
BEGIN
   NEW.updatedon = current_timestamp;
   NEW.rowversion = cast(extract(epoch from current_timestamp) as integer);
   RETURN NEW;
END;
$$ language 'plpgsql';
