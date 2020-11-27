export interface IActor {
  initial_state: number;
  casualties: number;
  commander: string;
  army_name: string[];
  actor_name: string;
  is_winner?: boolean;
}
