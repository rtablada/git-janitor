import gitCmd from '../git-cmd';

export default async function deleteBranch(branchName) {
  return await gitCmd(['branch', '-D', branchName]);
}
