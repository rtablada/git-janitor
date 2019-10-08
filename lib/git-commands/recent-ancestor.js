import gitCmd from '../git-cmd';

export default async function recentAncestor(base, child) {
  return await gitCmd(['merge-base', base, child]);
}
