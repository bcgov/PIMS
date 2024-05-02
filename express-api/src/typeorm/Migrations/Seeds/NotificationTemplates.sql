INSERT INTO notification_template (id,created_by_id,created_on,updated_by_id,updated_on,name,description,"to",cc,bcc,audience,encoding,body_type,priority,subject,body,is_disabled,tag) VALUES
	 (1,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'New Disposal Project Submitted',N'Inform SRES a new project has been submitted for assessment.',N'RealPropertyDivision.Disposals@gov.bc.ca',N'',N'',N'Default',N'Utf8',N'Html',N'High',N'New Disposal Project Submitted - @Model.Project.ProjectNumber','
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>Good afternoon,</p>
<p>This email is to advise that the following properties have been submitted to the Surplus Property Program to be reviewed as surplus by the current holder of the property and is requesting your review:</p>
<p>Property Inventory Management System - <a href=@Model.Environment.Uri>@Model.Project.ProjectNumber</a></p>
<p>
    <ol>
        @foreach (var property in Model.Project.Properties)
        {
        <li>
            @if (property.PropertyType == PropertyTypes.Land)
            {
                var appraised = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

                <span>
                    Site Address: @property.Parcel.Address.ToString()<br>
                    Site Description: @property.Parcel.Name<br>
                    Site Size: @property.Parcel.LandArea ha<br>
                    Zoned: @property.Parcel.Zoning<br>
                    PID: @property.Parcel.ParcelIdentity<br>
                    Legal: @property.Parcel.LandLegalDescription<br>
                    Current Holder of the Property: @property.Parcel.Agency?.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US)) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US)) (@assessed.Date.Year)</span>
                    }
                </span>
            }
            else
            {
                var appraised = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

                <span>
                    Site Address: @property.Building.Address.ToString()<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea Sq. M<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse?.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency?.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US)) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US)) (@assessed.Date.Year)</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>',false,N'SPP'),
	 (2,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Disposal Project Denied',N'Inform owning agency their disposal project was denied.',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'ProjectOwner',N'Utf8',N'Html',N'Normal',N'Disposal Project Denied - @Model.Project.ProjectNumber','
<html>
<head><title>@Model.Environment.Title</title></head>
<body>
  <p>Good morning / Good afternoon,</p>
  <p>Your project @Model.Project.ProjectNumber has been denied. Signin to <a href=@Model.Environment.Uri>PIMS</a> to review the reason.</p>
  <p>Sincerely Real Property Division</p>
</body>
</html>',false,N'SPP'),
	 (3,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Disposal Project Cancelled',N'Inform owning agency their disposal project was cancelled.',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'ProjectOwner',N'Utf8',N'Html',N'Normal',N'Disposal Project Cancelled - @Model.Project.ProjectNumber','
<html><head><title>@Model.Environment.Title</title></head>
<body>
  <p>Good morning / Good afternoon,</p>
  <p>Your project @Model.Project.ProjectNumber has been cancelled. Signin to <a href=@Model.Environment.Uri>PIMS</a> to review the reason.</p>
  <p>Sincerely Real Property Division</p>
</body>
</html>',false,N'SPP'),
	 (4,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Disposal Project Approved for ERP',N'Inform owning agency their project has been approved and properties will be added to ERP.',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'ProjectOwner',N'Utf8',N'Html',N'Normal',N'Disposal Project Approved for ERP - @Model.Project.ProjectNumber','
@using System.Linq
@using Pims.Dal.Entities
<html>
<head><title>@Model.Environment.Title</title></head>
<body>
  <p>Good morning / Good afternoon,</p>
  <p>Your project @Model.Project.ProjectNumber has been approved. Signin to <a href=@Model.Environment.Uri>PIMS</a> to review the progress.</p>
  <p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p><p>Sincerely Real Property Division</p>
</body>
</html>',false,N'ERP'),
	 (5,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'New Properties on ERP',N'Inform agencies of new properties added to ERP.',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'ParentAgencies',N'Utf8',N'Html',N'High',N'ACTION REQUIRED - Notification of Surplus Real Property','
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p>
<p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p>
<p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
<p><b> @Model.Project.ProjectNumber : </b></p>
<p>
    <ol>
        @foreach (var property in Model.Project.Properties)
        {
        <li>
            @if (property.PropertyType == PropertyTypes.Land)
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Parcel.Address.ToString()<br>
                    Site Description: @property.Parcel.Name<br>
                    Site Size: @property.Parcel.LandArea ha<br>
                    Zoned: @property.Parcel.Zoning<br>
                    PID: @property.Parcel.ParcelIdentity<br>
                    Legal: @property.Parcel.LandLegalDescription<br>
                    Current Holder of the Property: @property.Parcel.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address.ToString()<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea Sq. M<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 90 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.  Reminder notifications will be sent at both 30 days and 60 days from this initial notification.</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>',false,N'ERP'),
	 (6,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'30 day ERP notification - Owning Agency',N'ERP 30 expiration notification to inform owning agency of time remaining in ERP',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'ProjectOwner',N'Utf8',N'Html',N'Normal',N'Notification of Surplus Real Property - 30 Day Reminder Notification of Surplus Real Property','
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p>
<p>This email is a 30 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p>This email is to advise that the following property have been identified as surplus is available for redeployment:</p>
<p><b> @Model.Project.ProjectNumber : </b></p>
<p>
    <ol>
        @foreach (var property in Model.Project.Properties)
        {
        <li>
            @if (property.PropertyType == PropertyTypes.Land)
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Parcel.Address.ToString()<br>
                    Site Description: @property.Parcel.Name<br>
                    Site Size: @property.Parcel.LandArea ha<br>
                    Zoned: @property.Parcel.Zoning<br>
                    PID: @property.Parcel.ParcelIdentity<br>
                    Legal: @property.Parcel.LandLegalDescription<br>
                    Current Holder of the Property: @property.Parcel.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address.ToString()<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea Sq. M<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>',false,N'ERP'),
	 (7,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'60 day ERP notification - Owning Agency',N'ERP 60 expiration notification to inform owning agency of time remaining in ERP',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'ProjectOwner',N'Utf8',N'Html',N'Normal',N'Notification of Surplus Real Property - 60 Day Reminder Notification of Surplus Real Property','
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p>
<p>This email is a 60 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p>This email is to advise that the following property have been identified as surplus is available for redeployment:</p>
<p><b> @Model.Project.ProjectNumber : </b></p>
<p>
    <ol>
        @foreach (var property in Model.Project.Properties)
        {
        <li>
            @if (property.PropertyType == PropertyTypes.Land)
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Parcel.Address.ToString()<br>
                    Site Description: @property.Parcel.Name<br>
                    Site Size: @property.Parcel.LandArea ha<br>
                    Zoned: @property.Parcel.Zoning<br>
                    PID: @property.Parcel.ParcelIdentity<br>
                    Legal: @property.Parcel.LandLegalDescription<br>
                    Current Holder of the Property: @property.Parcel.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address.ToString()<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea Sq. M<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>',false,N'ERP'),
	 (8,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'90 day ERP notification - Owning Agency',N'ERP 90 expiration notification to inform owning agency ERP is complete.',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'ProjectOwner',N'Utf8',N'Html',N'Normal',N'Notification of Surplus Real Property - Completion of 90 Day Enhanced Referral Period for Notification of Surplus Real Property','
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p>
<p>This email is the 90 Day Completion Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p>This email is to advise that the following property have been identified as surplus is available for redeployment:</p>
<p><b> @Model.Project.ProjectNumber : </b></p>
<p>
    <ol>
        @foreach (var property in Model.Project.Properties)
        {
        <li>
            @if (property.PropertyType == PropertyTypes.Land)
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Parcel.Address.ToString()<br>
                    Site Description: @property.Parcel.Name<br>
                    Site Size: @property.Parcel.LandArea ha<br>
                    Zoned: @property.Parcel.Zoning<br>
                    PID: @property.Parcel.ParcelIdentity<br>
                    Legal: @property.Parcel.LandLegalDescription<br>
                    Current Holder of the Property: @property.Parcel.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address.ToString()<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea Sq. M<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>',false,N'ERP'),
	 (9,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'30 day ERP notification - Parent Agencies',N'ERP 30 notification to inform agencies or properties available in ERP.',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'ParentAgencies',N'Utf8',N'Html',N'High',N'ACTION REQUIRED - Notification of Surplus Real Property - 30 Day Reminder Notification of Surplus Real Property','
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p>
<p>This email is a 30 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p>
<p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
<p><b> @Model.Project.ProjectNumber : </b></p>
<p>
    <ol>
        @foreach (var property in Model.Project.Properties)
        {
        <li>
            @if (property.PropertyType == PropertyTypes.Land)
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Parcel.Address.ToString()<br>
                    Site Description: @property.Parcel.Name<br>
                    Site Size: @property.Parcel.LandArea ha<br>
                    Zoned: @property.Parcel.Zoning<br>
                    PID: @property.Parcel.ParcelIdentity<br>
                    Legal: @property.Parcel.LandLegalDescription<br>
                    Current Holder of the Property: @property.Parcel.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address.ToString()<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea Sq. M<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 60 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.  An additional reminder notification will be sent 30 days before this internal listing expires.</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>',false,N'ERP'),
	 (10,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'60 day ERP notification - Parent Agencies',N'ERP 60 notification to inform agencies or properties available in ERP.',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'ParentAgencies',N'Utf8',N'Html',N'High',N'ACTION REQUIRED - Notification of Surplus Real Property - 60 Day Reminder Notification of Surplus Real Property','
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p>
<p>This email is a 60 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p>
<p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
<p><b> @Model.Project.ProjectNumber : </b></p>
<p>
    <ol>
        @foreach (var property in Model.Project.Properties)
        {
        <li>
            @if (property.PropertyType == PropertyTypes.Land)
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Parcel.Address.ToString()<br>
                    Site Description: @property.Parcel.Name<br>
                    Site Size: @property.Parcel.LandArea ha<br>
                    Zoned: @property.Parcel.Zoning<br>
                    PID: @property.Parcel.ParcelIdentity<br>
                    Legal: @property.Parcel.LandLegalDescription<br>
                    Current Holder of the Property: @property.Parcel.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address.ToString()<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea Sq. M<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 30 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>',false,N'ERP'),
	 (11,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'90 day ERP notification - Parent Agencies',N'ERP 90 expiration notification to inform agencies.',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'ParentAgencies',N'Utf8',N'Html',N'High',N'ACTION REQUIRED - Notification of Surplus Real Property - Completion of 90 Day Enhanced Referral Period for Notification of Surplus Real Property','
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p>
<p>This email is to provide confirmation that the 90 Day Enhanced Referral Period as detailed in the initial Notification of Surplus Real Property below is now complete.</p>
<p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p>
<p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
<p><b> @Model.Project.ProjectNumber : </b></p>
<p>
    <ol>
        @foreach (var property in Model.Project.Properties)
        {
        <li>
            @if (property.PropertyType == PropertyTypes.Land)
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Parcel.Address.ToString()<br>
                    Site Description: @property.Parcel.Name<br>
                    Site Size: @property.Parcel.LandArea ha<br>
                    Zoned: @property.Parcel.Zoning<br>
                    PID: @property.Parcel.ParcelIdentity<br>
                    Legal: @property.Parcel.LandLegalDescription<br>
                    Current Holder of the Property: @property.Parcel.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address.ToString()<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea Sq. M<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>An Enhanced Referral Notification Letter will be sent to the owning Ministry / Agency at the end of the week advising of next steps in the process.</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>',false,N'ERP'),
	 (12,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'30 day ERP notification - Purchasing Agencies',N'ERP 30 notification to inform purchasing agencies to submit business case.',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'WatchingAgencies',N'Utf8',N'Html',N'Normal',N'ACTION REQUIRED - Notification of Surplus Real Property - 30 Day Reminder Notification of Surplus Real Property','
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p>
<p>This email is a 30 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
<p><b> @Model.Project.ProjectNumber : </b></p>
<p>
    <ol>
        @foreach (var property in Model.Project.Properties)
        {
        <li>
            @if (property.PropertyType == PropertyTypes.Land)
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Parcel.Address.ToString()<br>
                    Site Description: @property.Parcel.Name<br>
                    Site Size: @property.Parcel.LandArea ha<br>
                    Zoned: @property.Parcel.Zoning<br>
                    PID: @property.Parcel.ParcelIdentity<br>
                    Legal: @property.Parcel.LandLegalDescription<br>
                    Current Holder of the Property: @property.Parcel.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address.ToString()<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea Sq. M<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 60 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>',false,N'ERP'),
	 (13,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'60 day ERP notification - Purchasing Agencies',N'ERP 60 notification to inform purchasing agencies to submit business case.',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'WatchingAgencies',N'Utf8',N'Html',N'Normal',N'ACTION REQUIRED - Notification of Surplus Real Property - 60 Day Reminder Notification of Surplus Real Property','
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p>
<p>This email is a 60 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
<p><b> @Model.Project.ProjectNumber : </b></p>
<p>
    <ol>
        @foreach (var property in Model.Project.Properties)
        {
        <li>
            @if (property.PropertyType == PropertyTypes.Land)
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Parcel.Address.ToString()<br>
                    Site Description: @property.Parcel.Name<br>
                    Site Size: @property.Parcel.LandArea ha<br>
                    Zoned: @property.Parcel.Zoning<br>
                    PID: @property.Parcel.ParcelIdentity<br>
                    Legal: @property.Parcel.LandLegalDescription<br>
                    Current Holder of the Property: @property.Parcel.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address.ToString()<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea Sq. M<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 30 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>',false,N'ERP'),
	 (14,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'90 day ERP notification - Purchasing Agencies',N'ERP 90 expiration notification to inform purchasing agencies to submit business case.',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'WatchingAgencies',N'Utf8',N'Html',N'Normal',N'ACTION REQUIRED - Notification of Surplus Real Property - Completion of 90 Day Enhanced Referral Period for Notification of Surplus Real Property','
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p>
<p>This email is to provide confirmation that the 90 Day Enhanced Referral Period as detailed in the initial Notification of Surplus Real Property below is now complete.</p>
<p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
<p><b> @Model.Project.ProjectNumber : </b></p>
<p>
    <ol>
        @foreach (var property in Model.Project.Properties)
        {
        <li>
            @if (property.PropertyType == PropertyTypes.Land)
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Parcel.Address.ToString()<br>
                    Site Description: @property.Parcel.Name<br>
                    Site Size: @property.Parcel.LandArea ha<br>
                    Zoned: @property.Parcel.Zoning<br>
                    PID: @property.Parcel.ParcelIdentity<br>
                    Legal: @property.Parcel.LandLegalDescription<br>
                    Current Holder of the Property: @property.Parcel.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address.ToString()<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea Sq. M<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with until the end of this week from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p>
<p>An Enhanced Referral Notification Letter will be sent to the owning Ministry / Agency at the end of the week advising of next steps in the process.</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>',false,N'ERP'),
	 (15,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Access Request',N'A new authenticated user has requested access.',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'Default',N'Utf8',N'Html',N'High',N'PIMS - Access Request','
<html><head><title>@Model.Environment.Title</title></head>
<body><p>Dear Administrator,</p><p>@Model.AccessRequest.User.FirstName @Model.AccessRequest.User.LastName has submitted an access request to <a href=@Model.Environment.Uri>PIMS</a>.</p><p>Signin and review their request.</p></body></html>',false,N'Access Request'),
	 (16,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:34.7500000',NULL,NULL,N'Project Shared Note Changed',N'The shared note has been updated and the owning agency should be notified.',N'',N'',N'RealPropertyDivision.Disposals@gov.bc.ca',N'ProjectOwner',N'Utf8',N'Html',N'High',N'PIMS - Project Note Updated - @Model.Project.ProjectNumber','
@using System.Linq
@using Pims.Dal.Entities
<html><head><title>@Model.Environment.Title</title></head>
<body><p>Dear @(Model.Project.Manager ?? Property Manager),</p><p>Your project @Model.Project.ProjectNumber has been updated with the following note;</p><p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.Public)?.Note</p></body></html>',false,N'SPP'),
	 (17,'00000000-0000-0000-0000-000000000000','2023-01-17 17:58:54.0800000',NULL,NULL,N'Access Request RPD Mailbox',N'A new authenticated user has requested access.',N'CITZ_RPD_IMIT_HELP@gov.bc.ca',N'',N'',N'Default',N'Utf8',N'Html',N'High',N'PIMS - Access Request','
<html><head><title>@Model.Environment.Title</title></head>
<body><p>Dear Administrator,</p><p>@Model.AccessRequest.User.FirstName @Model.AccessRequest.User.LastName has submitted an access request to <a href=@Model.Environment.Uri>PIMS</a>.</p><p>Signin and review their request.</p></body></html>',false,N'Access Request');
