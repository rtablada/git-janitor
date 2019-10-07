import cleanMergedBranches from './lib/clean-merged-branches';
import yargs from 'yargs';

const argv = yargs.argv;

const defaultBranchName = argv.defaultBranch || process.DEFAULT_BRANCH_NAME || 'master';
const dryRun = argv.dryRun;

cleanMergedBranches({ defaultBranchName, dryRun });
