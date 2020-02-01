import * as fs from 'fs';
import * as path from 'path';


function getMedications (req: any, res: any){
  try {
    const data = fs.readFileSync(path.join(__dirname, './stats.json'));
    const stats = JSON.parse(data.toString());
    const playerStats = stats.find((player: { id: number; }) => player.id === Number(req.params.id));
    res.json({});
  } catch (e) {
    res.sendStatus(500);
  }
}

exports.getMedications = getMedications;
