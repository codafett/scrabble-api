import createAdminUser from './scripts/createAdminUser';
import createUsers from './scripts/createUsers';

// eslint-disable-next-line import/prefer-default-export
export default ({
  major: 1,
  minor: 0,
  build: 0,
  scripts: [
    {
      name: 'createAdminUser',
      script: createAdminUser,
    },
    {
      name: 'createUsers',
      script: createUsers,
    },
  ],
});
