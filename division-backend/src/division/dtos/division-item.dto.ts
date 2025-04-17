export interface DivisionItemDto {
  id: number;
  name: string;
  superiorName?: string | null;
  collaborators: number;
  level: number;
  subsCount: number;
  ambassador?: string | null;
}
