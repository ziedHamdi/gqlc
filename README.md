The aim of this project is to demonstrate a bug in graphql-compose

Even though a field called <b>nameRegexp</b> is configured  as a filter arg in ./src/gqlc/entity

We can't find it in the schema exposed by the server : <a href="http://localhost:3000/graphql?query=%7B%0A%20%20__type(name%3A%20%22FilterFindManyEntityInput%22)%20%7B%0A%20%20%20%20name%0A%20%20%20%20inputFields%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20type%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20description%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D">click here</a> for graphqli

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