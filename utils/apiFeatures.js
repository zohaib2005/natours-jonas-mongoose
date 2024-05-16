class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

     // return this means return entire object
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    // return this means return entire object
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

     // return this means return entire object
    return this;
  }

  // 4 Pagination
  paginate() {
    try {
       // below we are multiplying page by 1 to convery if page is string to number
    // by multiplying any string by 1 converts string to number
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    
    if(req.query.page) {
      const numTours = await Tour.countDocumets();
      if(skip >= numTours) throw new Error('This page does not exist!')
    }

    // EXECUTE QUERY
    // const tours = await query;
     // return this means return entire object
    return this;
    }
   
    catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  
    }
  }
}
module.exports = APIFeatures;
