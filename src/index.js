import React from 'react';
import ReactDOM from 'react-dom';

function lazyLoaderHOC(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.visible = false;
      this.callback = this.callback.bind(this);
    }
    componentDidMount() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0
      };
      const observer = new IntersectionObserver(this.callback, options);
      // need to handle arrays here?
      observer.observe(this.el);
    }
    callback(entries, observer) {      
      entries.forEach((entry) => {
        var visiblePct = (Math.floor(entry.intersectionRatio * 100)) + "%";
        entry.target.innerHTML = visiblePct;
        if (entry.intersectionRatio === 1.0) {
          entry.target.style.backgroundColor = 'blue';
          observer.unobserve(this.el);
          this.visible = true;
          this.forceUpdate();
        } else {
          entry.target.style.backgroundColor = 'yellow';
        }
      })
    }
    render() {
      const style = {
        height: '200px',
        width: '200px',
        border: '1px solid black'
      };
      return (
          this.visible ?
          <WrappedComponent ref={el => this.wrapped = el} /> :
          <div ref={el => this.el = el} style={style} />
      );
    }
  }
}

class LazyLoad extends React.Component {
  constructor(props) {
    super(props);
    this.visible = false;
    this.callback = this.callback.bind(this);
  }
  componentDidMount() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    };
    const observer = new IntersectionObserver(this.callback, options);
    // need to handle arrays here?
    observer.observe(this.el);
  }
  callback(entries, observer) {
    entries.forEach((entry) => {
      var visiblePct = (Math.floor(entry.intersectionRatio * 100)) + "%";
      entry.target.innerHTML = visiblePct;
      if (entry.intersectionRatio === 1.0) {
        entry.target.style.backgroundColor = 'blue';
        this.visible = true;
        this.forceUpdate();
      } else {
        entry.target.style.backgroundColor = 'white';
      }
    })
  }
  render() {
    const style = {
      height: '300px',
      width: '200px',
      border: '1px solid black'
    };
    return (
        this.visible ?
        this.props.children :
        <div ref={el => this.el = el} style={style} />
    );
  }
}

class TestComponent extends React.Component {
  render() {
    return <div style={{height: '200px', width: '20px'}}>hello</div>;
  }
}

const TestComponentWrapped = lazyLoaderHOC(TestComponent);

class App extends React.Component {
  render() {
    return (
      <div>
        <TestComponent />
        <LazyLoad>
          <TestComponent />
        </LazyLoad>
        <LazyLoad>
          <TestComponent />
        </LazyLoad>
        <TestComponentWrapped />
        <TestComponentWrapped />
        <TestComponentWrapped />
        <TestComponentWrapped />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app-root'));