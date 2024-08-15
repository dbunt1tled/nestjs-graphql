export interface FilterCondition {
  where: object;
  skip?: number;
  take?: number;
  order?: object;
  relations?: string[];
}
