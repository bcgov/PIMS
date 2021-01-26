using System.ComponentModel.DataAnnotations;

namespace Pims.Dal.Security
{
    /// <summary>
    /// Permissions enum, provides a list of compile-time safe claim names.
    /// These are fixed claims that will control all access within the application.
    ///
    /// Keycloak
    ///     Keycloak calls theses claims 'roles'.
    ///     Within Keycloak users will be assigned to 'groups', which will be composed of 'roles'.
    /// </summary>
    public enum Permissions
    {
        [Display(GroupName = "admin", Name = "system-administrator", Description = "Can administer application settings.")]
        SystemAdmin = 1,

        [Display(GroupName = "admin", Name = "agency-administrator", Description = "Can administer agencies.")]
        AgencyAdmin = 2,

        [Display(GroupName = "admin", Name = "admin-users", Description = "Can administer user accounts.")]
        AdminUsers = 3,

        [Display(GroupName = "admin", Name = "admin-roles", Description = "Can administer application roles.")]
        AdminRoles = 4,

        [Display(GroupName = "admin", Name = "admin-agencies", Description = "Can administer application roles.")]
        AdminAgencies = 5,

        [Display(GroupName = "admin", Name = "admin-properties", Description = "Can administer properties.")]
        AdminProperties = 6,

        [Display(GroupName = "admin", Name = "admin-projects", Description = "Can administer projects.")]
        AdminProjects = 7,

        [Display(GroupName = "property", Name = "property-view", Description = "Can view properties from inventory.")]
        PropertyView = 10,

        [Display(GroupName = "property", Name = "property-add", Description = "Can add new properties to inventory.")]
        PropertyAdd = 11,

        [Display(GroupName = "property", Name = "property-edit", Description = "Can edit properties in inventory.")]
        PropertyEdit = 12,

        [Display(GroupName = "property", Name = "property-delete", Description = "Can delete properties in inventory.")]
        PropertyDelete = 13,

        [Display(GroupName = "property", Name = "sensitive-view", Description = "Can view sensitive properties in inventory.")]
        SensitiveView = 14,

        [Display(GroupName = "dispose", Name = "dispose-request", Description = "Can request to dispose properties in inventory.")]
        DisposeRequest = 20,

        [Display(GroupName = "dispose", Name = "dispose-approve", Description = "Can approve requests to dispose properties in inventory.")]
        DisposeApprove = 21,

        [Display(GroupName = "project", Name = "project-view", Description = "Can view projects.")]
        ProjectView = 30,

        [Display(GroupName = "project", Name = "project-add", Description = "Can add new projects.")]
        ProjectAdd = 31,

        [Display(GroupName = "project", Name = "project-edit", Description = "Can edit projects.")]
        ProjectEdit = 32,

        [Display(GroupName = "project", Name = "project-delete", Description = "Can delete projects.")]
        ProjectDelete = 33,

        [Display(GroupName = "project", Name = "reports-view", Description = "Can view project reports.")]
        ReportsView = 34,

        [Display(GroupName = "project", Name = "reports-spl", Description = "Can view, create and modify non-final SPL reports.")]
        ReportsSpl = 35,

        [Display(GroupName = "project", Name = "reports-spl-admin", Description = "Can view, create, modify and delete all SPL reports.")]
        ReportsSplAdmin = 36
    }
}
