import PropTypes from 'prop-types';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Alert, Row, Col } from 'react-bootstrap';

import StreamRulesEditor from 'components/streamrules/StreamRulesEditor';
import { DocumentTitle, PageHeader, Spinner } from 'components/common';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const StreamsStore = StoreProvider.getStore('Streams');

const StreamEditPage = React.createClass({
  propTypes: {
    currentUser: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  },

  componentDidMount() {
    StreamsStore.get(this.props.params.streamId, (stream) => {
      this.setState({ stream });
    });
  },

  _isLoading() {
    return !this.props.currentUser || !this.state.stream;
  },

  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    let content = (<StreamRulesEditor currentUser={this.props.currentUser} streamId={this.props.params.streamId}
                                 messageId={this.props.location.query.message_id} index={this.props.location.query.index} />);
    if (this.state.stream.is_default) {
      content = (
        <div className="row content">
          <div className="col-md-12">
            <Alert bsStyle="danger">
              The default stream cannot be edited.
            </Alert>
          </div>
        </div>
      );
    }
    return (
      <DocumentTitle title={`Rules of Stream ${this.state.stream.title}`}>
        <div>
          <PageHeader title={<span>Rules of Stream &raquo;{this.state.stream.title}&raquo;</span>}>
            <span>
              This screen is dedicated to an easy and comfortable creation and manipulation of stream rules. You can{' '}
              see the effect configured stream rules have on message matching here.
            </span>
          </PageHeader>

          {content}
        </div>
      </DocumentTitle>
    );
  },
});

export default inject(() => ({
  currentUser: CurrentUserStore.currentUser,
}))(observer(StreamEditPage));
