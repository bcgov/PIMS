PRINT 'Adding NotificationTemplates'

SET IDENTITY_INSERT dbo.[NotificationTemplates] ON

INSERT INTO dbo.[NotificationTemplates] (
    [Id]
    , [Name]
    , [Description]
    , [IsDisabled]
    , [To]
    , [Cc]
    , [Bcc]
    , [Audience]
    , [Encoding]
    , [BodyType]
    , [Priority]
    , [Subject]
    , [Body]
    , [Tag]
) VALUES (
    1
    , 'New Disposal Project Submitted'
    , 'Inform SRES a new project has been submitted for assessment.'
    , 0
    , 'RealPropertyDivision.Disposals@gov.bc.ca'
    , ''
    , ''
    , 'Default'
    , 'Utf8'
    , 'Html'
    , 'High'
    , 'New Disposal Project Submitted - @Model.Project.ProjectNumber'
    , '
@using System.Linq
@using Pims.Dal.Entities
@using System.Globalization

<html><head><title>@Model.Environment.Title</title></head><body>
<p>Good afternoon,</p>
<p>This email is to advise that the following properties have been submitted to the Surplus Property Program to be reviewed as surplus by the current holder of the property and is requesting your review:</p>
<p>Property Inventory Management System - <a href="@Model.Environment.Uri">@Model.Project.ProjectNumber</a></p>
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
                    Current Holder of the Property: @property.Parcel.Agency.Name<br>
                    @if (appraised != null && appraised.Value > 0)
                    {
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
            else
            {
                var appraised = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);
                var year = appraised != null ? appraised.Date.Year : assessed.Date.Year;
                var value = appraised != null ? appraised.Value : assessed.Value;

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
    , 'SPP'
), (
    2
    , 'Disposal Project Denied'
    , 'Inform owning agency their disposal project was denied.'
    , 0
    , ''
    , 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>'
    , ''
    , 'OwningAgency'
    , 'Utf8'
    , 'Html'
    , 'Normal'
    , 'Disposal Project Denied - @Model.Project.ProjectNumber'
    , '<html><head><title>@Model.Environment.Title</title></head><body><p>Dear @Model.ToAgency.AddressTo,</p><p>Your project @Model.Project.ProjectNumber has been denied. Signin to <a href="@Model.Environment.Uri">PIMS</a> to review the reason.</p><p>Sincerely Real Property Division</p></body></html>'
    , 'SPP'
), (
    3
    , 'Disposal Project Cancelled'
    , 'Inform owning agency their disposal project was cancelled.'
    , 0
    , ''
    , 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>'
    , ''
    , 'OwningAgency'
    , 'Utf8'
    , 'Html'
    , 'Normal'
    , 'Disposal Project Cancelled - @Model.Project.ProjectNumber'
    , '<html><head><title>@Model.Environment.Title</title></head><body><p>Dear @Model.ToAgency.AddressTo,</p><p>Your project @Model.Project.ProjectNumber has been cancelled. Signin to <a href="@Model.Environment.Uri">PIMS</a> to review the reason.</p><p>Sincerely Real Property Division</p></body></html>'
    , 'SPP'
), (
    4
    , 'Disposal Project Approved for ERP'
    , 'Inform owning agency their project has been approved and properties will be added to ERP.'
    , 0
    , ''
    , 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>'
    , ''
    , 'OwningAgency'
    , 'Utf8'
    , 'Html'
    , 'Normal'
    , 'Disposal Project Approved for ERP - @Model.Project.ProjectNumber'
    , '<html><head><title>@Model.Environment.Title</title></head><body><p>Dear @Model.ToAgency.AddressTo,</p><p>Your project @Model.Project.ProjectNumber has been approved. Signin to <a href="@Model.Environment.Uri">PIMS</a> to review the progress.</p><p>Sincerely Real Property Division</p></body></html>'
    , 'ERP'
), (
    5
    , 'New Properties on ERP'
    , 'Inform agencies of new properties added to ERP.'
    , 0
    , ''
    , 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>'
    , ''
    , 'ParentAgencies'
    , 'Utf8'
    , 'Html'
    , 'High'
    , 'ACTION REQUIRED - Notification of Surplus Real Property'
    , '
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
                var appraised = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
            else
            {
                var appraised = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 90 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.  Reminder notifications will be sent at both 30 days and 60 days from this initial notification.</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
    , 'ERP'
), (
    6
    , '30 day ERP notification - Owning Agency'
    , 'ERP 30 expiration notification to inform owning agency of time remaining in ERP'
    , 0
    , ''
    , 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>'
    , ''
    , 'OwningAgency'
    , 'Utf8'
    , 'Html'
    , 'Normal'
    , 'Notification of Surplus Real Property - 30 Day Reminder Notification of Surplus Real Property'
    , '
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
                var appraised = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
            else
            {
                var appraised = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
    , 'ERP'
), (
    7
    , '60 day ERP notification - Owning Agency'
    , 'ERP 60 expiration notification to inform owning agency of time remaining in ERP'
    , 0
    , ''
    , 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>'
    , ''
    , 'OwningAgency'
    , 'Utf8'
    , 'Html'
    , 'Normal'
    , 'Notification of Surplus Real Property - 60 Day Reminder Notification of Surplus Real Property'
    , '
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
                var appraised = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
            else
            {
                var appraised = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
    , 'ERP'
), (
    8
    , '90 day ERP notification - Owning Agency'
    , 'ERP 90 expiration notification to inform owning agency ERP is complete.'
    , 0
    , ''
    , 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>'
    , ''
    , 'OwningAgency'
    , 'Utf8'
    , 'Html'
    , 'Normal'
    , 'Notification of Surplus Real Property - Completion of 90 Day Enhanced Referral Period for Notification of Surplus Real Property'
    , '
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
                var appraised = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
            else
            {
                var appraised = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
    , 'ERP'
), (
    9
    , '30 day ERP notification - Parent Agencies'
    , 'ERP 30 notification to inform agencies or properties available in ERP.'
    , 0
    , ''
    , 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>'
    , ''
    , 'ParentAgencies'
    , 'Utf8'
    , 'Html'
    , 'High'
    , 'ACTION REQUIRED - Notification of Surplus Real Property - 30 Day Reminder Notification of Surplus Real Property'
    , '
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
                var appraised = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
            else
            {
                var appraised = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 60 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.  An additional reminder notification will be sent 30 days before this internal listing expires.</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
    , 'ERP'
), (
    10
    , '60 day ERP notification - Parent Agencies'
    , 'ERP 60 notification to inform agencies or properties available in ERP.'
    , 0
    , ''
    , 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>'
    , ''
    , 'ParentAgencies'
    , 'Utf8'
    , 'Html'
    , 'High'
    , 'ACTION REQUIRED - Notification of Surplus Real Property - 60 Day Reminder Notification of Surplus Real Property'
    , '
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
                var appraised = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
            else
            {
                var appraised = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 30 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
    , 'ERP'
), (
    11
    , '90 day ERP notification - Parent Agencies'
    , 'ERP 90 expiration notification to inform agencies.'
    , 0
    , ''
    , 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>'
    , ''
    , 'ParentAgencies'
    , 'Utf8'
    , 'Html'
    , 'High'
    , 'ACTION REQUIRED - Notification of Surplus Real Property - Completion of 90 Day Enhanced Referral Period for Notification of Surplus Real Property'
    , '
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
                var appraised = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
            else
            {
                var appraised = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>An Enhanced Referral Notification Letter will be sent to the owning Ministry / Agency at the end of the week advising of next steps in the process.</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
    , 'ERP'
), (
    12
    , '30 day ERP notification - Purchasing Agencies'
    , 'ERP 30 notification to inform purchasing agencies to submit business case.'
    , 0
    , ''
    , 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>'
    , ''
    , 'WatchingAgencies'
    , 'Utf8'
    , 'Html'
    , 'Normal'
    , 'ACTION REQUIRED - Notification of Surplus Real Property - 30 Day Reminder Notification of Surplus Real Property'
    , '
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
                var appraised = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
            else
            {
                var appraised = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 60 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
    , 'ERP'
), (
    13
    , '60 day ERP notification - Purchasing Agencies'
    , 'ERP 60 notification to inform purchasing agencies to submit business case.'
    , 0
    , ''
    , 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>'
    , ''
    , 'WatchingAgencies'
    , 'Utf8'
    , 'Html'
    , 'Normal'
    , 'ACTION REQUIRED - Notification of Surplus Real Property - 60 Day Reminder Notification of Surplus Real Property'
    , '
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
                var appraised = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
            else
            {
                var appraised = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 30 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
    , 'ERP'
), (
    14
    , '90 day ERP notification - Purchasing Agencies'
    , 'ERP 90 expiration notification to inform purchasing agencies to submit business case.'
    , 0
    , ''
    , 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>'
    , ''
    , 'WatchingAgencies'
    , 'Utf8'
    , 'Html'
    , 'Normal'
    , 'ACTION REQUIRED - Notification of Surplus Real Property - Completion of 90 Day Enhanced Referral Period for Notification of Surplus Real Property'
    , '
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
                var appraised = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
            else
            {
                var appraised = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised);
                var assessed = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);

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
                        <span>Appraised Value: @appraised.Value.ToString("C", new CultureInfo("en-US")) (@appraised.Date.Year BC Assessment)</span>
                    }
                    else if (assessed != null && assessed.Value > 0)
                    {
                        <span>Assessed Value: @assessed.Value.ToString("C", new CultureInfo("en-US")) (@assessed.Date.Year)</span>
                    }
                </span>
            }
        </li>
        }
    </ol>
</p>
<p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with until the end of this week from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p>
<p>An Enhanced Referral Notification Letter will be sent to the owning Ministry / Agency at the end of the week advising of next steps in the process.</p>
<p>If you have any questions regarding this matter, please contact Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348.</p>
<p>Thank you.</p>
<p>Strategic Real Estate Services, Real Property Division</p></body></html>'
    , 'ERP'
), (
    15
    , 'Access Request'
    , 'A new authenticated user has requested access.'
    , 0
    , ''
    , ''
    , ''
    , 'Default'
    , 'Utf8'
    , 'Html'
    , 'High'
    , 'PIMS - Access Request'
    , '
<html><head><title>@Model.Environment.Title</title></head>
<body><p>Dear Administrator,</p><p>@Model.AccessRequest.User.FirstName @Model.AccessRequest.User.LastName has submitted an access request to <a href="@Model.Environment.Uri">PIMS</a>.</p><p>Signin and review their request.</p></body></html>'
    , 'Access Request'
), (
    16
    , 'Project Shared Note Changed'
    , 'The shared note has been updated and the owning agency should be notified.'
    , 0
    , ''
    , ''
    , ''
    , 'Default'
    , 'Utf8'
    , 'Html'
    , 'High'
    , 'PIMS - Project Note Updated - @Model.Project.ProjectNumber'
    , '
@using System.Linq
@using Pims.Dal.Entities
<html><head><title>@Model.Environment.Title</title></head>
<body><p>Dear @Model.Project.Manager,</p><p>Your project @Model.Project.ProjectNumber has been updated with the following note;</p><p>@Model.Project.PublicNote</p></body></html>'
    , 'SPP'
)

SET IDENTITY_INSERT dbo.[NotificationTemplates] OFF

