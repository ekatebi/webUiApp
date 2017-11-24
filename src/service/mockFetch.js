import fetchMock from 'fetch-mock';
import { serverPath, serverHost } from '../constant/app';
import escape from 'escape-regexp';

const profiles = ['documentclass', 'documenttype', 'organization', 'user'];


//----------------------------------------------
// SignIn
fetchMock.mock(
  {
    name: 'login',
    matcher: `${serverHost}/token`,
    response: { token: '====token string====' },
  }
);

// CULTURES
import allCultures from '../../test/data/cultures/allCultures.json';
import enabledCultures from '../../test/data/cultures/enabledCultures.json';
fetchMock.mock([
  {
    name: 'cultures',
    matcher: `${serverPath}/cultures`,
    response: allCultures,
  },
  {
    name: 'cultures/active/true',
    matcher: `${serverPath}/cultures/active/true`,
    response: enabledCultures,
    // response: { status: 204 }
  },
  {
    name: 'cultures/active',
    matcher: new RegExp(escape(`${serverPath}/cultures/active`)),
    method: 'PUT',
    response: (url, opts) => ({ url, ...opts.body }),
  }
]);

//----------------------------------------------
// PROFILELISTS
import docClasses from '../../test/data/profiles/docClassProfileList.json';
import docTypes from '../../test/data/profiles/docTypeProfileList.json';
import orgs from '../../test/data/profiles/orgProfileList.json';
import users from '../../test/data/profiles/userProfileList.json';
const profileList = ['documentclasses', 'documenttypes', 'organizations', 'users'];
const response = [docClasses, docTypes, orgs, users];
fetchMock.mock(profileList.map((profile, index) =>
  ({
    name: profile,
    matcher: `${serverPath}/${profile}`,
    response: response[index],
  })
));

//----------------------------------------------
// PROFILES
import identity from '../../test/data/profiles/identity1.json';
fetchMock.mock(profiles.map((profile, index) =>
  ({
    name: profile,
    matcher: new RegExp(`${serverPath}/${profileList[index]}/[0-9]+/identity`),
    response: identity,
  })
));

//----------------------------------------------
// PROFILE NAVS
import nav from '../../test/data/profiles/nav1.json';
fetchMock.mock(profiles.map((profile, index) =>
  ({
    name: `${profile}-nav`,
    matcher: new RegExp(`${serverPath}/${profileList[index]}/[0-9]+/nav`),
    response: nav,
  })
));

//----------------------------------------------
// PROFILE CUSTOM PROPERTIES
import custom from '../../test/data/profiles/custom1.json';
fetchMock.mock(profiles.map((profile, index) =>
  ({
    name: `${profile}-custom`,
    matcher: new RegExp(`${serverPath}/${profileList[index]}/[0-9]+/custom`),
    response: custom,
  })
));

//----------------------------------------------
// PROFILE RELATIONSHIPS
import relationships from '../../test/data/profiles/relationships.json';
fetchMock.mock(profiles.map((profile, index) =>
  ({
    name: `${profile}-relationships`,
    matcher: new RegExp(`${serverPath}/${profileList[index]}/[0-9]+/relationships`),
    response: relationships,
  })
));

//----------------------------------------------
// PROFILE SECTIONS
import section1 from '../../test/data/profiles/section1.json';
import section2 from '../../test/data/profiles/section2.json';
import section3 from '../../test/data/profiles/section3.json';
const sections = [section1, section2, section3];
fetchMock.mock(profiles.map((profile, index) =>
  ({
    name: `${profile}-sections`,
    matcher: new RegExp(`${serverPath}/${profileList[index]}/[0-9]+/sections/[0-9]+`),
    response: (url) => {
      const index = url.split('/').pop() - 1;
      // console.log('#####INDEX:', index);
      return sections[index];
    }
  })
));
