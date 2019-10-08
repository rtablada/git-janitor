import gitCmd from '../git-cmd';

export default async function getTree(revName) {
  return await gitCmd(['rev-parse', `${revName}^{tree}`]);
}
