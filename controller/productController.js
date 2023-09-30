const Product = require("../models/product");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./../middleware/catchAsyncErrors")




exports.createProduct = catchAsyncError(async (req, res, next) => {

  req.body.user = req.user._id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  })
})

exports.getAllProducts = catchAsyncError(async (req, res) => {
  console.log(req.body)
  const apifeature = new ApiFeatures(Product, req.query).search().filter().pagination(5);

  const product = await apifeature.query;
  res.status(200).json({
    success: true,
    product
  });
})

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.updateproduct = catchAsyncError(async (req, res, next) => {

  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }


  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
})

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }




  await product.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});




exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }


  const product = await Product.findById(productId);
  let isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id);
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  }
  else {
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;


  await Product.updateOne({ _id: product._id }, { $set: product },)

  res.status(200).json({
    success: true,
  });

})

// Get All Reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});






exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});