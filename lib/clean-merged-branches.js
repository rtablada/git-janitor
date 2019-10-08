import deleteRef from './git-commands/delete-ref';
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

  let deleteableBranchResults = await Promise.all(
    refsToCompare.map(async (ref) => {
      let shouldDelete = await getDeleteBranchResult(ref.refname, defaultRef);

      return { shouldDelete, ref };
    })
  );

  let deleteableBranches = deleteableBranchResults.filter(({ shouldDelete }) => shouldDelete).map(({ ref }) => ref);

  if (dryRun) {
    return deleteableBranches.forEach((ref) => {
      console.log(`"${ref.shortRefname}" will be removed`);
    });
  }

  for (let i = 0; i < deleteableBranches.length; i++) {
    const ref = deleteableBranches[i];

    console.log(await deleteRef(ref));
  }
}
