$(document).ready(function() {
  fetchRecipes();
  
  $("#recipeForm").hide();

  // Show the add recipe form when clicking the "Add Recipe" button
  $("#showFormBtn").click(function() {
      $("#recipeForm").toggle();
  });
});

function fetchRecipes() {
  $.get("https://usman-fake-api.herokuapp.com/api/recipes", function(data) {
      displayRecipes(data);
  });
}

function displayRecipes(recipes) {
  var recipeList = $("#recipeList");
  recipeList.empty();

  $.each(recipes, function(index, recipe) {
      var listItem = $("<li></li>").addClass("recipe");
      listItem.html("<h3>" + recipe.title + "</h3><p>" + recipe.body + "</p>");

      var deleteButton = $("<button>Delete</button>").click(function() {
          deleteRecipe(recipe._id);
      });

      var updateButton = $("<button>Update</button>").click(function() {
          updateRecipeForm(recipe);
      });

      listItem.append(deleteButton);
      listItem.append(updateButton);
      recipeList.append(listItem);
  });
}

function deleteRecipe(recipeId) {
  $.ajax({
      url: "https://usman-fake-api.herokuapp.com/api/recipes/" + recipeId,
      type: "DELETE",
      success: function() {
          fetchRecipes();
      }
  });
}

function updateRecipeForm(recipe) {
  $("#title").val(recipe.title);
  $("#body").val(recipe.body);

  $("#addForm button").text("Update Recipe").unbind("click").click(function(e) {
      e.preventDefault();
      updateRecipe(recipe._id);
  });

  $("#recipeForm").show();
}

function updateRecipe(recipeId) {
  var title = $("#title").val();
  var body = $("#body").val();

  $.ajax({
      url: "https://usman-fake-api.herokuapp.com/api/recipes/" + recipeId,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ title: title, body: body }),
      success: function() {
          $("#addForm")[0].reset();
          $("#addForm button").text("Add Recipe").unbind("click").click(function(e) {
              e.preventDefault();
              addRecipe();
          });
          fetchRecipes();
          $("#recipeForm").hide();
      }
  });
}

$("#addForm").submit(function(e) {
  e.preventDefault();
  addRecipe();
});

function addRecipe() {
  var title = $("#title").val();
  var body = $("#body").val();

  $.post("https://usman-fake-api.herokuapp.com/api/recipes", { title: title, body: body }, function() {
      $("#addForm")[0].reset();
      // Fetch and display recipes after adding a new recipe
      fetchRecipes();
      // Hide the add recipe form after adding
      $("#recipeForm").hide();
  });
}
