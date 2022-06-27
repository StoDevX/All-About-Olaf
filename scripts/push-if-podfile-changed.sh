#!/bin/bash

set -e -v -u -o pipefail

if [ -z "${!branch}" ]; then
    echo 'Need to set environment variable "branch"' && exit 1;
fi

if [ -z "${!actor}" ]; then
    echo 'Need to set environment variable "actor"' && exit 1;
fi

if [ -z "${!head_ref}" ]; then
    echo 'Need to set environment variable "head_ref"' && exit 1;
fi

FILE=ios/Podfile.lock

if [[ -n "$(git status -s -- $FILE)" ]]; then
    exit 0
fi

# eg, "Bump apple-signin-auth-1.4.0 cocoapods packages"
# add `[dependabot skip]` to the body so Dependabot force-pushes any rebases over our changes, triggering the action again
message="Bump ""${branch//dependabot\/npm_and_yarn\// }"" cocoapods packages

[dependabot skip]"

git add "$FILE"

git commit user.name 'github-actions[bot]'
git commit user.email 'github-actions[bot]@users.noreply.github.com'

author="""${actor}"" <${actor}@users.noreply.github.com>"
git commit --author="$author" -m "$message"

git push origin "$head_ref"
