import { signIn, signInWithGoogle, signUp } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Logo from "@/components/svgs/Logo";

export default () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignin, setIsSignin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  // handle state changes for input fields based on the name attribute
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (
    e: React.MouseEvent<HTMLButtonElement | SVGElement>
  ) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  // handle credential based signin & signup
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password } = formData;
    try {
      if (isSignin) {
        await signIn(email, password);
      } else {
        await signUp(name, email, password);
      }
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      navigate("/");
    } catch (error) {
      setErrorMsg((error as Error).message);
      console.log(error);
    }
  };

  // handles different social media signins
  const handleSocialMediaSignin = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      if (e.currentTarget.name === "google") {
        await signInWithGoogle();
      } else if (e.currentTarget.name === "facebook") {
      } else if (e.currentTarget.name === "github") {
      }
      navigate("/");
    } catch (error) {
      setErrorMsg((error as Error).message);
      console.error(error);
    }
  };
  return (
    <main className="w-full flex">
      <div className="relative flex-1 hidden items-center justify-center h-screen bg-gray-900 lg:flex">
        <div className="relative z-10 w-full max-w-md flex flex-col items-center">
          <Logo width={200} height={200} msgIconColor="fill-light-primary" />
          <h2 className="text-white text-3xl font-bold mt-2">ChatBox</h2>
          <div className=" mt-16 space-y-3">
            <h3 className="text-white text-3xl font-bold">
              Start engaging more with your friends & family.
            </h3>
            <p className="text-gray-300">
              Create an account and get access to all features for 30-days, No
              credit card required.
            </p>
            <div className="flex items-center -space-x-2 overflow-hidden">
              <img
                src="https://randomuser.me/api/portraits/women/79.jpg"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://randomuser.me/api/portraits/men/86.jpg"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <p className="text-sm text-gray-400 font-medium translate-x-5">
                Joined 5k+ users
              </p>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 my-auto h-[500px]"
          style={{
            background:
              "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
            filter: "blur(118px)",
          }}
        ></div>
      </div>
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="w-full max-w-md space-y-8 px-4 bg-white text-gray-600 sm:px-0">
          <div className="">
            <div className="mt-5 space-y-2">
              {isSignin ? (
                <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                  Sign in
                </h3>
              ) : (
                <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                  Sign up
                </h3>
              )}
              {isSignin ? (
                <p className="">
                  Create new account?{" "}
                  <button
                    onClick={() => setIsSignin(!isSignin)}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsSignin(!isSignin)}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-5">
            <button
              name="google"
              onClick={handleSocialMediaSignin}
              className="flex gap-2 flex-1 items-center justify-center py-2.5 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100"
            >
              <span>Sign in with Google</span>
              <FcGoogle />
            </button>
            {/* <button className="flex flex-1 items-center justify-center py-2.5 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100">
              <FaFacebook />
            </button>
            <button className="flex flex-1 items-center justify-center py-2.5 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100">
              <FaGithub />
            </button> */}
          </div>
          <div className="relative">
            <span className="block w-full h-px bg-gray-300"></span>
            <p className="inline-block w-fit text-sm bg-white px-2 absolute -top-2 inset-x-0 mx-auto">
              Or continue with
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isSignin && (
              <div>
                <label className="font-medium">Name</label>
                <input
                  type="text"
                  required
                  onChange={handleChange}
                  name="name"
                  value={formData.name}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                />
              </div>
            )}
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                required
                onChange={handleChange}
                name="email"
                value={formData.email}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>
            <div className="relative">
              <label className="font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                onChange={handleChange}
                name="password"
                value={formData.password}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
              {showPassword ? (
                <button className="absolute right-5 top-11">
                  <FaRegEye onClick={togglePasswordVisibility} />
                </button>
              ) : (
                <button className="absolute right-5 top-11">
                  <FaRegEyeSlash onClick={togglePasswordVisibility} />
                </button>
              )}
            </div>
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            {isSignin ? (
              <button
                type="submit"
                className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
              >
                Sign in
              </button>
            ) : (
              <button
                type="submit"
                className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
              >
                Create account
              </button>
            )}
          </form>
        </div>
      </div>
    </main>
  );
};
