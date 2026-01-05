#!/bin/bash
# Ignored Build Step for web project
# Only build if apps/web or packages/ changed
# @location scripts/ideai-develop-ignore-build-web.sh

git diff HEAD^ HEAD --quiet apps/web packages/


