import type { Team } from './team';
import type { User } from './user';

export type Request = {
  requestId: number;
  user?: User;
  team?: Team;
  accepted?: boolean;
};
