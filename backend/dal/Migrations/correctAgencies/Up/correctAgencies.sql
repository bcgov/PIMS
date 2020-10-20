  DECLARE @correctAgencyId varchar(30);
  DECLARE @incorrectAgencyId varchar(30);
  select @correctAgencyId = Id from Agencies where Code = 'BCT'
  select @incorrectAgencyId = Id from Agencies where Code = 'BT'

  update Parcels set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update AccessRequestAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update Buildings set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update NotificationQueue set ToAgencyId = @correctAgencyId where ToAgencyId = @incorrectAgencyId
  update ProjectAgencyResponses set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update Projects set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update UserAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  delete from Agencies where id = @incorrectAgencyId

  select @correctAgencyId = Id from Agencies where Code = 'ICBC'
  select @incorrectAgencyId = Id from Agencies where Code = 'ICOB'

  update Parcels set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update AccessRequestAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update Buildings set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update NotificationQueue set ToAgencyId = @correctAgencyId where ToAgencyId = @incorrectAgencyId
  update ProjectAgencyResponses set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update Projects set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update UserAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  delete from Agencies where id = @incorrectAgencyId

  update Agencies set parentId = (select id from agencies where code = 'TRAN') where id = @correctAgencyId;