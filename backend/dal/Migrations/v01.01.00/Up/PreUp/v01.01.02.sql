  DECLARE @correctAgencyId varchar(30);
  DECLARE @incorrectAgencyId varchar(30);
  select @correctAgencyId = Id from Agencies where Code = 'BCT'
  select @incorrectAgencyId = Id from Agencies where Code = 'BT'

  update Parcels set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update Buildings set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update NotificationQueue set ToAgencyId = @correctAgencyId where ToAgencyId = @incorrectAgencyId
  update Projects set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update UserAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and UserId not in (select UserId from UserAgencies where AgencyId = @correctAgencyId)
  update ProjectAgencyResponses set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and ProjectId not in (select ProjectId from ProjectAgencyResponses where AgencyId = @correctAgencyId)
  update AccessRequestAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and AccessRequestId not in (select AccessRequestId from AccessRequestAgencies where AgencyId = @correctAgencyId)
  delete from UserAgencies where AgencyId = @incorrectAgencyId
  delete from ProjectAgencyResponses where AgencyId = @incorrectAgencyId
  delete from AccessRequestAgencies where AgencyId = @incorrectAgencyId
  delete from Agencies where id = @incorrectAgencyId


  select @correctAgencyId = Id from Agencies where Code = 'ICBC'
  select @incorrectAgencyId = Id from Agencies where Code = 'ICOB'

  update Parcels set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update Buildings set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update NotificationQueue set ToAgencyId = @correctAgencyId where ToAgencyId = @incorrectAgencyId
  update Projects set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update UserAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and UserId not in (select UserId from UserAgencies where AgencyId = @correctAgencyId)
  update ProjectAgencyResponses set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and ProjectId not in (select ProjectId from ProjectAgencyResponses where AgencyId = @correctAgencyId)
  update AccessRequestAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and AccessRequestId not in (select AccessRequestId from AccessRequestAgencies where AgencyId = @correctAgencyId)
  delete from UserAgencies where AgencyId = @incorrectAgencyId
  delete from ProjectAgencyResponses where AgencyId = @incorrectAgencyId
  delete from AccessRequestAgencies where AgencyId = @incorrectAgencyId
  delete from Agencies where id = @incorrectAgencyId


  select @correctAgencyId = Id from Agencies where Code = 'CMB'
  select @incorrectAgencyId = Id from Agencies where Code = 'CPB'

  update Parcels set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update Buildings set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update NotificationQueue set ToAgencyId = @correctAgencyId where ToAgencyId = @incorrectAgencyId
  update Projects set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update UserAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and UserId not in (select UserId from UserAgencies where AgencyId = @correctAgencyId)
  update ProjectAgencyResponses set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and ProjectId not in (select ProjectId from ProjectAgencyResponses where AgencyId = @correctAgencyId)
  update AccessRequestAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and AccessRequestId not in (select AccessRequestId from AccessRequestAgencies where AgencyId = @correctAgencyId)
  delete from UserAgencies where AgencyId = @incorrectAgencyId
  delete from ProjectAgencyResponses where AgencyId = @incorrectAgencyId
  delete from AccessRequestAgencies where AgencyId = @incorrectAgencyId
  delete from Agencies where id = @incorrectAgencyId


  select @correctAgencyId = Id from Agencies where Code = 'ECUAD'
  select @incorrectAgencyId = Id from Agencies where Code = 'ECUOA&'

  update Parcels set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update Buildings set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update NotificationQueue set ToAgencyId = @correctAgencyId where ToAgencyId = @incorrectAgencyId
  update Projects set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update UserAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and UserId not in (select UserId from UserAgencies where AgencyId = @correctAgencyId)
  update ProjectAgencyResponses set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and ProjectId not in (select ProjectId from ProjectAgencyResponses where AgencyId = @correctAgencyId)
  update AccessRequestAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and AccessRequestId not in (select AccessRequestId from AccessRequestAgencies where AgencyId = @correctAgencyId)
  delete from UserAgencies where AgencyId = @incorrectAgencyId
  delete from ProjectAgencyResponses where AgencyId = @incorrectAgencyId
  delete from AccessRequestAgencies where AgencyId = @incorrectAgencyId
  delete from Agencies where id = @incorrectAgencyId


  select @correctAgencyId = Id from Agencies where Code = 'PLMB'
  select @incorrectAgencyId = Id from Agencies where Code = 'P&LMB'

  update Parcels set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update Buildings set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update NotificationQueue set ToAgencyId = @correctAgencyId where ToAgencyId = @incorrectAgencyId
  update Projects set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update UserAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and UserId not in (select UserId from UserAgencies where AgencyId = @correctAgencyId)
  update ProjectAgencyResponses set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and ProjectId not in (select ProjectId from ProjectAgencyResponses where AgencyId = @correctAgencyId)
  update AccessRequestAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and AccessRequestId not in (select AccessRequestId from AccessRequestAgencies where AgencyId = @correctAgencyId)
  delete from UserAgencies where AgencyId = @incorrectAgencyId
  delete from ProjectAgencyResponses where AgencyId = @incorrectAgencyId
  delete from AccessRequestAgencies where AgencyId = @incorrectAgencyId
  delete from Agencies where id = @incorrectAgencyId


  select @correctAgencyId = Id from Agencies where Code = 'KP'
  select @incorrectAgencyId = Id from Agencies where Code = 'KPU'

  update Parcels set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update Buildings set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update NotificationQueue set ToAgencyId = @correctAgencyId where ToAgencyId = @incorrectAgencyId
  update Projects set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId
  update UserAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and UserId not in (select UserId from UserAgencies where AgencyId = @correctAgencyId)
  update ProjectAgencyResponses set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and ProjectId not in (select ProjectId from ProjectAgencyResponses where AgencyId = @correctAgencyId)
  update AccessRequestAgencies set AgencyId = @correctAgencyId where AgencyId = @incorrectAgencyId and AccessRequestId not in (select AccessRequestId from AccessRequestAgencies where AgencyId = @correctAgencyId)
  delete from UserAgencies where AgencyId = @incorrectAgencyId
  delete from ProjectAgencyResponses where AgencyId = @incorrectAgencyId
  delete from AccessRequestAgencies where AgencyId = @incorrectAgencyId
  delete from Agencies where id = @incorrectAgencyId