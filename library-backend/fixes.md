<!-- fixes.md -->

The main reason your resolver is failing is a logic error in your conditional if statements. If a user provides both an author and a genre, or if the author query fails to find a match, your code breaks.Here is a breakdown of the specific issues and how to fix them.Why It FailsThe Author Crash: If a user searches for an author that does not exist in your database, author will be null. When your code hits author._id, Node.js will throw a fatal error: Cannot read properties of null (reading '_id').The Broken Condition: Your code fetches the author at the very top before checking if args.author even exists. If a user only searches for a genre, args.author is undefined, Author.findOne({name: undefined}) executes, and the resolver fails.Exclusive Fields: Using separate if blocks prevents users from filtering by both author and genre at the same time.The SolutionBuild a dynamic query object. This handles any combination of arguments safely and efficiently.javascript

```js
allBooks: async (root, args) => {
  console.log("Arguments received:", args);
  const query = {};

  // 1. Handle Author Filter Safely
  if (args.author) {
    const author = await Author.findOne({ name: args.author });
    
    // If author doesn't exist, return empty array immediately
    if (!author) {
      console.log(`Author "${args.author}" not found.`);
      return []; 
    }
    
    query.author = author._id;
  }

  // 2. Handle Genre Filter Safely
  if (args.genre) {
    query.genres = args.genre;
  }

  // 3. Execute the single compiled query
  console.log("Executing MongoDB query:", query);
  return Book.find(query).populate('author');
}
```
Use code with caution.What Changed?Dynamic Query: It creates a blank query object and adds properties only if they exist in args.Null Guard: It explicitly checks if the author was found before accessing ._id.Multi-filter Support: A user can now search for books that match both a specific author and a specific genre simultaneously.To help me fine-tune this, could you share your GraphQL schema definition for allBooks, or let me know if you are getting a specific error message in your console?