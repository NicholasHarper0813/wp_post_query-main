'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.POSTS_REQUEST_FAILURE = exports.POSTS_REQUEST_SUCCESS = exports.POSTS_REQUEST = exports.POSTS_RECEIVE = exports.POST_REQUEST_FAILURE = exports.POST_REQUEST_SUCCESS = exports.POST_REQUEST = undefined;

var _reduce2 = require('lodash/reduce');
var _reduce3 = _interopRequireDefault(_reduce2);
var _keyBy2 = require('lodash/keyBy');
var _keyBy3 = _interopRequireDefault(_keyBy2);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.queryRequests = queryRequests;
exports.requestPosts = requestPosts;
exports.requestPost = requestPost;
exports.totalPages = totalPages;
exports.requests = requests;
exports.queries = queries;
exports.slugs = slugs;
exports.items = items;

var _qs2 = _interopRequireDefault(_qs);
var _utils = require('./utils');
var _redux = require('redux');
var _qs = require('qs');
var _wordpressRestApiOauth = require('wordpress-rest-api-oauth-1');
var _wordpressRestApiOauth2 = _interopRequireDefault(_wordpressRestApiOauth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /*global SiteSettings */

var api = new _wordpressRestApiOauth2.default({
	url: SiteSettings.endpoint
});

var POSTS_REQUEST_SUCCESS = exports.POSTS_REQUEST_SUCCESS = 'wordpress-redux/posts/REQUEST_SUCCESS';
var POSTS_REQUEST_FAILURE = exports.POSTS_REQUEST_FAILURE = 'wordpress-redux/posts/REQUEST_FAILURE';
var POST_REQUEST_SUCCESS = exports.POST_REQUEST_SUCCESS = 'wordpress-redux/post/REQUEST_SUCCESS';
var POST_REQUEST_FAILURE = exports.POST_REQUEST_FAILURE = 'wordpress-redux/post/REQUEST_FAILURE';
var POSTS_RECEIVE = exports.POSTS_RECEIVE = 'wordpress-redux/posts/RECEIVE';
var POSTS_REQUEST = exports.POSTS_REQUEST = 'wordpress-redux/posts/REQUEST';
var POST_REQUEST = exports.POST_REQUEST = 'wordpress-redux/post/REQUEST';

function items() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) 
	{
		case POSTS_RECEIVE:
			var posts = (0, _keyBy3.default)(action.posts, 'id');
			return Object.assign({}, state, posts);
		default:
			return state;
	}
}

function requests()
{
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) 
	{
		case POST_REQUEST:
		case POST_REQUEST_SUCCESS:
		case POST_REQUEST_FAILURE:
			return Object.assign({}, state, _defineProperty({}, action.postSlug, POST_REQUEST === action.type));
		default:
			return state;
	}
}

function queryRequests() 
{
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) 
	{
		case POSTS_REQUEST:
		case POSTS_REQUEST_SUCCESS:
		case POSTS_REQUEST_FAILURE:
			var serializedQuery = (0, _utils.getSerializedPostsQuery)(action.query);
			return Object.assign({}, state, _defineProperty({}, serializedQuery, POSTS_REQUEST === action.type));
		default:
			return state;
	}
}

function totalPages() 
{
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type)
	{
		case POSTS_REQUEST_SUCCESS:
			var serializedQuery = (0, _utils.getSerializedPostsQuery)(action.query);
			return Object.assign({}, state, _defineProperty({}, serializedQuery, action.totalPages));
		default:
			return state;
	}
}

function queries()
{
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) 
	{
		case POSTS_REQUEST_SUCCESS:
			var serializedQuery = (0, _utils.getSerializedPostsQuery)(action.query);
			return Object.assign({}, state, _defineProperty({}, serializedQuery, action.posts.map(function (post) {
				return post.id;
			})));
		default:
			return state;
	}
}

function slugs() 
{
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) 
	{
		case POST_REQUEST_SUCCESS:
			return Object.assign({}, state, _defineProperty({}, action.postSlug, action.postId));
		case POSTS_RECEIVE:
			var posts = (0, _reduce3.default)(action.posts, function (memo, p) {
				memo[p.slug] = p.id;
				return memo;
			}, {});
			return Object.assign({}, state, posts);
		default:
			return state;
	}
}

exports.default = (0, _redux.combineReducers)({
	items: items,
	requests: requests,
	totalPages: totalPages,
	queryRequests: queryRequests,
	queries: queries,
	slugs: slugs
});

function getURLForType(postType) 
{
	var url = '';
	switch (postType) {
		case 'post':
			url = '/wp/v2/posts';
			break;
		case 'page':
			url = '/wp/v2/pages';
			break;
		default:
			url = '/wp/v2/' + postType;
	}
	return url;
}

function requestPosts() 
{
	var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	return function (dispatch) 
	{
		var defaults = {
			post_type: 'post'
		};
		query = _extends({}, defaults, query);
		dispatch({
			type: POSTS_REQUEST,
			query: query
		});

		query._embed = true;
		var url = getURLForType(query.post_type);
		
		api.get(url, query).then(function (posts) {
			dispatch({
				type: POSTS_RECEIVE,
				posts: posts
			});
			requestPageCount(url, query).then(function (count) {
				dispatch({
					type: POSTS_REQUEST_SUCCESS,
					query: query,
					totalPages: count,
					posts: posts
				});
			});
			return null;
		}).catch(function (error) {
			dispatch({
				type: POSTS_REQUEST_FAILURE,
				query: query,
				error: error
			});
		});
	};
}

function requestPost(postSlug) {
	var postType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'post';

	return function (dispatch) 
	{
		dispatch({
			type: POST_REQUEST,
			postSlug: postSlug
		});

		var query = {
			slug: postSlug,
			_embed: true
		};

		var url = getURLForType(postType);

		api.get(url, query).then(function (data) {
			var post = data[0];
			dispatch({
				type: POSTS_RECEIVE,
				posts: [post]
			});
			dispatch({
				type: POST_REQUEST_SUCCESS,
				postId: post.id,
				postSlug: postSlug
			});
			return null;
		}).catch(function (error) {
			dispatch({
				type: POST_REQUEST_FAILURE,
				postSlug: postSlug,
				error: error
			});
		});
	};
}

function requestPageCount(url) {
	var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	if (url.indexOf('http') !== 0) 
	{
		url = api.config.url + 'wp-json' + url;
	}

	if (data) 
	{
		url += '?' + decodeURIComponent(_qs2.default.stringify(data));
		data = null;
	}

	var headers = {
		Accept: 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	};

	return fetch(url, {
		method: 'HEAD',
		headers: headers,
		mode: 'cors',
		body: null
	}).then(function (response) {
		return parseInt(response.headers.get('X-WP-TotalPages'), 10) || 1;
	});
}
