import deleteBranch from './git-commands/delete-branch';
import checkIfBranchMerged from './git-commands/check-if-branch-merged';
import getAllBranchInfo from './git-commands/get-all-branch-info';
import getRemoteBranches from './git-commands/get-remote-branches';
import _ from 'lodash';
import checkBranchExists from './git-commands/check-branch-exists';

async function getDeleteBranchResult(branchName, defaultBranchName) {
  try {
    let result = await checkIfBranchMerged(branchName, defaultBranchName);

    return { branchName, result };
  } catch (error) {
    console.log(error);
  }
}

export default async function cleanMergedBranches({
  compareSources = [],
  defaultBranchName = 'master',
  dryRun = false,
}) {
  if (!checkBranchExists(defaultBranchName)) {
    throw `fatal: no branch named '${defaultRef}' found in this repo`;
  }

  let defaultRef = `refs/heads/${defaultBranchName}`;
  let refsToComparePerSource = await Promise.all(
    compareSources.map(async (source) => {
      return source.local ? await getAllBranchInfo() : await getRemoteBranches(source.remoteName);
    })
  );
  let refsToCompare = _.flatten(refsToComparePerSource);
  let branchNames = refsToCompare.map((b) => b.shortRefname);

  let deleteableBranchResults = await Promise.all(
    branchNames.map(async (b) => await getDeleteBranchResult(b, defaultRef))
  );

  let deleteableBranches = deleteableBranchResults.filter(({ result }) => result).map(({ branchName }) => branchName);

  if (dryRun) {
    return deleteableBranches.forEach((branchName) => {
      console.log(`"${branchName}" will be removed`);
    });
  }

  for (let i = 0; i < deleteableBranches.length; i++) {
    const branchName = deleteableBranches[i];

    console.log(await deleteBranch(branchName));
  }
}
