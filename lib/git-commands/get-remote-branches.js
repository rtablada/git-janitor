import getRefInfo from './get-ref-info';

export default async function getRemoteBranches(remote) {
  return await getRefInfo(`refs/remotes/${remote}`);
}
