import { Division } from 'src/division/division';
import { DataSource } from 'typeorm';

export const seedDivisions = async (dataSource: DataSource): Promise<void> => {
  const repo = dataSource.getRepository(Division);
  const count = await repo.count();
  if (count > 0) return;

  const divisions: Division[] = [];
  const totalDivisions = 30;
  const maxLevel = 5;

  for (let i = 1; i <= 5; i++) {
    const division = new Division();
    division.name = `División Principal ${i}`;
    division.level = 1;
    division.collaborators = Math.floor(Math.random() * 20) + 30;
    division.ambassador = Math.random() < 0.7 ? `Embajador Principal ${i}` : undefined;
    division.superior = null;
    divisions.push(division);
  }

  for (let level = 2; level <= maxLevel; level++) {
    const superiorDivisions = divisions.filter(d => d.level === level - 1);
    const divisionsPerLevel = Math.floor(totalDivisions / maxLevel);

    for (let i = 1; i <= divisionsPerLevel; i++) {
      const division = new Division();
      division.name = `División Nivel ${level}-${i}`;
      division.level = level;
      division.collaborators = Math.floor(Math.random() * 15) + 10;
      division.ambassador = Math.random() < 0.5 ? `Embajador ${level}-${i}` : undefined;

      if (superiorDivisions.length > 0) {
        const randomIndex = Math.floor(Math.random() * superiorDivisions.length);
        division.superior = superiorDivisions[randomIndex];
      }

      divisions.push(division);
    }
  }

  const remaining = totalDivisions - divisions.length;
  for (let i = 1; i <= remaining; i++) {
    const division = new Division();
    division.name = `División Adicional ${i}`;
    division.level = Math.floor(Math.random() * maxLevel) + 1;
    division.collaborators = Math.floor(Math.random() * 10) + 5;
    division.ambassador = Math.random() < 0.3 ? `Embajador Adicional ${i}` : undefined;

    if (Math.random() < 0.5 && divisions.length > 0) {
      const randomIndex = Math.floor(Math.random() * divisions.length);
      division.superior = divisions[randomIndex];
    }

    divisions.push(division);
  }

  await repo.save(divisions);
};
