
if [ "$1" = "add" ]; then
  oc process -f git-binding.yaml --param-file=b.dev.env | oc create -f -
  oc process -f git-triggertemplate.yaml --param-file=tt-api.env | oc create -f -
  oc process -f git-triggertemplate.yaml --param-file=tt-app.env | oc create -f -
  oc process -f git-eventlistener.yaml --param-file=el-api.dev.env | oc create -f -
  oc process -f git-eventlistener.yaml --param-file=el-app.dev.env | oc create -f -
  oc process -f git-ingress.yaml | oc create -f -
  oc create -f route.yaml
else
  oc delete -f route.yaml
  oc process -f git-ingress.yaml | oc delete -f -
  oc process -f git-binding.yaml --param-file=b.dev.env | oc delete -f -
  oc process -f git-triggertemplate.yaml --param-file=tt-api.env | oc delete -f -
  oc process -f git-triggertemplate.yaml --param-file=tt-app.env | oc delete -f -
  oc process -f git-eventlistener.yaml --param-file=el-api.dev.env | oc delete -f -
  oc process -f git-eventlistener.yaml --param-file=el-app.dev.env | oc delete -f -
fi
