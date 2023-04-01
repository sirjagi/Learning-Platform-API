// short for putting a function inside another function
const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.Query
  const reqQuery = { ...req.query };

  // Fields to exclude (filtering)
  // if one of the query parameters is "select" (we decide what)
  // we don't want to match a field with these in a document (table)
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // console.log(reqQuery);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  // /g = global (not just the first one it finds)
  // gt = greater than, gte = greater than or equal...
  // "$" comes before Mongoose operations (lte, lt, etc... are Mongoose operations)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // console.log(queryStr);

  // Finding resource
  // we store Bootcamp.find in query variable
  // ALSO...populate with a virtual field "courses"
  //   query = model.find(JSON.parse(queryStr)).populate("courses");

  query = model.find(JSON.parse(queryStr));

  // Select Fields (if select exists in url)
  if (req.query.select) {
    // split wherever there's a comma and rejoin with space in b/w
    const fields = req.query.select.split(",").join(" ");
    // console.log(fields);

    // Now, select the fields that user wants
    query = query.select(fields);
  }

  // Sort (if field present)
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }
  // default sort by date
  else {
    // createdAt is a field in our Model
    query = query.sort("-createdAt");
  }

  // Pagination
  // 10 is the base of the number
  const page = parseInt(req.query.page, 10) || 1;
  // query results per page
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  // Mongoose method
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    // populate with a virtual field populate (probably a string -- a field)
    query = query.populate(populate);
  }

  // Executing query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // res info will be updated within the controller using this middleware
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
