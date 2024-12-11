'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPost = getPost;
exports.isRequestingPostsForQuery = isRequestingPostsForQuery;
exports.getTotalPagesForQuery = getTotalPagesForQuery;
exports.getPostIdFromSlug = getPostIdFromSlug;
exports.isRequestingPost = isRequestingPost;
exports.getPostsForQuery = getPostsForQuery;

var _utils = require('./utils');

function getPost(state, globalId) {
  return state.posts.items[globalId];
}

function getPostsForQuery(state, query) {
  var serializedQuery = (0, _utils.getSerializedPostsQuery)(query);
  if (!state.posts.queries[serializedQuery]) {
    return null;
  }

  return state.posts.queries[serializedQuery].map(function (globalId) {
    return getPost(state, globalId);
  }).filter(Boolean);
}

function isRequestingPostsForQuery(state, query) {
  var serializedQuery = (0, _utils.getSerializedPostsQuery)(query);
  return !!state.posts.queryRequests[serializedQuery];
}

function getTotalPagesForQuery(state, query) {
  var serializedQuery = (0, _utils.getSerializedPostsQuery)(query);
  if (!state.posts.totalPages[serializedQuery]) {
    return 1;
  }
  return parseInt(state.posts.totalPages[serializedQuery], 10);
}

function isRequestingPost(state, postSlug) {
  if (!state.posts.requests) {
    return false;
  }
  return !!state.posts.requests[postSlug];
}

function getPostIdFromSlug(state, slug) {
  if (!state.posts.slugs[slug]) {
    return false;
  }
  return state.posts.slugs[slug];
}
