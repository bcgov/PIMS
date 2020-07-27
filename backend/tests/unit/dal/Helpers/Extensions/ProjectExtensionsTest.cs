using FluentAssertions;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;

namespace Pims.Dal.Test.Helpers.Extensions
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("category", "extensions")]
    [Trait("group", "project")]
    [ExcludeFromCodeCoverage]
    public class ProjectExtensionsTest
    {
        #region Tests
        #region GetProjectFinancialDate
        [Fact]
        public void GetProjectFinancialDate_NoEvaluations()
        {
            // Arrange
            var project = EntityHelper.CreateProject(1);
            var parcel = EntityHelper.CreateParcel(1);
            var buildings = EntityHelper.CreateBuildings(parcel, 1, 10);
            buildings.ForEach(b => project.AddProperty(b));

            // Act
            var result = project.GetProjectFinancialDate();

            // Assert
            result.Should().NotBeAfter(DateTime.UtcNow);
        }

        [Fact]
        public void GetProjectFinancialDate()
        {
            // Arrange
            var project = EntityHelper.CreateProject(1);
            var parcel = EntityHelper.CreateParcel(1);
            var buildings = EntityHelper.CreateBuildings(parcel, 1, 10);
            var evaluations = EntityHelper.CreateEvaluations(buildings.Next(0), new DateTime(2015, 1, 1), 5);
            buildings.ForEach(b => project.AddProperty(b));

            // Act
            var result = project.GetProjectFinancialDate();

            // Assert
            Assert.Equal(new DateTime(2019, 1, 1), result);
        }
        #endregion

        #region UpdateProjectFinancials
        [Fact]
        public void UpdateProjectFinancials()
        {
            // Arrange
            var project = EntityHelper.CreateProject(1);
            project.ReportedFiscalYear = 2019;
            var parcel = EntityHelper.CreateParcel(1);
            EntityHelper.CreateEvaluations(parcel, new DateTime(2015, 1, 1), 5, EvaluationKeys.Assessed, 5);
            EntityHelper.CreateFiscals(parcel, new[] { 2015, 2016, 2017, 2018, 2019 }, FiscalKeys.Estimated, 5);
            EntityHelper.CreateFiscals(parcel, new[] { 2015, 2016, 2017, 2018, 2019 }, FiscalKeys.NetBook, 5);
            var buildings = EntityHelper.CreateBuildings(parcel, 1, 10);
            EntityHelper.CreateEvaluations(buildings.Next(0), new DateTime(2015, 1, 1), 5, EvaluationKeys.Assessed, 5);
            EntityHelper.CreateFiscals(buildings.Next(0), new[] { 2015, 2016, 2017, 2018, 2019 }, FiscalKeys.Estimated, 5);
            EntityHelper.CreateFiscals(buildings.Next(0), new[] { 2015, 2016, 2017, 2018, 2019 }, FiscalKeys.NetBook, 5);

            project.AddProperty(parcel);
            buildings.ForEach(b => project.AddProperty(b));

            // Act
            project.UpdateProjectFinancials();

            // Assert
            project.Estimated.Should().Be(10);
            project.NetBook.Should().Be(10);
            project.Assessed.Should().Be(10);
        }

        [Fact]
        public void UpdateProjectFinancials_Override()
        {
            // Arrange
            var project = EntityHelper.CreateProject(1);
            project.Assessed = 123;
            project.NetBook = 456;
            project.ReportedFiscalYear = 2019;
            var parcel = EntityHelper.CreateParcel(1);
            EntityHelper.CreateEvaluations(parcel, new DateTime(2015, 1, 1), 5, EvaluationKeys.Assessed, 5);
            EntityHelper.CreateFiscals(parcel, new[] { 2015, 2016, 2017, 2018, 2019 }, FiscalKeys.Estimated, 5);
            EntityHelper.CreateFiscals(parcel, new[] { 2015, 2016, 2017, 2018, 2019 }, FiscalKeys.NetBook, 5);
            var buildings = EntityHelper.CreateBuildings(parcel, 1, 10);
            EntityHelper.CreateEvaluations(buildings.Next(0), new DateTime(2015, 1, 1), 5, EvaluationKeys.Assessed, 5);
            EntityHelper.CreateFiscals(buildings.Next(0), new[] { 2015, 2016, 2017, 2018, 2019 }, FiscalKeys.Estimated, 5);
            EntityHelper.CreateFiscals(buildings.Next(0), new[] { 2015, 2016, 2017, 2018, 2019 }, FiscalKeys.NetBook, 5);

            project.AddProperty(parcel);
            buildings.ForEach(b => project.AddProperty(b));

            // Act
            project.UpdateProjectFinancials(true, true);

            // Assert
            project.Estimated.Should().Be(10);
            project.Assessed.Should().Be(123);
            project.NetBook.Should().Be(456);
        }

        [Fact]
        public void UpdateProjectFinancials_OverrideOnProject()
        {
            // Arrange
            var project = EntityHelper.CreateProject(1);
            project.Assessed = 123;
            project.AssessedOverride = true;
            project.NetBook = 456;
            project.NetBookOverride = true;
            project.ReportedFiscalYear = 2019;
            var parcel = EntityHelper.CreateParcel(1);
            EntityHelper.CreateEvaluations(parcel, new DateTime(2015, 1, 1), 5, EvaluationKeys.Assessed, 5);
            EntityHelper.CreateFiscals(parcel, new[] { 2015, 2016, 2017, 2018, 2019 }, FiscalKeys.Estimated, 5);
            EntityHelper.CreateFiscals(parcel, new[] { 2015, 2016, 2017, 2018, 2019 }, FiscalKeys.NetBook, 5);
            var buildings = EntityHelper.CreateBuildings(parcel, 1, 10);
            EntityHelper.CreateEvaluations(buildings.Next(0), new DateTime(2015, 1, 1), 5, EvaluationKeys.Assessed, 5);
            EntityHelper.CreateFiscals(buildings.Next(0), new[] { 2015, 2016, 2017, 2018, 2019 }, FiscalKeys.Estimated, 5);
            EntityHelper.CreateFiscals(buildings.Next(0), new[] { 2015, 2016, 2017, 2018, 2019 }, FiscalKeys.NetBook, 5);

            project.AddProperty(parcel);
            buildings.ForEach(b => project.AddProperty(b));

            // Act
            project.UpdateProjectFinancials();

            // Assert
            project.Estimated.Should().Be(10);
            project.Assessed.Should().Be(123);
            project.NetBook.Should().Be(456);
        }

        [Fact]
        public void SetProjectPropertiesVisiblity()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var context = helper.InitializeDatabase(user);
            var project = context.CreateProject(1);
            var parcel = context.CreateParcel(1);
            project.AddProperty(parcel);

            // Act
            context.SetProjectPropertiesVisiblity(project, false);

            // Assert
            var properties = project.Properties.ToArray();
            foreach (var property in properties)
            {
                if (property.BuildingId.HasValue)
                {
                    property.Building.IsVisibleToOtherAgencies.Should().BeFalse();
                }
                else if (property.ParcelId.HasValue)
                {
                    property.Parcel.IsVisibleToOtherAgencies.Should().BeFalse();
                }
            }
        }
        #endregion
        #endregion
    }
}
