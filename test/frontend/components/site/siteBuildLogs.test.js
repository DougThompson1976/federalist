import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SiteBuildLogs from '../../../../frontend/components/site/siteBuildLogs';
import LoadingIndicator from '../../../../frontend/components/loadingIndicator';


describe('<SiteBuildLogs/>', () => {
  it('should render a download link and <SiteBuildLogTable>', () => {
    const props = {
      params: {
        buildId: 123,
      },
      buildLogs: {
        isLoading: false,
        data: [
          { build: { id: 1 }, output: 'output 1', source: 'source 1' },
          { build: { id: 1 }, output: 'output 2', source: 'source 2' },
        ],
      },
    };

    const wrapper = shallow(<SiteBuildLogs {...props} />);
    expect(wrapper.find('SiteBuildLogTable')).to.have.length(1);
    const downloadLink = wrapper.find('a[download]');
    expect(downloadLink).to.have.length(1);
    expect(downloadLink.prop('href')).to.equal('/v0/build/123/log?format=text');
    expect(downloadLink.prop('download')).to.equal('build-log-123.txt');
  });

  it('should render a button to refresh logs', () => {
    const props = {
      params: {
        buildId: 123,
      },
      buildLogs: {
        isLoading: false,
        data: [],
      },
    };

    const wrapper = shallow(<SiteBuildLogs {...props} />);
    expect(wrapper.find('RefreshBuildLogsButton')).to.have.length(1);
  });

  it('should render a loading state if builds are loading', () => {
    const props = {
      params: {
        buildId: 123,
      },
      buildLogs: {
        isLoading: true,
      },
    };

    const wrapper = shallow(<SiteBuildLogs {...props} />);
    expect(wrapper.find('SiteBuildLogTable')).to.have.length(0);
    expect(wrapper.find(LoadingIndicator)).to.have.length(1);
  });

  it('should render an empty state if there are no builds', () => {
    const props = {
      params: {
        buildId: 123,
      },
      buildLogs: {
        data: [],
        isLoading: false,
      },
    };

    const wrapper = shallow(<SiteBuildLogs {...props} />);
    expect(wrapper.find('SiteBuildLogTable')).to.have.length(0);
    expect(wrapper.find('p')).to.have.length(1);
    expect(wrapper.find('p').contains('This build does not have any build logs.')).to.be.true;
    expect(wrapper.find('RefreshBuildLogsButton')).to.have.length(1);
  });
});
