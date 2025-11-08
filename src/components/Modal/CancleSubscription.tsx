import { IoMdClose } from "react-icons/io";
import type { modal } from "../../types/modal";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import usePost from "../../hooks/usePost";
import Api from "../../services/subscription/subscription";

function CancleSubscription({ isOpen, setIsOpen }: modal) {
  const [isError, setIsError] = useState("");
  const queryClient = useQueryClient();

  const { post } = usePost();      

  const handleDelete = async () => {
    // if(!url) return setIsError("Url not found");
    try {
    const { data ,error}=  await post(Api.cancleSubscription(), {});
    if (error) return setIsError(error);
    if(data){
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setIsError(" ");
      setIsOpen(false);
    }
    } catch {
      setIsError("Something went wrong");
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-150 overflow-visible">
            <div className="flex justify-center mt-10">
              <div className="relative w-full bg-white  overflow-visible">
                <div className=" rounded-t-lg text-white text-center p-4 ">
                  <IoMdClose
                    className="absolute top-1 text-gray-600 text-2xl font-semibold right-1"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
                  {isError !== "" ? (
                    <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
                      {isError}
                    </div>
                  ) : (
                    <div className="bg-white w-full max-w-sm p-6 space-y-4 text-center">
                      <h2 className="text-lg font-semibold text-gray-800">
                        Are you sure?
                      </h2>
                      <p className="text-sm text-gray-600">
                        Are you sure you want to cancel this Plan ?
                      </p>

                      <div className="flex w-full justify-between mt-3 gap-3">
                        <button
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDelete}
                          className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                        >
                          cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CancleSubscription;
