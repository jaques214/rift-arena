import type { User } from './user';
import type { Team } from './team';

export type Request = {
  requestId: number;
  user?: User;
  team?: Team;
  accepted?: boolean;
};
