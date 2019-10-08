import cleanMergedBranches from './lib/clean-merged-branches';
import yargs from 'yargs';
import inquirer from 'inquirer';
import getRemoteNames from './lib/git-commands/get-remote-names';

async function main() {
  const argv = yargs.argv;
  let remoteNames = await getRemoteNames();

  let { compareSources, defaultBranchName, dryRun } = await inquirer.prompt([
    {
      type: 'checkbox',
      message: 'What sources do you want to clean?',
      name: 'compareSources',
      choices: [
        { name: 'Local branches', value: { local: true }, checked: true },
        ...remoteNames.map((r) => ({ name: `Remote: ${r}`, value: { remote: true, remoteName: r } })),
      ],
    },
    {
      type: 'input',
      message: 'What branch are features merged into?',
      name: 'defaultBranchName',
      default: argv.defaultBranch || process.DEFAULT_BRANCH_NAME || 'master',
    },
    {
      type: 'confirm',
      message: 'Do you want to run a dry run (only log changes)?',
      name: 'dryRun',
      default: true,
    },
  ]);

  cleanMergedBranches({ compareSources, defaultBranchName, dryRun });
}

main();
