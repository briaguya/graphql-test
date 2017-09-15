import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import _ from 'lodash';
import numbers from 'numbers';
import writtenNumber from 'written-number';

var schema = buildSchema(`
  enum Language {
    ENGLISH
    SPANISH
  }
  
  type Number {
    number: Int
    word(language: Language = ENGLISH): String
  }

  type Query {
    numberRange(start: Int, end: Int!): [Number]
    evenNumbers(start: Int, end: Int!): [Number]
    primeNumbers(start: Int, end: Int!): [Number]
    somethingFun: String
  }
`);

const langStrings = {
  'ENGLISH': 'en',
  'SPANISH': 'es'
};

class Number {
  constructor(number) {
    this.number = number;
  };

  word({ language }) {
    return writtenNumber(this.number, {lang: langStrings[language]});
  }
}

var root = {
  numberRange: ({ start = 0, end }) => _.map(_.range(start, end), (n) => new Number(n)),
  evenNumbers: ({ start = 0, end }) => _.map(_.range(start, end, 2), (n) => new Number(n)),
  primeNumbers: ({ start = 0, end }) => _.map(_.filter(_.range(start, end), (n) => numbers.prime.simple(n)), (n) => new Number(n)),
  somethingFun: () => 'Changed all queries to have the number and the word'
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
