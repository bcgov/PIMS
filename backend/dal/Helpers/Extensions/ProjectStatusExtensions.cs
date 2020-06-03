using Pims.Dal.Entities;

namespace Pims.Dal.Helpers.Extensions
{
    public static class ProjectStatusExtensions
    {
        public static bool StatusMatch(this ProjectStatus projectStatus, ProjectStatusNames match)
        {
            return projectStatus.Id == (int) match;
        }

        public static bool IsDenied(this ProjectStatus projectStatus)
        {
            return projectStatus.StatusMatch(ProjectStatusNames.Denied);
        }

        public static bool IsDraft(this ProjectStatus projectStatus)
        {
            return projectStatus.StatusMatch(ProjectStatusNames.Draft);
        }

        public static bool IsApproved(this ProjectStatus projectStatus)
        {
            return projectStatus.StatusMatch(ProjectStatusNames.Approved);
        }

        public static bool IsSubmitted(this ProjectStatus projectStatus)
        {
            return projectStatus.StatusMatch(ProjectStatusNames.Submitted);
        }

        public enum ProjectStatusNames
        {
            Draft,
            SelectProperties,
            UpdateInformation,
            RequireDocumentation,
            Approval,
            ApprovalDocumentation,
            Submitted,
            PropertyReview,
            DocumentReview,
            FirstNationConsultation,
            Approved,
            Denied
        }
    }
}
