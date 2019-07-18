The aim of this project is to demonstrate a bug in graphql-compose

Even though a field called 

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