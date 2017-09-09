import React from 'react'
import { render } from 'react-dom'
import elasticsearch from 'elasticsearch'

var connectionString = 'localhost:9200';
var _index = 'wiki2_de_2017_09_09';
var _type = 'article';

let client = new elasticsearch.Client({
	host: 'connectionString',
	log: 'trace'
})

const App = React.createClass({
	getInitialState () {
		return {
			results: []
		}
	},
	handleChange ( event ) {
		const search_query = event.target.value

		client.search({
                index: _index,
                type: _type,
                body: {
                  query: {
                      multi_match: {
                          query: req.query.q,
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
	},
	render () {
		return (
			<div className="container">
				<input type="text" onChange={ this.handleChange } />
				<SearchResults results={ this.state.results } />
			</div>
		)
	}
})

const SearchResults = React.createClass({
	propTypes: {
		results: React.PropTypes.array
	},
	getDefaultProps () {
		return { results: [] }
	},
	render () {
		return (
			<div className="search_results">
				<hr />
				<ul>
				{ this.props.results.map((result) => {
					return <li key={ result._id }>{ result._source.name }</li> }) }
				</ul>
			</div>
		)
	}
})


render( <App />, document.getElementById( 'main' ) )
