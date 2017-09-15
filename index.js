import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import _ from 'lodash';

var schema = buildSchema(`
  type Query {
    numberRange(start: Int, end: Int!): [Int]
  }
`);

var root = {
  numberRange: ({ start = 0, end }) => _.range(start, end)

};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
