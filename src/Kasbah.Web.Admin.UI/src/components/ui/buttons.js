import React from 'react';

export class Button extends React.Component {
    static propTypes = {
      onClick: React.PropTypes.func.isRequired,
      label: React.PropTypes.string.isRequired,
      disabled: React.PropTypes.bool,
      buttonState: React.PropTypes.string,
      buttonSize: React.PropTypes.string
    };

    render () {
      const btnClasses = ['btn'];
      if (this.props.buttonState) {
        btnClasses.push(`btn-${this.props.buttonState}`);
      }
      if (this.props.buttonSize) {
        btnClasses.push(`btn-${this.props.buttonSize}`);
      }

      return (<button className={btnClasses.join(' ')} onClick={this.props.onClick} disabled={this.props.disabled}>{this.props.label}</button>);
    }
}

export class DropDownButtonItem extends React.Component {
    static propTypes = {
      onClick: React.PropTypes.func.isRequired,
      disabled: React.PropTypes.bool,
      children: React.PropTypes.node
    };

    render () {
      return (<button className='dropdown-item' onClick={this.props.onClick}>{this.props.children}</button>);
    }
}

export class DropDownButtonSeparator extends React.Component {
    render () {
      return (<div className='dropdown-divider' />);
    }
}

export class DropDownButton extends React.Component {
    static propTypes = {
      label: React.PropTypes.string.isRequired,
      buttonState: React.PropTypes.string,
      children: React.PropTypes.node
    };

    constructor () {
      super();

      this.state = { isOpen: false };
    }

    handleClick () {
      this.setState({ isOpen: !this.state.isOpen });
    }

    render () {
      const classes = ['btn-group'];
      if (this.state.isOpen) {
        classes.push('open');
      }

      const btnClasses = ['btn', 'btn-sm', 'dropdown-toggle'];
      if (this.props.buttonState) {
        btnClasses.push(`btn-${this.props.buttonState}`);
      }

      return (<div className={classes.join(' ')}>
            {this.state.isOpen ? <div onClick={this.handleClick.bind(this)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' }}></div> : null}
            <button type='button' className={btnClasses.join(' ')} onClick={this.handleClick.bind(this)}>
                {this.props.label}
            </button>
            <div className='dropdown-menu'>
                {this.props.children}
            </div>
        </div>);
    }
}
