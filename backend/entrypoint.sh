#!/bin/bash
# export MAIL_SERVER_URL=`route -n | grep "UG" | grep -v "UGH" | cut -f 10 -d " "`
# export MAIL_SERVER_PORT=1025
dotnet Pims.Api.dll
