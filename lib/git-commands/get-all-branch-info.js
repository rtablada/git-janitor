import getRefInfo from './get-ref-info';

export default async function getAllBranchInfo() {
  return await getRefInfo('refs/heads/');
}
