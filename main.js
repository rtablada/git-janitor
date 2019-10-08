import cleanMergedBranches from './lib/clean-merged-branches';
import yargs from 'yargs';
import inquirer from 'inquirer';
import getRemoteNames from './lib/git-commands/get-remote-names';

async function main() {
  const argv = yargs.argv;
  let remoteNames = await getRemoteNames();

  let { compareSources, defaultBranchName, runType, weeksBack } = await inquirer.prompt([
    {
      type: 'input',
      message: 'What branch are features merged into?',
      name: 'defaultBranchName',
      default: argv.defaultBranch || process.DEFAULT_BRANCH_NAME || 'master',
    },
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
      type: 'number',
      message: 'How many weeks of recent branches do you want to keep (0 to clean all merged branches).',
      name: 'weeksBack',
      default: 3,
    },
    {
      type: 'list',
      message: 'How do you want to run this clean up?',
      name: 'runType',
      default: true,
      choices: [
        { name: 'Dry Run (only log branches to delete)', value: 'dryRun' },
        { name: 'Interactive', value: 'interactive' },
        { name: 'Quiet', value: 'quiet' },
      ],
    },
  ]);

  cleanMergedBranches({ weeksBack, compareSources, defaultBranchName, runType });
}

main();
