import React, { Component } from 'react';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MapView from './pages/MapView';
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Header from './components/navigation/Header';
import Footer from './components/navigation/Footer';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

//import Debug from './components/Debug/Debug';

type DefaultProps = {
  activeUserId: string;
};

class App extends Component<{}, DefaultProps> {
  static defaultProps: DefaultProps = {
    activeUserId: 'all',
  };

  constructor(props: DefaultProps) {
    super(props);
    this.state = App.defaultProps;
  }

  setActiveUserId = (userId: string) => {
    this.setState({ activeUserId: userId });
  };

  componentDidMount() {}

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Header setActiveUserId={this.setActiveUserId}></Header>
          </header>
          <div className="App-content">
            <Route path="/" component={Login}></Route>
            <PrivateRoute
              path="/mapview"
              render={() => <MapView activeUserId={this.state.activeUserId} />}
              component={MapView}
              activeUserId={this.state.activeUserId}
            />
          </div>
          <Footer></Footer>
        </div>
      </Router>
    );
  }
}

export default App;
