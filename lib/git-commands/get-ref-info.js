import gitCmd from '../git-cmd';
import moment from 'moment';

export default async function getRefInfo(refLocation) {
  let remoteRefBase = refLocation.match('^refs/remotes/(.*)');
  let remoteName = remoteRefBase ? remoteRefBase[1] : null;

  let refOutput = await gitCmd([
    'for-each-ref',
    refLocation,
    '--format=%(refname)\t%(committerdate:rfc2822)\t%(refname:short)',
  ]);
  let refs = refOutput.split('\n');

  return refs.map((ref) => {
    let [refname, commitDateString, shortRefname] = ref.split('\t');
    let commitDate = moment(commitDateString);
    let remoteBranch = refname.match(`^refs/remotes/${remoteName}/(.*)`);

    return {
      commitDate,
      commitDateString,
      refname,
      shortRefname,
      isRemote: !!remoteName,
      remoteName,
      remoteBranchName: remoteBranch ? remoteBranch[1] : null,
    };
  });
}
