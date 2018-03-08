import React from 'react';
import { ListView, StyleSheet, View, Text } from 'react-native';
import { Body, Title, Right, Container, Header, Content, Button, Icon, List, ListItem} from 'native-base';


const styles = {
  heading: {
    height: 80,
    marginBottom: 10,
    backgroundColor: '#000',
  }
}


export default class App extends React.Component {

  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      chart: []
    }
  }

  // Retrieve the list of chart from Airtable
    getChart() {
      // Airtable API endpoint, replace with your own
      let airtableUrl = "https://api.airtable.com/v0/apptNUHuZIre9Svn8/chart?&view=Grid%20view";

      // Needed for Airtable authorization, replace with your own API key
      let requestOptions = {
        headers: new Headers({
          'Authorization': 'Bearer keyILJwvK7To6PtTT'
        })
      };

      // Form the request
      let request = new Request(airtableUrl, requestOptions);

      // Make the request
      fetch(request).then(response => response.json()).then(json => {
        this.setState({
          chart: json.records
        });
      });
    }

    // Runs when the application loads (i.e. the "App" component "mounts")
    componentDidMount() {
      this.getChart(); // refresh the list when we're done
    }
    // Upvote an idea
      upvoteChart(data, secId, rowId, rowMap) {
        // Slide the row back into place
        rowMap[`${secId}${rowId}`].props.closeRow();

        // Airtable API endpoint
        let airtableUrl = "https://api.airtable.com/v0/apptNUHuZIre9Svn8/chart/" + data.id;

        // Needed for Airtable authorization
        let requestOptions = {
          method: 'PATCH',
          headers: new Headers({
            'Authorization': 'Bearer keyILJwvK7To6PtTT', // replace with your own API key
            'Content-type': 'application/json'
          }),
          body: JSON.stringify({
            fields: {
              votes: data.fields.votes + 1
            }
          })
        };

        // Form the request
        let request = new Request(airtableUrl, requestOptions);

        // Make the request
        fetch(request).then(response => response.json()).then(json => {
          this.getChart(); // refresh the list when we're done
        });
      }

      // Downvote an idea
      downvoteChart(data, secId, rowId, rowMap) {
        // Slide the row back into place
        rowMap[`${secId}${rowId}`].props.closeRow();

        // Airtable API endpoint
        let airtableUrl = "https://api.airtable.com/v0/apptNUHuZIre9Svn8/chart/" + data.id;

        // Needed for Airtable authorization
        let requestOptions = {
          method: 'PATCH',
          headers: new Headers({
            'Authorization': 'Bearer keyILJwvK7To6PtTT', // replace with your own API key
            'Content-type': 'application/json'
          }),
          body: JSON.stringify({
            fields: {
              votes: data.fields.votes - 1
            }
          })
        };

        // Form the request
        let request = new Request(airtableUrl, requestOptions);

        // Make the request
        fetch(request).then(response => response.json()).then(json => {
          this.getChart(); // refresh the list when we're done
        });
      }

      // Ignore an idea
      ignoreChart(data, secId, rowId, rowMap) {
        // Slide the row back into place
        rowMap[`${secId}${rowId}`].props.closeRow();

        // Create a new array that has the idea removed
        let newChartData = this.state.chart.slice();
        newChartData.splice(rowId, 1);

        // Set state
        this.setState({
          chart: newChartData
        });
      }

      // Delete an idea
      deleteChart(data, secId, rowId, rowMap) {
        // Slide the row back into place
        rowMap[`${secId}${rowId}`].props.closeRow();

        // Create a new array that has the idea removed
        let newChartData = this.state.chart.slice();
        newChartData.splice(rowId, 1);

        // Airtable API endpoint
        let airtableUrl = "https://api.airtable.com/v0/apptNUHuZIre9Svn8/chart/" + data.id;

        // Needed for Airtable authorization
        let requestOptions = {
          method: 'DELETE',
          headers: new Headers({
            'Authorization': 'Bearer keyILJwvK7To6PtTT', // replace with your own API key
            'Content-type': 'application/json'
          })
        };

        // Form the request
        let request = new Request(airtableUrl, requestOptions);

        // Make the request
        fetch(request).then(response => response.json()).then(json => {
          this.getChart(); // refresh the list when we're done
        });
      }

      // The UI for each row of data
      renderRow(data) {
        return (
          <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Body>
              <Text style={{ fontSize: 18}}>{data.fields.song}</Text>
            </Body>
            <Body>
              <Text>{data.fields.artist}</Text>
            </Body>
            <Right>
              <Text note>{data.fields.votes} Votes</Text>
            </Right>
          </ListItem>
        )
      }

      // The UI for what appears when you swipe right
      renderSwipeRight(data, secId, rowId, rowMap) {
        return (
          <Button full success onPress={() => this.upvoteChart(data, secId, rowId, rowMap)}>
            <Icon active name="thumbs-up" />
          </Button>
        )
      }

      // The UI for what appears when you swipe left
      renderSwipeLeft(data, secId, rowId, rowMap) {
        return (
          <Button full danger onPress={() => this.downvoteChart(data, secId, rowId, rowMap)}>
            <Icon active name="thumbs-down" />
          </Button>
        )
      }

      render() {
        let rows = this.ds.cloneWithRows(this.state.chart);
        return (
          <Container>
            <Header style ={styles.heading}>
              <Body>
                <Title >Billboard HOT 25</Title>
              </Body>
            </Header>
            <Content>
              <List
                dataSource={rows}
                renderRow={(data) => this.renderRow(data)}
                renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeRight(data, secId, rowId, rowMap)}
                renderRightHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeLeft(data, secId, rowId, rowMap)}
                leftOpenValue={75}
                rightOpenValue={-75}
              />
            </Content>
          </Container>
        );
      }
    }
