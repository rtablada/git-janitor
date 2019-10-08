import gitCmd from '../git-cmd';

export default async function deleteLocalBranch(branchName) {
  return await gitCmd(['branch', '-D', branchName]);
}
