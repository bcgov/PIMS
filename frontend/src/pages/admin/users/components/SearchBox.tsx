import * as React from 'react';
import Form from 'react-bootstrap/Form';

export class SearchBox extends React.Component<
  {
    searchText: any;
    handleSearch: any;
    hideSearch: any;
    options: any;
  },
  {},
  {}
> {
  onSearch = (event: any) => {
    this.props.handleSearch(event.target.value);
  };

  render(): JSX.Element {
    return <Form.Control type="text" placeholder={'Search'} onChange={this.onSearch} />;
  }
}
