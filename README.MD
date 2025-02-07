# Estate Manager

## Initializing a New Repository
To create a new repository and push it to GitHub, run the following commands:

```sh
echo "# estate-manager" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:torama-ng/estate-manager.git
git push -u origin main
```

## Pushing an Existing Repository
If you already have a repository and want to push it to GitHub, use the following commands:

```sh
git remote add origin git@github.com:torama-ng/estate-manager.git
git branch -M main
git push -u origin main

