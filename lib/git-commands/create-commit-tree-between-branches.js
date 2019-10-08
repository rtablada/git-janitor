import recentAncestor from './recent-ancestor';
import getTree from './get-tree';
import gitCmd from '../git-cmd';

export default async function createCommitTreeBetweenBranches(childBranch, parentBranch) {
  let ancestorHash = await recentAncestor(childBranch, parentBranch);
  let treeId = await getTree(childBranch);
  return await gitCmd(['commit-tree', treeId, '-p', ancestorHash, '-m', `Temp commit for ${childBranch}`]);
}
