import gitCmd from '../git-cmd';

export default async function checkBranchExists(branchName) {
  let matches = await gitCmd(['branch', '--list', branchName]);

  return matches.split('\n').includes(branchName);
}
