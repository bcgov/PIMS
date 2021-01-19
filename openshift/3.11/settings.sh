export PROJECT_NAMESPACE="jcxjin"

export GIT_URI="https://github.com/bcgov/PIMS.git"
export GIT_REF="dev"

# The templates that should not have their GIT references (uri and ref) over-ridden
# Templates NOT in this list will have they GIT references over-ridden
# with the values of GIT_URI and GIT_REF
export -a skip_git_overrides=""

# The builds to be triggered after buildconfigs created (not auto-triggered)
export builds=""