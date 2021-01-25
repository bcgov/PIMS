UPDATE dbo.[NotificationTemplates]
SET [Body] = '
@using System.Linq
@using Pims.Dal.Entities

<html><head><title>@Model.Environment.Title</title></head><body><p>Dear @Model.ToAgency.AddressTo,</p><p>Your project @Model.Project.ProjectNumber has been approved. Signin to <a href="@Model.Environment.Uri">PIMS</a> to review the progress.</p><p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p><p>Sincerely Real Property Division</p></body></html>'
WHERE [Id] = 4

UPDATE dbo.[NotificationTemplates]
SET [Body] = '
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>Good afternoon,</p>
<p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p>
<p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea sqft<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 90 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.  Reminder notifications will be sent at both 30 days and 60 days from this initial notification.</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
WHERE [Id] = 5;

UPDATE dbo.[NotificationTemplates]
SET [Body] =  '
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>Good afternoon,</p>
<p>This email is a 30 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p>This email is to advise that the following property have been identified as surplus is available for redeployment:</p>
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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea sqft<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
WHERE [Id] = 6;

UPDATE dbo.[NotificationTemplates]
SET [Body] = '
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>Good afternoon,</p>
<p>This email is a 60 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p>This email is to advise that the following property have been identified as surplus is available for redeployment:</p>
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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea sqft<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
WHERE [Id] = 7;

UPDATE dbo.[NotificationTemplates]
SET [Body] = '
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>Good afternoon,</p>
<p>This email is the 90 Day Completion Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p>This email is to advise that the following property have been identified as surplus is available for redeployment:</p>
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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea sqft<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
WHERE [Id] = 8;

UPDATE dbo.[NotificationTemplates]
SET [Body] = '
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>Good afternoon,</p>
<p>This email is a 30 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p>
<p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea sqft<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 60 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.  An additional reminder notification will be sent 30 days before this internal listing expires.</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
WHERE [Id] = 9;

UPDATE dbo.[NotificationTemplates]
SET [Body] = '
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>Good afternoon,</p>
<p>This email is a 60 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p>
<p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea sqft<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 30 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
WHERE [Id] = 10;

UPDATE dbo.[NotificationTemplates]
SET [Body] = '
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>Good afternoon,</p>
<p>This email is to provide confirmation that the 90 Day Enhanced Referral Period as detailed in the initial Notification of Surplus Real Property below is now complete.</p>
<p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p>
<p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea sqft<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>An Enhanced Referral Notification Letter will be sent to the owning Ministry / Agency at the end of the week advising of next steps in the process.</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
WHERE [Id] = 11;

UPDATE dbo.[NotificationTemplates]
SET [Body] = '
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>Good afternoon,</p>
<p>This email is a 30 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea sqft<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 60 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
WHERE [Id] = 12;

UPDATE dbo.[NotificationTemplates]
SET [Body] = '
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>Good afternoon,</p>
<p>This email is a 60 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
<p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea sqft<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 30 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p>
<p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
WHERE [Id] = 13;

UPDATE dbo.[NotificationTemplates]
SET [Body] = '
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>Good afternoon,</p>
<p>This email is to provide confirmation that the 90 Day Enhanced Referral Period as detailed in the initial Notification of Surplus Real Property below is now complete.</p>
<p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
<p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                </span>
            }
            else
            {
                var appraised = @Model.Project.Appraised;
                var assessed = @Model.Project.Assessed;

                <span>
                    Site Address: @property.Building.Address<br>
                    Site Description: @property.Building.Name<br>
                    Rentable Area: @property.Building.RentableArea sqft<br>
                    Building Floors: @property.Building.BuildingFloorCount<br>
                    Predominate Use: @property.Building.BuildingPredominateUse.Name<br>
                    Tenancy: @property.Building.BuildingTenancy<br>
                    Current Holder of the Property: @property.Building.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US"))</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US"))</span>
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
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
WHERE [Id] = 14;