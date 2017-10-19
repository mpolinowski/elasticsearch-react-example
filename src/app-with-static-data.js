import React, { Component } from "react";
import { render } from "react-dom";
import elasticsearch from "elasticsearch";

const connectionString = 'localhost:9200';
const _index = 'wiki2_de_2017_09_09';
const _type = 'article';

let client = new elasticsearch.Client({
  host: connectionString,
  log: "trace"
});

class App extends Component {
  constructor(props) {
    super(props)
      this.state = { results: [
        {
            "_index": "myIndex_2017_09_09",
            "_type": "article",
            "_id": "AV5mDXcSJw6qOfpXAp0a",
            "_score": 5.5604653,
            "_source": {
              "title2": "title 01",
            }
          },
          {
              "_index": "wiki2_de_2017_09_09",
              "_type": "article",
              "_id": "AV5mDXcSJw6qOfpXApsa",
              "_score": 2.1404631,
              "_source": {
                "title2": "title 02",
              }
            }
      ]}
    }

    handleChange(event) {
      const search_query = event.target.value;

      client.search({
  			index: _index,
  			type: _type,
  			q: search_query,
  			body: {
  				query: {
  						multi_match: {
  								query: search_query,
  								fields: ['title^100', 'tags^100', 'abstract^20', 'description^10', 'chapter^5', 'title2^10', 'description2^10'],
  								fuzziness: 1,
  							},
  					},
  			},
  		}).then(
          function(body) {
            this.setState({ results: body.hits.hits });
          }.bind(this),
          function(error) {
            console.trace(error.message);
          }
        );
    }

    render() {
      return (
        <div className="container">
          <input type="text" onChange={this.handleChange} />
          <SearchResults results={this.state.results} />
        </div>
      );
    }
}

const SearchResults = ({results}) => (
  <div className="search_results">
    <hr />

    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Image</th>
          <th>Abstract</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result , i) =>
          <ResultRow key={i}
                     title={result._source.title2}
                     type={result._type}
                     score={result._score}
                     index={result._index} />
        )}
      </tbody>
    </table>
  </div>
)

const ResultRow = ({ title, index, type, score }) => (
  <tr>
    <td>
      {title}
    </td>
    <td>
      {index}
    </td>
    <td>
      {type}
    </td>
    <td>
      {score}
    </td>
  </tr>
)



render(<App />, document.getElementById("main"));
