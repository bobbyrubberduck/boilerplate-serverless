#!/bin/bash -e

################################################################################
# Prepare commit message hook, prepend a message to a commit with the type     #
# and the number of the ticket using the branch name.                          #
# Ex.                                                                          #
# branch name = feature/GAR-123-asdf                                           #
# prefix commit = F [GAR-123]                                                  #
# supported only feature and bugfix. For more change the BRANCH_REGEX          #
#                                                                              #
# Requirements:                                                                #
#   - branch name: [TYPE-TICKET]/[TICKET-ID]-random-text                       #
#   - TYPE-TICKET: 'feature' or 'bugfix'                                       #
#   - TICKET-ID: like -> PRJ-123                                               #
#                                                                              #
# Install:                                                                     #
#   - copy in: your-project-path/.git/hooks                                    #
#   - or for global copy in: ~/.git/hooks                                      #
################################################################################

BRANCH_REGEX='^(feature|bugfix|next|chore|hotfix)\/[A-Z]+-[0-9]+-'
BRANCH_NAME=$(git symbolic-ref --short HEAD)

echo "Branch -$BRANCH_NAME-"

if ! [[ $BRANCH_NAME =~ $BRANCH_REGEX ]]; then
  echo "❗️ Branch name $BRANCH_NAME is not valid (case sensitive). Ex. feature/GAR-123-message"

  exit 1
fi

PREPARE_COMMIT_MSG=$(
  echo $BRANCH_NAME |
  grep -E -e $BRANCH_REGEX |
  sed -e 's|\([a-z]\).*/\([A-Z]*-[0-9]*\).*|\1 [\2]|' -e 'y|abcdefghijklmnopqrstuvwxyz|ABCDEFGHIJKLMNOPQRSTUVWXYZ|'
)

COMMIT_MESSAGE=$(cat $1)

if [[ -n "$PREFIX_COMMIT_MSG" && $COMMIT_MESSAGE != "$PREFIX_COMMIT_MSG"* ]]; then
  echo "$PREFIX_COMMIT_MSG $COMMIT_MESSAGE" > $1
fi

exit 0
