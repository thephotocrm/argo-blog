const REPO = 'thephotocrm/argo-blog';
const BRANCH = 'main';

function getToken(): string {
  const token = import.meta.env.GITHUB_PAT || process.env.GITHUB_PAT;
  if (!token) throw new Error('GITHUB_PAT not configured');
  return token;
}

interface GitHubFile {
  content: string;
  sha: string;
}

async function getFile(path: string): Promise<GitHubFile> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `token ${getToken()}`, Accept: 'application/vnd.github.v3+json' } }
  );
  if (!res.ok) throw new Error(`GitHub GET ${path}: ${res.status}`);
  const data = await res.json();
  return {
    content: Buffer.from(data.content, 'base64').toString('utf8'),
    sha: data.sha,
  };
}

async function putFile(path: string, content: string, sha: string, message: string): Promise<void> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${getToken()}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString('base64'),
        sha,
        branch: BRANCH,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub PUT ${path}: ${res.status} ${err}`);
  }
}

export async function readGitHubJSON(repoPath: string): Promise<any> {
  const file = await getFile(repoPath);
  return { data: JSON.parse(file.content), sha: file.sha };
}

export async function writeGitHubJSON(repoPath: string, data: any, sha: string, message: string): Promise<void> {
  await putFile(repoPath, JSON.stringify(data, null, 2) + '\n', sha, message);
}
