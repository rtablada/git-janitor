import gitCmd from '../git-cmd';

export default async function getRemoteNames() {
  let output = await gitCmd(['remote']);

  return output.split('\n');
}
