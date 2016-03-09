import React from 'react';
// import { Link } from 'react-router';

export default class extends React.Component {
  static propTypes = {
    isLoading: React.PropTypes.bool.isRequired,
    errorMessage: React.PropTypes.string,
    selectedNode: React.PropTypes.object.isRequired,
    selectedNodeHierarchy: React.PropTypes.array.isRequired
  };

  get errorMessage () {
    if (!this.props.errorMessage) return null;

    return <div className='notification is-danger'>{this.props.errorMessage}</div>;
  }

  get loading () {
    if (!this.props.isLoading) return null;

    return <div className='notification is-info'><i className='fa fa-loading' /> Loading...</div>;
  }

  get breadcrumbs () {
    return null;

    // return (
    //   <ul className='breadcrumb'>
    //     <li><i className='fa fa-home' /></li>
    //     {this.props.selectedNodeHierarchy.reverse().map(ent =>
    //       <li key={ent.id}>
    //         <Link to={{ pathname: '/content', query: { node: ent.id } }}>
    //           <span>{ent.alias}</span>
    //         </Link>
    //       </li>
    //     )}
    //     <li>{this.props.selectedNode.alias}</li>
    //   </ul>);
  }

  render () {
    return (
      <div className='container'>
        {this.loading}
        {this.errorMessage}
        {this.breadcrumbs}
      </div>);
  }
};
