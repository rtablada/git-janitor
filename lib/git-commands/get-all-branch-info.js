import gitCmd from '../git-cmd';
import moment from 'moment';

export default async function getAllBranchInfo() {
  let refOutput = await gitCmd(['for-each-ref', 'refs/heads/', '--format=%(refname:short)\t%(committerdate:rfc2822)']);
  let refs = refOutput.split('\n');

  return refs.map((ref) => {
    let [name, commitDateString] = ref.split('\t');
    let commitDate = moment(commitDateString);
    return {
      commitDate,
      commitDateString,
      name,
    };
  });
}
