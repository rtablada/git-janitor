import deleteLocalBranch from './delete-local-branch';
import deleteRemoteBranch from './delete-remote-branch';

export default async function deleteRef(ref) {
  if (!ref.isRemote) {
    return await deleteLocalBranch(ref.shortRefname);
  }

  return await deleteRemoteBranch(ref.remoteName, ref.remoteBranchName);
}
