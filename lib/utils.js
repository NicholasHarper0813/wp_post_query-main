'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _omitBy2 = require('lodash/omitBy');
var _omitBy3 = _interopRequireDefault(_omitBy2);

exports.getNormalizedPostsQuery = getNormalizedPostsQuery;
exports.getSerializedPostsQuery = getSerializedPostsQuery;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_POST_QUERY = {
  _embed: true,
  offset: 0,
  order: 'DESC',
  order_by: 'date',
  type: 'post',
  status: 'publish',
  search: ''
};

function getNormalizedPostsQuery(query) {
  return (0, _omitBy3.default)(query, function (value, key) {
    return DEFAULT_POST_QUERY[key] === value;
  });
}

function getSerializedPostsQuery() {
  var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var normalizedQuery = getNormalizedPostsQuery(query);
  return JSON.stringify(normalizedQuery).toLocaleLowerCase();
}
