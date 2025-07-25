import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'team.json');

  if (req.method === 'GET') {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const team = JSON.parse(fileContents);
    res.status(200).json(team);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
