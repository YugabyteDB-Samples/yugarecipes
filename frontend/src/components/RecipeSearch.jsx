import React, { useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import FileInput from "./FileInput"; // Adjust the import path accordingly

const RecipeSearch = () => {
  const [query, setQuery] = useState("");
  const [image, setImage] = useState(null);

  const mutation = useMutation((formData) => {
    return axios.post("http://127.0.0.1:5000/api/search", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (query) formData.append("data", JSON.stringify({ query }));
    if (image) formData.append("image", image);

    mutation.mutate(formData);
  };

  return (
    <div className="p-4 w-full">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex flex-col items-center "
      >
        <div className="w-full flex flex-col w-2/5">
          <label className="block text-xlfont-medium text-gray-700">
            Search Query
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-l mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-10 p-3"
          />
        </div>
        {/* <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="mt-1 block w-3/5"
          />
        </div> */}
        <div className="flex gap-5">
          <FileInput setSelectedFile={setImage} />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Selected"
              className="max-w-64 object-contain"
            />
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-5 bg-orange-300 w-1/3 text-white rounded-md hover:bg-orange-400"
        >
          Search
        </button>
        {mutation.isLoading && (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-orange-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </form>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && (
        <div className="p-10">
          <div className="mb-5">
            <h2 className="font-bold text-xl border-4 border-slate-400 inline-block p-2 mb-2">
              Image Description:
            </h2>
            <p className="italic">{mutation.data.data.image_description}</p>
          </div>

          <h2 className="font-bold text-xl border-4 border-slate-400 inline-block p-2 mb-2">
            Top Results:
          </h2>
          <ul className="space-y-10">
            {mutation.data.data.results.map((result, index) => {
              const image_file_name = result.image_url.split("/").pop();
              console.log(image_file_name);
              return (
                <li key={index} className="mt-2">
                  <h3 className="font-bold">{result.name}</h3>
                  <div className="flex gap-4">
                    <img
                      src={`http://localhost:5000/static/images/${image_file_name}`}
                      alt=""
                      width={300}
                      className="self-start"
                    />
                    <div className="flex flex-col gap-2">
                      <p className="justify-start">{result.description}</p>
                      <p className="justify-start">{result.instructions}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;
