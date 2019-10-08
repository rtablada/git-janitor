import deleteRef from './git-commands/delete-ref';
import checkIfBranchMerged from './git-commands/check-if-branch-merged';
import getAllBranchInfo from './git-commands/get-all-branch-info';
import getRemoteBranches from './git-commands/get-remote-branches';
import _ from 'lodash';
import checkBranchExists from './git-commands/check-branch-exists';
import moment from 'moment';
import inquirer from 'inquirer';

async function promptDelete(ref) {
  let { result } = await inquirer.prompt({
    name: 'result',
    type: 'confirm',
    message: `Do you want to delete "${ref.shortRefname}?`,
    default: true,
  });

  return result;
}

export default async function cleanMergedBranches({
  compareSources = [],
  defaultBranchName = 'master',
  runType = false,
  weeksBack = 0,
}) {
  let dryRun = runType === 'dryRun';
  let interactive = runType === 'interactive';
  let filterAfterDate = moment().subtract(weeksBack, 'week');

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
      let shouldDelete = await checkIfBranchMerged(ref.refname, defaultRef);

      return { shouldDelete, ref };
    })
  );

  let deleteableBranches = deleteableBranchResults
    .filter(({ shouldDelete, ref }) => shouldDelete && filterAfterDate.isSameOrAfter(ref.commitDate))
    .map(({ ref }) => ref);

  if (deleteableBranches.length === 0) {
    return console.log('Your git branches are all neat and tidy! Nothing to do here!');
  }

  if (dryRun) {
    return deleteableBranches.forEach((ref) => {
      console.log(`"${ref.shortRefname}" will be removed`);
    });
  }

  for (let i = 0; i < deleteableBranches.length; i++) {
    const ref = deleteableBranches[i];

    if (!interactive || (await promptDelete(ref))) {
      console.log(await deleteRef(ref));
    }
  }

  console.log('Now your git branches are all neat and tidy!');
}
