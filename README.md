The aim of this project is to demonstrate a bug in graphql-compose

Even though a field called <b>nameRegexp</b> is configured  as a filter arg in ./src/gqlc/entity

We can't find it in the schema exposed by the server

<pre>
{
  __type(name: "FilterFindManyEntityInput") {
    name
    inputFields {
      name
      type {
        name
        description
      }
    }
  }
}
</pre>

If we comment the line ./src/gqlc/index.js:4 (we just stop including EntityGroup) 
things work fine again

start the server running the command <i>yarn run dev</i>