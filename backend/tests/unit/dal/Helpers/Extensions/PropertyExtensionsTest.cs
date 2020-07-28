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
    public class PropertyExtensionsTest
    {
        #region Tests

        [Fact]
        public void RemoveEvaluationsWithinOneYear_ParcelEvaluations()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var context = helper.InitializeDatabase(user);
            var parcel = context.CreateParcel(1);
            var olderThenOneYear = new Entities.ParcelEvaluation()
            {
                Date = DateTime.Now.AddYears(1).AddDays(1),
                Value = 1,
                Key = EvaluationKeys.Appraised,
            };
            var toRemove = new Entities.ParcelEvaluation()
            {
                Date = DateTime.Now.AddDays(1),
                Value = 2,
                Key = EvaluationKeys.Appraised,
            };
            var toNotRemove = new Entities.ParcelEvaluation()
            {
                Date = DateTime.Now.AddDays(-1),
                Value = 3,
                Key = EvaluationKeys.Appraised,
            };
            parcel.Evaluations.Add(olderThenOneYear);
            parcel.Evaluations.Add(toRemove);
            parcel.Evaluations.Add(toNotRemove);

            // Act
            parcel.RemoveEvaluationsWithinOneYear(DateTime.Now);

            // Assert
            parcel.Evaluations.Should().Contain(toNotRemove);
            parcel.Evaluations.Should().Contain(olderThenOneYear);
            parcel.Evaluations.Should().NotContain(toRemove);
        }

        [Fact]
        public void RemoveEvaluationsWithinOneYear_BuildingEvaluations()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var context = helper.InitializeDatabase(user);
            var parcel = context.CreateParcel(1);
            var building = context.CreateBuilding(parcel, 2);
            var olderThenOneYear = new Entities.BuildingEvaluation()
            {
                Date = DateTime.Now.AddYears(1).AddDays(1),
                Value = 1,
                Key = EvaluationKeys.Appraised,
            };
            var toRemove = new Entities.BuildingEvaluation()
            {
                Date = DateTime.Now.AddDays(1),
                Value = 2,
                Key = EvaluationKeys.Appraised,
            };
            var toNotRemove = new Entities.BuildingEvaluation()
            {
                Date = DateTime.Now.AddDays(-1),
                Value = 3,
                Key = EvaluationKeys.Appraised,
            };
            building.Evaluations.Add(olderThenOneYear);
            building.Evaluations.Add(toRemove);
            building.Evaluations.Add(toNotRemove);

            // Act
            building.RemoveEvaluationsWithinOneYear(DateTime.Now);

            // Assert
            building.Evaluations.Should().Contain(toNotRemove);
            building.Evaluations.Should().Contain(olderThenOneYear);
            building.Evaluations.Should().NotContain(toRemove);
        }
        #endregion
    }
}
