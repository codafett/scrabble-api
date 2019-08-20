import Permissions from './permissions';
import { matchWholeWord } from '../utils/stringUtils';

export const GROUP_ADMIN = 'Admin';

export const AdminGroup = {
  name: GROUP_ADMIN,
  description: 'Full administration rights.',
  permissions: [
    Permissions.user.add,
    Permissions.user.edit,
    Permissions.user.list,
  ],
};

const Groups = [
  AdminGroup,
];

export default Groups;

export function getGroup(name) {
  const [sg] = Groups.filter(g => matchWholeWord(g.name, name));
  return sg;
}
