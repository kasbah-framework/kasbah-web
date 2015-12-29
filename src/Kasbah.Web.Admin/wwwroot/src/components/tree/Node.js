import React from 'react';
import NodeList from './NodeList';

export default class Node extends React.Component {
    static propTypes = {
      onToggle: React.PropTypes.func.isRequired,
      onSelect: React.PropTypes.func.isRequired,
      onCreate: React.PropTypes.func,
      node: React.PropTypes.object.isRequired,
      nodeTree: React.PropTypes.object.isRequired
    }

    render () {
      const expanded = this.props.node.expanded;
      const iconClass = 'fa fa-' + (expanded ? 'minus-square-o' : 'plus-square-o');

      const toggleButton = (this.props.node.hasChildren || this.props.onCreate) ? (<button className='toggle' onClick={this.props.onToggle.bind(this, this.props.node)}><i className={iconClass}></i></button>) : null;

      return (
            <li>
                <div>
                    <button onClick={this.props.onSelect.bind(this, this.props.node)}>
                        <i className='fa fa-files-o' />
                        {this.props.node.alias}
                    </button>
                    {toggleButton}
                </div>

                {expanded ? <NodeList
                    parent={this.props.node.id}
                    nodeTree={this.props.nodeTree}
                    onNodeSelected={this.props.onSelect}
                    onToggleNode={this.props.onToggle}
                    onCreateNode={this.props.onCreate} /> : null}
            </li>
        );
    }
}
