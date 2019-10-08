# Git Janitor

This is a simple script to clean up your git repos.

This tool specifically started as a way to clean up merged branches in projects which heavily rely on rebase or squash merges where simpler git scripts may not remove old stale branches.

## Usage

Install this package as a global package using NPM or Yarn:

```
yarn global add git-janitor
npm install -g git-janitor
```

Then run the Git Janitor command in your git repo

```
git-janitor
```

The prompt will then lead you through asking what branch you use for your main branch (where things get merged to), what sources you want to remove merged branches from (currently supports local branches and remotes), how many weeks you want to keep of merged branches (in case you don't want to quite clean everything), and if you want to run a dry run (to see what `git-janitor` would delete).

## Why

Merged branches, orphaned branches, and more can take up precious space on your development machine; especially in Monorepo apps with large teams. Plus: Node Filesystem, editors, and tools like Eslint will often traverse the `.git` repo even when ignored possibly leading to slow builds or large memory usage.

This is a simple tool that *should* help to remove merged branches from taking up extra resources and possibly causing trouble.

## Warning

This script is greedy about deleting branches and there are likely edgecases that are not accounted for. You have been warned!
If you'd like to account for other edgecases or help with the project, feel free to submit a PR or Issue.

## Thanks

A huge shout out to Raquel Moss and the package [git-delete-squashed](https://github.com/raquelxmoss/git-delete-squashed) which is the basis for this script. Most of the squashed branch cleanup is an updated version of that package updated for recent Node versions.
