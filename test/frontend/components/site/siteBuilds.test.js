import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SiteBuilds from '../../../../frontend/components/site/siteBuilds';
import LoadingIndicator from '../../../../frontend/components/loadingIndicator';

let user;
let site;
let build;
let props;

describe('<SiteBuilds/>', () => {
  beforeEach(() => {
    user = {
      id: 1,
      username: 'user123',
    };
    site = {
      id: '🎫',
    };
    build = {
      user,
      site,
      id: 1,
      branch: 'master',
      createdAt: '2016-12-28T12:00:00',
      completedAt: '2016-12-28T12:05:00',
      state: 'success',
    };
    props = {
      builds: {
        data: [build],
        isLoading: false,
      },
    };
  });

  const columnIndex = (wrapper, name) => {
    let index;
    wrapper.find('th').children().forEach((child, childIndex) => {
      if (child.contains(name)) {
        index = childIndex;
      }
    });
    return index;
  };

  it("should render the username for a build's user", () => {
    const wrapper = shallow(<SiteBuilds {...props} />);
    const userIndex = columnIndex(wrapper, 'User');

    const userCell = wrapper.find('tr').at(1).find('td').at(userIndex);
    expect(userCell.text()).to.equal(user.username);
  });

  it('should render an empty string for the username for builds where there is no user', () => {
    build.user = undefined;
    const wrapper = shallow(<SiteBuilds {...props} />);
    const userIndex = columnIndex(wrapper, 'User');

    const userCell = wrapper.find('tr').at(1).find('td').at(userIndex);
    expect(userCell.text()).to.equal('');
  });

  it('should render a button to refresh builds', () => {
    const wrapper = shallow(<SiteBuilds {...props} />);
    expect(wrapper.find('RefreshBuildsButton')).to.have.length(1);
  });

  it('should render an empty state if no builds are present', () => {
    props = { builds: { isLoading: false, builds: [] } };
    const wrapper = shallow(<SiteBuilds {...props} />);

    expect(wrapper.find('table')).to.have.length(0);
    expect(wrapper.find('p')).to.have.length(1);
    expect(wrapper.find('p').contains('This site does not have any builds.')).to.be.true;
    expect(wrapper.find('RefreshBuildsButton')).to.have.length(1);
  });

  it('should render a paragraph about truncation if 100 or more builds are present', () => {
    props.builds.data = Array(100).fill(1).map((val, index) =>
      Object.assign(build, { id: index })
    );

    const wrapper = shallow(<SiteBuilds {...props} />);
    expect(wrapper.find('p')).to.have.length(1);
    expect(wrapper.find('p').contains('List only displays 100 most recent builds.')).to.be.true;
  });

  it('should render a loading state if the builds are loading', () => {
    props = { builds: { isLoading: true } };

    const wrapper = shallow(<SiteBuilds {...props} />);

    expect(wrapper.find('table')).to.have.length(0);
    expect(wrapper.find(LoadingIndicator)).to.have.length(1);
  });
});
