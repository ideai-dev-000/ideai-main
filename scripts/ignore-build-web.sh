#!/bin/bash
# Ignored Build Step for web project
# Only build if apps/web or packages/ changed

git diff HEAD^ HEAD --quiet apps/web packages/








