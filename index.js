import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import _ from 'lodash';
import numbers from 'numbers';
import writtenNumber from 'written-number';

var schema = buildSchema(`
  type Number {
    number: Int
    word: String
  }

  type Query {
    numberRange(start: Int, end: Int!): [Number]
    evenNumbers(start: Int, end: Int!): [Number]
    primeNumbers(start: Int, end: Int!): [Number]
    somethingFun: String
  }
`);

function toNumberObject(n) {
  return {
    number: n,
    word: writtenNumber(n)
  };
}

var root = {
  numberRange: ({ start = 0, end }) => _.map(_.range(start, end), (n) => toNumberObject(n)),
  evenNumbers: ({ start = 0, end }) => _.map(_.range(start, end, 2), (n) => toNumberObject(n)),
  primeNumbers: ({ start = 0, end }) => _.map(_.filter(_.range(start, end), (n) => numbers.prime.simple(n)), (n) => toNumberObject(n)),
  somethingFun: () => 'Changed all queries to have the number and the word'
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
