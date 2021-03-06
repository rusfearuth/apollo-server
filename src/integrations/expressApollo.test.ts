import * as express from 'express';
import * as bodyParser from 'body-parser';
import { apolloExpress, graphiqlExpress } from './expressApollo';
import testSuite, { Schema, CreateAppOptions } from './integrations.test';
import { expect } from 'chai';
import ApolloOptions from './apolloOptions';

function createApp(options: CreateAppOptions = {}) {
  const app = express();

  options.apolloOptions = options.apolloOptions || { schema: Schema };
  if (!options.excludeParser) {
    app.use('/graphql', bodyParser.json());
  }
  if (options.graphiqlOptions ) {
    app.use('/graphiql', graphiqlExpress( options.graphiqlOptions ));
  }
  app.use('/graphql', apolloExpress( options.apolloOptions ));
  return app;
}

describe('expressApollo', () => {
  it('throws error if called without schema', function(){
     expect(() => apolloExpress(undefined as ApolloOptions)).to.throw('Apollo Server requires options.');
  });

  it('throws an error if called with more than one argument', function(){
     expect(() => (<any>apolloExpress)({}, 'x')).to.throw(
       'Apollo Server expects exactly one argument, got 2');
  });
});

describe('integration:Express', () => {
  testSuite(createApp);
});
