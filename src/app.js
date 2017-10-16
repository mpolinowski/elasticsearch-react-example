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
    super(props);

    this.state = { results: [] };
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

class SearchResults extends Component {
  render() {
    const results = this.props.results || [];

    return (
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
            {results.map((result, i) =>
                <ResultRows key={i} {...result} />
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

const ResultRows = ({result}) => (

  <tr>
    <td>
      {result._source.title}
    </td>
    <td>
      {result._source.title}
    </td>
    <td>
      {result._source.link}
    </td>
    <td>
      {result._source.abstract}
    </td>
  </tr>
)

// class SearchResults extends Component {
//   render() {
//     const results = this.props.results || [];
//
//     return (
//       <div className="search_results">
// 					<hr />
// 					<ul>
// 					 {results.map(result => {
// 						return (
// 							<li key={result._id}>
// 									<h3>{result._source.title}</h3><br/>
// 									<a href={`${result._source.link}`}><img src={result._source.image} alt={result._source.abstract} /><br/></a>
// 									<p>{result._source.abstract}</p>
// 							</li>
//             );
//             }) }
// 					</ul>
// 				</div>
//     );
//   }
// }


render(<App />, document.getElementById("main"));
