import { Division } from 'src/division/division';
import { DataSource } from 'typeorm';

export const seedDivisions = async (dataSource: DataSource): Promise<void> => {
  const repo = dataSource.getRepository(Division);
  const count = await repo.count();
  if (count > 0) return;

  const divisions: Division[] = [];

  for (let i = 1; i <= 20; i++) {
    const division = new Division();
    division.name = `División ${i}`;
    division.level = Math.floor(Math.random() * 10) + 1;
    division.collaborators = Math.floor(Math.random() * 6) + 10;
    division.ambassador = Math.random() < 0.5 ? `Embajador ${i}` : undefined;
    division.superior = null;

    if (i > 5 && Math.random() < 0.6) {
      const superiorIndex = Math.floor(Math.random() * (i - 1));
      division.superior = divisions[superiorIndex];
    }

    divisions.push(division);
  }

  await repo.save(divisions);
};
