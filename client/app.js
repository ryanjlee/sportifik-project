var App = React.createClass({
  getInitialState: function() {
    return {
      profiles: [],
      currentIndex: 0
    };
  },

  loadData: function() {
    $.ajax({
      url: 'Data.json',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({profiles: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/Data.json', status, err.toString());
      }.bind(this)
    });
  },

  handleRequest: function(profile) {
    this.setState({currentIndex: profile.id - 1});
  },

  componentDidMount: function() {
    this.loadData();
  },

  render: function() {
    var profiles = this.state.profiles;
    if (profiles.length) {
      var profileContent = <Profile profile={profiles[this.state.currentIndex]} />;
    } else {
      profileContent = <div></div>;
    }

    return (
      <div className='app'>
        <Header profiles={this.state.profiles} onRequest={this.handleRequest} />
        {profileContent}
      </div>
    )
  }
});

var Header = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
  },

  calculateAge: function(birthday) {
      var ageDifMs = Date.now() - new Date(birthday).getTime();
      var ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
  },

  getSuggestions: function(input, callback) {
    var regex = new RegExp('^' + input, 'i');
    var suggestions = this.props.profiles.filter(function(profile) {
      return regex.test(profile.name);
    });

    setTimeout(function() {
      callback(null, suggestions)
    }, 300);
  },

  renderSuggestion: function (suggestion, input) {
    return (
      <div className='search-result'>
        <div className='main-info'>
          <img className='small-img' src={suggestion.image} />
          <p>{suggestion.name}</p>
        </div>
        <div className='side-info'>
          <p>{suggestion.location}</p>
          <p>{this.calculateAge(suggestion.birthday)} years old</p>
        </div>
      </div>
    )
  },

  getSuggestionValue: function (suggestionObj) {
    return suggestionObj.name;
  },

  onSuggestionSelected: function (suggestion, event) {
    event.preventDefault();
    this.props.onRequest(suggestion);
  },

  render: function() {

    var Navbar = ReactBootstrap.Navbar;
    var Nav = ReactBootstrap.Nav;
    var NavItem = ReactBootstrap.NavItem;
    var inputAttributes = {
      id: 'profile-search',
      placeholder: 'Search for a player'
    };

    return (
      <Navbar className='default' staticTop='true'>
        <Nav>
          <form className='navbar-form navbar-left' role='search' onSubmit={this.handleSubmit} >
            <img className='icon' src='assets/Sportifik-Logo.png' />
            <Autosuggest suggestions={this.getSuggestions}
              suggestionRenderer={this.renderSuggestion}
              suggestionValue={this.getSuggestionValue}
              onSuggestionSelected={this.onSuggestionSelected}
              inputAttributes={inputAttributes} />
          </form>
        </Nav>
      </Navbar>
    )
  }
});

var Profile = React.createClass({
  formatDate: function(date) {
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    var date = new Date(date);
    var month = monthNames[date.getMonth()];
    var day = date.getDate();
    var year = date.getFullYear();

    return month + ' ' + day + ', ' + year;
  },

  render: function() {
    var Grid = ReactBootstrap.Grid;
    var Row = ReactBootstrap.Row;
    var Col = ReactBootstrap.Col;
    var profile = this.props.profile;
    var birthday = this.formatDate(profile.birthday);
    
    return (
      <Grid className='profile'>
        <Row className='show-grid'>
          <Col xs={12} sm={12} md={3} className='profile-info'>
            <Row className="show-grid">
              <Col xs={6} md={12}>
                <img className='profile-img' src={profile.image} />
              </Col>
              <Col xs={6} md={12}>
                <h3>{profile.name}</h3>
                <p><img src='assets/IconLocation.png' /> {profile.location}</p>
                <p className='gender' ><img src='assets/IconGender.png' /> {profile.gender}</p>
                <p><img src='assets/IconBirthday.png' /> {birthday}</p>
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={9}>
            <h4>About Me</h4>
            <p>{profile.bio}</p>
          </Col>
        </Row>
      </Grid>
    )
  }
});

React.render(
  <App />,
  document.body
);
