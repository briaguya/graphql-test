import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import _ from 'lodash';
import numbers from 'numbers';
import writtenNumber from 'written-number';

var schema = buildSchema(`
  type Query {
    numberRange(start: Int, end: Int!): [Int]
    evenNumbers(start: Int, end: Int!): [Int]
    primeNumbers(start: Int, end: Int!): [Int]
    numberRangeAsWords(start: Int, end: Int!, language: String): [String]
    somethingFun: String
  }
`);

var root = {
  numberRange: ({ start = 0, end }) => _.range(start, end),
  evenNumbers: ({ start = 0, end }) => _.range(start, end, 2),
  primeNumbers: ({ start = 0, end }) => _.filter(_.range(start, end), (n) => numbers.prime.simple(n)),
  numberRangeAsWords: ({ start = 0, end, language = 'en' }) => _.map(_.range(start, end), (n) => writtenNumber(n, { lang: language })),
  somethingFun: () => 'Have a blast!' // TODO: Implement this
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
