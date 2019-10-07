import childProcess from 'child_process';

export default async function gitCmd(args) {
  let stdout = await new Promise((resolve, reject) => {
    const child = childProcess.spawn('git', args);

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => (stdout += data));
    child.stderr.on('data', (data) => (stderr += data));

    child.on('close', (exitCode) => (exitCode ? reject(stderr) : resolve(stdout)));
  });

  return stdout.replace(/\n$/, '');
}
