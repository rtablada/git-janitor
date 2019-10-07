# Git Janitor

This is a simple script to clean up your git repos.

This tool specifically started as a way to clean up merged branches in projects which heavily rely on rebase or squash merges where simpler git scripts may not remove old stale branches.

## Why

Merged branches, orphaned branches, and more can take up precious space on your development machine; especially in Monorepo apps with large teams. Plus: Node Filesystem, editors, and tools like Eslint will often traverse the `.git` repo even when ignored possibly leading to slow builds or large memory usage.

This is a simple tool that *should* help to remove merged branches from taking up extra resources and possibly causing trouble.

## Warning

This script is greedy about deleting branches and there are likely edgecases that are not accounted for. You have been warned!
If you'd like to account for other edgecases or help with the project, feel free to submit a PR or Issue.

## Thanks

A huge shout out to Raquel Moss and the package [git-delete-squashed](https://github.com/raquelxmoss/git-delete-squashed) which is the basis for this script. Most of the squashed branch cleanup is an updated version of that package updated for recent Node versions.
