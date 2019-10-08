import deleteBranch from './git-commands/delete-branch';
import checkIfBranchMerged from './git-commands/check-if-branch-merged';
import getAllBranchInfo from './git-commands/get-all-branch-info';

async function getDeleteBranchResult(branchName, defaultBranchName) {
  try {
    let result = await checkIfBranchMerged(branchName, defaultBranchName);

    return { branchName, result };
  } catch (error) {
    console.log(error);
  }
}

export default async function cleanMergedBranches({ defaultBranchName = 'master', dryRun = false }) {
  let branches = await getAllBranchInfo();
  let branchNames = branches.map((b) => b.name);

  if (branchNames.indexOf(defaultBranchName) === -1) {
    throw `fatal: no branch named '${defaultBranchName}' found in this repo`;
  }

  let deleteableBranchResults = await Promise.all(
    branchNames.map(async (b) => await getDeleteBranchResult(b, defaultBranchName))
  );

  let deleteableBranches = deleteableBranchResults.filter(({ result }) => result).map(({ branchName }) => branchName);

  if (dryRun) {
    deleteableBranches.forEach((branchName) => {
      console.log(`"${branchName}" will be removed`);
    });
  }

  for (let i = 0; i < deleteableBranches.length; i++) {
    const branchName = deleteableBranches[i];

    console.log(await deleteBranch(branchName));
  }
}
