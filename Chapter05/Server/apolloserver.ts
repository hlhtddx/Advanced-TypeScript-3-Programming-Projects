// Very important - reflect metadata needs to be at the top of the stack of imports
import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import * as path from "path";
import { buildSchema } from "type-graphql";
import { TodoItemResolver } from "./graph/TodoItemResolver";
import { Prefill } from "./graph/Prefill";
import { Mongo } from "./database/Database";

export class MyApp {

  constructor(private mongo: Mongo = new Mongo()) { }

  public async Start(): Promise<void> {
    this.mongo.Connect();

    const schema = await buildSchema({
      resolvers: [TodoItemResolver],
      emitSchemaFile: path.resolve(__dirname, 'apolloschema.gql')
    });

    // GraphQL uses lazy loading. In order to respond to our clients faster, we're going to pre-populate this
    // list.
    await Prefill.Instance.Populate();

    const server = new ApolloServer({ schema, playground: true });
    await server.listen(3000);
  }
}

new MyApp().Start();