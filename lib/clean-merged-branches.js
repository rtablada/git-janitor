import gitCmd from './git-cmd';

async function getDeleteBranchResult(branchName, defaultBranchName) {
  try {
    let ancestorHash = await gitCmd(['merge-base', defaultBranchName, branchName]);
    let treeId = await gitCmd(['rev-parse', `${branchName}^{tree}`]);
    let danglingCommitId = await gitCmd([
      'commit-tree',
      treeId,
      '-p',
      ancestorHash,
      '-m',
      `Temp commit for ${branchName}`,
    ]);
    let cherryOutput = await gitCmd(['cherry', defaultBranchName, danglingCommitId]);
    let result = cherryOutput.startsWith('-');

    return { branchName, result };
  } catch (error) {
    console.log(error);
  }
}

export default async function cleanMergedBranches({ defaultBranchName = 'master', dryRun = false }) {
  let branchListOutput = await gitCmd(['for-each-ref', 'refs/heads/', '--format=%(refname:short)']);
  let branchNames = branchListOutput.split('\n');

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

    console.log(await gitCmd(['branch', '-D', branchName]));
  }
}
