import gitCmd from '../git-cmd';

export default async function deleteRemoteBranch(remote, branch) {
  console.log(`Deleting branch "${branch}" from "${remote}"`);

  return await gitCmd(['push', remote, '--delete', branch]);
}
