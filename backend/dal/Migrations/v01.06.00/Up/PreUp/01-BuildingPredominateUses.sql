DECLARE @correctPredominateUseId int;
DECLARE @incorrectPredominateUseId int;

select @correctPredominateUseId = Id from BuildingPredominateUses where Name = 'Senior Housing (Assisted Living / Skilled Nursing)';
select @incorrectPredominateUseId = Id from BuildingPredominateUses where Name = 'Senior Housing (Assisted Living/Skilled Nursing)';
update buildings set BuildingPredominateUseId = @correctPredominateUseId where BuildingPredominateUseId = @incorrectPredominateUseId;

select @correctPredominateUseId = Id from BuildingPredominateUses where Name = 'Transportation (Airport / Rail / Bus station)';
select @incorrectPredominateUseId = Id from BuildingPredominateUses where Name = 'Transportation (Airport/Rail/Bus station)';
update buildings set BuildingPredominateUseId = @correctPredominateUseId where BuildingPredominateUseId = @incorrectPredominateUseId;

select @correctPredominateUseId = Id from BuildingPredominateUses where Name = 'University/College';
select @incorrectPredominateUseId = Id from BuildingPredominateUses where Name = 'University / Collect';
update buildings set BuildingPredominateUseId = @correctPredominateUseId where BuildingPredominateUseId = @incorrectPredominateUseId;

update buildings set Name = 'University / College' where Name = 'University/College';
update buildings set Name = 'Jail / Prison' where Name = 'Jail/Prison';
update buildings set Name = 'Community / Recreation Centre' where Name = 'Community/Recreation Centre';

delete from BuildingPredominateUses where id = @incorrectPredominateUseId;