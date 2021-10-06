#!/bin/bash -e

defaultName="assignment"
defaultDesc="im-serverless-description"

echo "Create new project"
read -p "Project name: " projectName
read -p "Project description: " projectDesc

echo "Rename project folder"
mv  "../$defaultName" "../$projectName"
cd "../$projectName"

echo "Setting up project: $projectName"
sed -i -e "s/$defaultName/$projectName/g" package.json
sed -i -e "s/$defaultDesc/$projectDesc/g" package.json
sed -i -e "s/$defaultName/$projectName/g" serverless.yml
sed -i -e "s/$defaultName/$projectName/g" ./bin/docker-entrypoint-initaws.d/10-aws-resources.sh
sed -i -e "s/$defaultName/$projectName/g" README.md
sed -i -e "s/$defaultName/$projectName/g" ./bin/start-localstack.sh

rm serverless.yml-e
rm package.json-e
rm README.md-e
rm ./bin/docker-entrypoint-initaws.d/10-aws-resources.sh-e
rm ./bin/start-localstack.sh-e

echo "Create `.env.local.yml` file"
cp env.yml.example .env.local.yml

echo "Add git remote as origin: git@github.com:Instamotion/$projectName.git"
git remote set-url origin "git@github.com:Instamotion/$projectName.git"

echo "Install dependencies"
npm i

echo "Commit changes"
git add .
git commit -m "Init project"

read -p "Do you want to push[no]: yes/no " push

if [[ "$push" == "yes" ]]; then
  git push origin HEAD
else
  echo "Skip pushing"
fi

echo "Copy prepare commit message"
cp ./bin/prepare-commit-msg.sh ./.git/hooks/prepare-commit-msg

echo "Init project done. Enjoy!"
