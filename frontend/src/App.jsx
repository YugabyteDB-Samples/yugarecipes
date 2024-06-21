import React from "react";
import RecipeSearch from "./components/RecipeSearch";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center">
      <div className="flex flex-col items-center bg-whit rounded-md w-full">
        <div className="p-6 bg-slate-200 w-full border-b-4 border-slate-400 flex flex-row items-center gap-3">
          <img src="indian_food_icon.png" width="50" alt="" />
          <h1 className="text-3xl text-orange-400 font-bold text-left mb-0">
            YugaRecipes
          </h1>
        </div>
        <RecipeSearch />
      </div>
    </div>
  );
}

export default App;
