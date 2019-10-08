import gitCmd from '../git-cmd';
import createCommitTreeBetweenBranches from './create-commit-tree-between-branches';

export default async function checkIfBranchMerged(child, base) {
  let tempCommitId = await createCommitTreeBetweenBranches(child, base);

  let cherryOutput = await gitCmd(['cherry', base, tempCommitId]);
  return cherryOutput.startsWith('-');
}
