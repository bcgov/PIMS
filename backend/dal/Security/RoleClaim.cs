namespace Pims.Dal.Security
{
    public enum RoleClaim
    {
        [ClaimName("admin-users")]
        AdminUsers,

        [ClaimName("admin-users")]
        AdminRoles,

        [ClaimName("admin-users")]
        PropertyView,

        [ClaimName("admin-users")]
        PropertyAdd,

        [ClaimName("admin-users")]
        PropertyEdit,

        [ClaimName("admin-users")]
        DisposeRequest,

        [ClaimName("admin-users")]
        DisposeApprove,

        [ClaimName("admin-users")]
        SensitiveView
    }
}
