import { connection } from "../app.js";

export const getAllRecipes = async (req, res) => {
  let status = 200;
  let retVal = {};

  try {
    const query = "SELECT * FROM recipes";
    const [rows] = await connection.query(query);
    retVal.recipes = rows;
  } catch (error) {
    console.error(error);
    retVal.error = error;
    status = 500;
  } finally {
    res.status(status).json(retVal);
  }
};

export const getRecipeById = async (req, res) => {
  let status = 200;
  let retVal = {};

  const { id } = req.params;
  try {
    const query = `SELECT * FROM recipes WHERE recipes.id=?`;
    const [rows] = await connection.query(query, [id]);
    retVal.message = "Recipe details by id";
    retVal.recipe = [rows[0]];

    if (!retVal.recipe) {
      status = 404;
      retVal.message = `Recipe with id ${id} not found`;
    }
  } catch (error) {
    console.error(error);
    retVal.error = error;
    status = 500;
  } finally {
    res.status(status).json(retVal);
  }
};

export const createRecipe = async (req, res) => {
  let status = 200;
  let retVal = {};

  try {
    const { title, making_time, serves, ingredients, cost } = req.body;

    // Validate data
    if (!title || !making_time || !serves || !ingredients || !cost) {
      status = 200;
      retVal.message = "Recipe creation failed!";
      retVal.required = "title, making_time, serves, ingredients, cost";
    } else {
      const query =
        "INSERT INTO recipes (title, making_time, serves, ingredients, cost) VALUES (?, ?, ?, ?, ?)";
      const [result] = await connection.query(query, [
        title,
        making_time,
        serves,
        ingredients,
        cost,
      ]);

      // Retrieve the inserted recipe
      const insertedRecipeId = result.insertId;
      const selectQuery = "SELECT * FROM recipes WHERE id = ?";
      const [rows] = await connection.query(selectQuery, [insertedRecipeId]);
      retVal.message = "Recipe successfully created!";
      retVal.recipe = rows;
    }
  } catch (error) {
    console.error(error);
    retVal.message = "Recipe creation failed!";
    retVal.required = "title, making_time, serves, ingredients, cost";
    status = 500;
  } finally {
    res.status(status).json(retVal);
  }
};

export const updateRecipe = async (req, res) => {
  let status = 200;
  let retVal = {};

  try {
    const { id } = req.params;
    const { title, making_time, serves, ingredients, cost } = req.body;

    // Validate data
    if (!title && !making_time && !serves && !ingredients && !cost) {
      status = 400;
      retVal.message = "Recipe update failed!";
      retVal.required = "At least one field to update is required";
    } else {
      // Check if the recipe exists
      const checkQuery = "SELECT * FROM recipes WHERE id = ?";
      const [checkRows] = await connection.query(checkQuery, [id]);

      if (checkRows.length === 0) {
        status = 404;
        retVal.message = `Recipe with id ${id} not found`;
      } else {
        // Build the UPDATE query
        const updateFields = [];
        const updateValues = [];

        if (title) {
          updateFields.push("title = ?");
          updateValues.push(title);
        }
        if (making_time) {
          updateFields.push("making_time = ?");
          updateValues.push(making_time);
        }
        if (serves) {
          updateFields.push("serves = ?");
          updateValues.push(serves);
        }
        if (ingredients) {
          updateFields.push("ingredients = ?");
          updateValues.push(ingredients);
        }
        if (cost) {
          updateFields.push("cost = ?");
          updateValues.push(cost);
        }

        const updateQuery = `UPDATE recipes SET ${updateFields.join(", ")} WHERE id = ?`;
        await connection.query(updateQuery, [...updateValues, id]);

        // Retrieve the updated recipe
        const selectQuery = "SELECT * FROM recipes WHERE id = ?";
        const [rows] = await connection.query(selectQuery, [id]);
        retVal.message = "Recipe successfully updated!";
        retVal.recipe = rows;
      }
    }
  } catch (error) {
    console.error(error);
    retVal.message = "Recipe update failed!";
    retVal.error = error;
    status = 500;
  } finally {
    res.status(status).json(retVal);
  }
};

export const deleteRecipe = async (req, res) => {
  let status = 200;
  let retVal = {};

  try {
    const { id } = req.params;

    // Check if the recipe exists
    const checkQuery = "SELECT * FROM recipes WHERE id = ?";
    const [checkRows] = await connection.query(checkQuery, [id]);

    if (checkRows.length === 0) {
      status = 404; // Not Found
      retVal.message = `Recipe with id ${id} not found`;
    } else {
      // Delete the recipe
      const deleteQuery = "DELETE FROM recipes WHERE id = ?";
      await connection.query(deleteQuery, [id]);

      retVal.message = `Recipe with id ${id} successfully deleted`;
    }
  } catch (error) {
    console.error(error);
    retVal.message = "Recipe deletion failed!";
    retVal.error = error;
    status = 500;
  } finally {
    res.status(status).json(retVal);
  }
};
