PRINT 'Removing Notification Template...'

UPDATE dbo.[NotificationTemplates]
SET [Body] = '
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
WHERE [Id] = 1;


