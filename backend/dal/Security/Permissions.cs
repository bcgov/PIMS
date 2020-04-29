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
        SystemAdmin,

        [Display(GroupName = "admin", Name = "agency-administrator", Description = "Can administer agencies.")]
        AgencyAdmin,

        [Display(GroupName = "admin", Name = "admin-users", Description = "Can administer user accounts.")]
        AdminUsers,

        [Display(GroupName = "admin", Name = "admin-roles", Description = "Can administer application roles.")]
        AdminRoles,

        [Display(GroupName = "admin", Name = "admin-properties", Description = "Can administer properties.")]
        AdminProperties,

        [Display(GroupName = "property", Name = "property-view", Description = "Can view properties from inventory.")]
        PropertyView,

        [Display(GroupName = "property", Name = "property-add", Description = "Can add new properties to inventory.")]
        PropertyAdd,

        [Display(GroupName = "property", Name = "property-edit", Description = "Can edit properties in inventory.")]
        PropertyEdit,

        [Display(GroupName = "property", Name = "property-delete", Description = "Can delete properties in inventory.")]
        PropertyDelete,

        [Display(GroupName = "property", Name = "sensitive-view", Description = "Can view sensitive properties in inventory.")]
        SensitiveView,

        [Display(GroupName = "dispose", Name = "dispose-request", Description = "Can request to dispose properties in inventory.")]
        DisposeRequest,

        [Display(GroupName = "dispose", Name = "dispose-approve", Description = "Can approve requests to dispose properties in inventory.")]
        DisposeApprove
    }
}
