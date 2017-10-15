import { Component, React, PropTypes } from 'react'
import { render } from 'react-dom'
import elasticsearch from 'elasticsearch'

const connectionString = 'localhost:9200';
const _index = 'wiki2_de_2017_09_09';
const _type = 'article';

// ################################################################# App

class App extends Component {

	constructor() {
		super();
		this.state = {
			results: []
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange ( event ) {
		const search_query = event.target.value

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
		}).then(function ( body ) {
			this.setState({ results: body.hits.hits })
		}.bind(this), function ( error ) {
			console.trace( error.message );
		});
	}

	render () {
		return (
			<div className="container">
				<input type="text" onChange={ this.handleChange } />
				<SearchResults results={ this.state.results } />
			</div>
		)
	}
}

// ################################################################# SearchResults

class SearchResults extends Component {

	render () {
		return (
			<div className="search_results">
					<hr />
					<ul>
					{ props.results.map((result) => {
						return
							<li key={ result._id }>
									<h3>{result._source.title}</h3><br/>
									<a href={`${result._source.link}`}><img src={result._source.image} alt={result._source.abstract} /><br/></a>
									<p>{result._source.abstract}</p>
							</li> }) }
					</ul>
				</div>
		)
	}
}

SearchResults.propTypes = {
	results: React.PropTypes.array
};

SearchResults.defaultProps = {
	results: []
};

render( <App />, document.getElementById( 'main' ) )
