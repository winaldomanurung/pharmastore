const database = require("../../config").promise();
const createError = require("../../helpers/createError");
const createResponse = require("../../helpers/createResponse");
const httpStatus = require("../../helpers/httpStatusCode");
const {
  addCategorySchema,
  editCategorySchema,
} = require("../../helpers/validation-schema");

module.exports.readCategories = async (req, res) => {
  try {
    // const CHECK_VERIFIED_USER = `SELECT isVerified,userId FROM users WHERE userId = ${database.escape(
    //   userId
    // )}`;
    // const [VERIFIED_USER] = await database.execute(CHECK_VERIFIED_USER);

    let GET_CATEGORIES = `SELECT * FROM categories;`;

    const [CATEGORIES] = await database.execute(GET_CATEGORIES);

    // const GET_CATEGORIES_TOTAL = `SELECT * FROM categories;`;
    // const [TOTAL_CATEGORIES] = await database.execute(GET_CATEGORIES_TOTAL);

    const response = new createResponse(
      httpStatus.OK,
      "Products data fetched",
      "Products data fetched successfully!",
      CATEGORIES,
      CATEGORIES.length
    );

    res.status(response.status).send(response);
  } catch (err) {
    console.log("error : ", err);
    const isTrusted = err instanceof createError;
    if (!isTrusted) {
      err = new createError(
        httpStatus.Internal_Server_Error,
        "SQL Script Error",
        err.sqlMessage
      );
      console.log(err);
    }
    res.status(err.status).send(err);
  }
};

module.exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    // check category data by its categoryId
    const CHECK_CATEGORY = `SELECT * FROM categories WHERE id = ?;`;
    const [CATEGORY] = await database.execute(CHECK_CATEGORY, [categoryId]);
    if (!CATEGORY.length) {
      throw new createError(
        httpStatus.Bad_Request,
        "Delete category failed",
        "Category is not exist!"
      );
    }

    // define query delete
    const DELETE_CATEGORY = `DELETE FROM categories WHERE id = ?;`;
    const [DELETED_CATEGORY] = await database.execute(DELETE_CATEGORY, [
      categoryId,
    ]);

    console.log(DELETED_CATEGORY);

    // send respond to client-side
    const response = new createResponse(
      httpStatus.OK,
      "Delete category success",
      "Category deleted successfully!",
      "",
      ""
    );

    res.status(response.status).send(response);
  } catch (err) {
    console.log("error : ", err);
    const isTrusted = err instanceof createError;
    if (!isTrusted) {
      err = new createError(
        httpStatus.Internal_Server_Error,
        "SQL Script Error",
        err.sqlMessage
      );
      console.log(err);
    }
    res.status(err.status).send(err);
  }
};

module.exports.updateCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const name = req.body.name;
  console.log(categoryId, name);

  try {
    // 1. Check data apakah product exist di dalam database
    const FIND_CATEGORY = `SELECT * FROM categories WHERE id = ${database.escape(
      categoryId
    )};`;

    const [CATEGORY] = await database.execute(FIND_CATEGORY);
    if (!CATEGORY.length) {
      throw new createError(
        httpStatus.Bad_Request,
        "Category update failed",
        "Category is not exist!"
      );
    }

    // 2. Check apakah body memiliki content
    const isEmpty = !Object.keys(req.body).length;
    if (isEmpty) {
      throw new createError(
        httpStatus.Bad_Request,
        "Category update failed",
        "Your update form is incomplete!"
      );
    }

    // 3. Gunakan Joi untuk validasi data dari body
    const { error } = editCategorySchema.validate(req.body);
    if (error) {
      throw new createError(
        httpStatus.Bad_Request,
        "Category update failed",
        error.details[0].message
      );
    }

    //  4. Buat query untuk update
    const UPDATE_CATEGORY = `UPDATE categories SET name=${database.escape(
      name
    )} WHERE id = ${database.escape(categoryId)};`;
    console.log(UPDATE_CATEGORY);
    const [UPDATED_CATEGORY] = await database.execute(UPDATE_CATEGORY);
    console.log(UPDATED_CATEGORY[0]);

    const [FIND_UPDATED_CATEGORY] = await database.execute(FIND_CATEGORY);

    const response = new createResponse(
      httpStatus.OK,
      "Update category success",
      "Category update saved successfully!",
      FIND_UPDATED_CATEGORY[0],
      ""
    );

    res.status(response.status).send(response);
  } catch (err) {
    console.log("error : ", err);
    const isTrusted = err instanceof createError;
    if (!isTrusted) {
      err = new createError(
        httpStatus.Internal_Server_Error,
        "SQL Script Error",
        err.sqlMessage
      );
      console.log(err);
    }
    res.status(err.status).send(err);
  }
};

module.exports.createCategory = async (req, res) => {
  let name = req.body.name;
  console.log(name);

  try {
    // validation for body
    const { error } = addCategorySchema.validate(req.body);
    if (error) {
      throw new createError(
        httpStatus.Bad_Request,
        "Create product failed",
        error.details[0].message
      );
    }

    // validation for duplicate data
    const CHECK_DATA = `
            SELECT id 
            FROM categories 
            WHERE name = ${database.escape(name)};`;
    const [DATA] = await database.execute(CHECK_DATA);
    if (DATA.length) {
      throw new createError(
        httpStatus.Bad_Request,
        "Create category failed",
        "Category already exists!"
      );
    }

    // define query
    const INSERT_CATEGORY = `
            INSERT INTO categories(name)
            VALUES(
                ${database.escape(name)}
            );
        `;
    const [CATEGORY] = await database.execute(INSERT_CATEGORY);

    // create respond
    const response = new createResponse(
      httpStatus.OK,
      "Add category success",
      `Your can now use '${name}' as product category.`,
      CATEGORY,
      ""
    );
    res.status(response.status).send(response);
  } catch (err) {
    console.log("error : ", err);
    const isTrusted = err instanceof createError;
    if (!isTrusted) {
      err = new createError(
        httpStatus.Internal_Server_Error,
        "SQL Script Error",
        err.sqlMessage
      );
      console.log(err);
    }
    res.status(err.status).send(err);
  }
};
